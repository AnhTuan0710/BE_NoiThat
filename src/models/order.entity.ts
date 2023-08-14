import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { OrderDetail } from './orderDetail';
import { Product } from './product.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total_amount: number;

  @Column()
  phone_no: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];

  @Column({ nullable: true })
  create_date?: Date;

  @Column({ nullable: true })
  update_date?: Date;

  @Column({ default: 1 })
  active_flg?: number;

  @Column({ default: 2 })
  status?: number;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetails: OrderDetail[];
}
