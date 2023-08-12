import { OrderDetail } from './../../models/orderDetail';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class OrderDetailService {
  constructor(
    @InjectRepository(OrderDetail)
    private readonly orderDetailResponse: Repository<OrderDetail>,
  ) { }

  async deleteOrder(id: number): Promise<void> {
    await this.orderDetailResponse.delete(id);
  }

}
