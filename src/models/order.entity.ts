import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { OrderDetail } from './orderDetail';
import { Product } from './product.entity';
import { User } from './user.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  totalAmount: number;

  @ManyToOne(() => User, user => user.orders)
  user: User;

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
