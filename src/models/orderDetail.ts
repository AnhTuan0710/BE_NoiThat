import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity({name: 'detail_order'})
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;

  @Column()
  productId: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Order, (order) => order.products)
  order: Order;

  @ManyToOne(() => Product, (product) => product.orders)
  product: Product;
}
