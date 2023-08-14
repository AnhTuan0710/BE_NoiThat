import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity({name: 'detail_order'})
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order_id: number;

  @Column()
  product_id: number;

  @Column()
  quantity: number;

  @Column()
  status: number;

  @Column()
  active_flg: number;

  @ManyToOne(() => Order, (order) => order.products)
  order: Order;

  @ManyToOne(() => Product, (product) => product.orders)
  product: Product;
}
