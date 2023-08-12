import { OrderDetail } from './../../models/orderDetail';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "../../models/order.entity";
import { Repository } from "typeorm";
import { CreateOrderDto, ReportRenuave, ReportTime, UpdateOrderDto } from "../../dto/order.dto";
import { Product } from "../../models/product.entity";
import { User } from "../../models/user.entity";
import { MailService } from '../mail/mail.service';
import { addDays, endOfDay, endOfMonth, format, parseISO, startOfDay, startOfMonth } from 'date-fns';
import * as moment from 'moment';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    private mailService: MailService,
  ) { }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, productIds } = createOrderDto;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const order = await this.orderRepository.create({ user });
    order.totalAmount = createOrderDto.totalAmount,
      order.create_date = new Date()
    order.update_date = new Date()
    await this.orderRepository.save(order);
    const orderDetails: OrderDetail[] = [];
    for (const product of productIds) {
      const { id, quantity } = product;
      const orderDetail = await this.orderDetailRepository.create({
        orderId: order.id,
        productId: id,
        quantity,
      });
      await this.orderDetailRepository.save(orderDetail);
      orderDetails.push(orderDetail);
    }
    order.orderDetails = orderDetails;
    const ids = createOrderDto.productIds.map(item => { return item.id })
    const products = await this.productRepository.findByIds(ids);
    order.products = products;
    await this.orderRepository.save(order);
    try {
      await this.mailService.sendCreateOrderEmail(user.name, user.email, createOrderDto);
      console.log('Create email order successly')
    } catch (error) {
      console.log('ERROR: Không gửi được email ', error)
    }
    return order;
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.find({ where: { active_flg: 1 }, relations: ['user', 'products', 'orderDetails'] });
  }

  async getOrderById(id: number): Promise<Order> {
    return this.orderRepository.findOne({ where: { id: id }, relations: ['user', 'products'] });
  }

  async updateOrder(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id: id } });

    if (updateOrderDto.totalAmount) {
      order.totalAmount = updateOrderDto.totalAmount;
    }

    if (updateOrderDto.userId) {
      const user = await this.userRepository.findOne({ where: { id: updateOrderDto.userId } });
      order.user = user;
    }

    if (updateOrderDto.productIds) {
      const productUpdate = updateOrderDto.productIds
      const listOrderDetail = await this.orderDetailRepository.find({ where: { orderId: id } })
      listOrderDetail.forEach(async (item: OrderDetail) => {
        await this.orderDetailRepository.delete(item.id)
      })
      for (const product of productUpdate) {
        const { id, quantity } = product;
        const orderDetail = await this.orderDetailRepository.create({
          orderId: order.id,
          productId: id,
          quantity,
        });
        await this.orderDetailRepository.save(orderDetail);
      }
      const ids = updateOrderDto.productIds.map(item => { return item.id })
      const products = await this.productRepository.findByIds(ids);
      order.products = products;
    }

    if (updateOrderDto.status !== -1) {
      order.status = updateOrderDto.status;
    }

    order.update_date = new Date()
    return this.orderRepository.save(order);
  }

  async deleteOrder(id: number): Promise<void> {
    const order = await this.orderRepository.findOne({ where: { id: id } })
    order.active_flg = 0
    await this.orderRepository.update(id, order);
  }

  async findByUserId(userId: number): Promise<Order[]> {
    const user = await this.userRepository.findOne({ where: { id: userId, active_flg: 1 } });
    return this.orderRepository.find({ where: { user: user, active_flg: 1 }, relations: ['user', 'products', 'orderDetails'] });
  }

  async getTotalByDay(startDate: string, endDate: string): Promise<ReportRenuave[]> {
    const today = new Date()
    const start = startDate ? parseISO(startDate) : startOfMonth(today);
    const end = endDate ? parseISO(endDate) : endOfMonth(today);

    const dateList: string[] = [];
    let currentDate = start;
    while (currentDate <= end) {
      dateList.push(format(currentDate, 'yyyy-MM-dd'));
      currentDate = addDays(currentDate, 1);
    }
    const result: ReportRenuave[] = await this.orderRepository
      .createQueryBuilder('orders')
      .select('DATE(orders.create_date) as time')
      .addSelect('SUM(orders.totalAmount) as total')
      .addSelect('COUNT(orders.id) as total_invoice')
      .where(`orders.create_date >= :startDate AND orders.create_date <= :endDate`, { startDate, endDate })
      .andWhere('orders.active_flg != 0')
      .andWhere('orders.status != 0')
      .groupBy('DATE(orders.create_date)')
      .orderBy('DATE(orders.create_date)')
      .getRawMany();

    let listData: ReportRenuave[] = []
    dateList.forEach((date: string) => {
      const dateIndex = result.findIndex((item: ReportRenuave) => moment(item.time).format() === moment(date).format())
      if (dateIndex !== -1) {
        listData.push({
          time: Number(moment(date).format('DD')),
          total: Number(result[dateIndex].total),
          total_invoice: Number(result[dateIndex].total_invoice)
        })
      } else {
        listData.push({
          time: Number(moment(date).format('DD')),
          total: 0,
          total_invoice: 0
        })
      }
    })
    return listData;
  }

  async getTotalByMonth(): Promise<ReportRenuave[]> {
    const result = await this.orderRepository
      .createQueryBuilder('orders')
      .select('MONTH(orders.create_date) as time')
      .addSelect('SUM(orders.totalAmount) as total')
      .addSelect('COUNT(orders.id) as total_invoice')
      .andWhere('orders.active_flg != 0')
      .andWhere('orders.status != 0')
      .groupBy('MONTH(orders.create_date)')
      .orderBy('MONTH(orders.create_date)')
      .getRawMany();
    let listData: ReportRenuave[] = []
    for (let i = 1; i <= 12; i++) {
      const index = result.findIndex(item => item.time === i)
      if (index !== -1) {
        listData.push({
          time: `Tháng ${i}`,
          total: Number(result[index].total),
          total_invoice: Number(result[index].total_invoice)
        })
      } else {
        listData.push({
          time: `Tháng ${i}`,
          total: 0,
          total_invoice: 0
        })
      }
    }
    return listData
  }

  async reportTime(): Promise<ReportTime> {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);
    const startMonth = startOfMonth(today);
    const endMonth = endOfMonth(today);

    const dailyResult: ReportRenuave[] = await this.orderRepository
      .createQueryBuilder('orders')
      .select('SUM(orders.totalAmount) as total')
      .addSelect('COUNT(orders.id) as total_invoice')
      .where('orders.create_date >= :startOfToday AND orders.create_date <= :endOfToday', {
        startOfToday,
        endOfToday,
      })
      .andWhere('orders.active_flg != 0')
      .andWhere('orders.status != 0')
      .getRawMany();

    const monthlyResult: ReportRenuave[] = await this.orderRepository
      .createQueryBuilder('orders')
      .select('SUM(orders.totalAmount) as total')
      .addSelect('COUNT(orders.id) as total_invoice')
      .where('orders.create_date >= :startMonth AND orders.create_date <= :endMonth', {
        startMonth,
        endMonth,
      })
      .andWhere('orders.active_flg != 0')
      .andWhere('orders.status != 0')
      .getRawMany();

    const total_date = dailyResult.length > 0 ? Number(dailyResult[0].total) : 0;
    const total_order_date = dailyResult.length > 0 ? Number(dailyResult[0].total_invoice) : 0;
    const total_month = monthlyResult.length > 0 ? Number(monthlyResult[0].total) : 0;
    const total_order_month = monthlyResult.length > 0 ? Number(monthlyResult[0].total_invoice) : 0;

    return { total_order_date, total_date, total_order_month, total_month };
  }
}
