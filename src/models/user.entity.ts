import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Order } from './order.entity';
@Entity({ name: 'dv_user' })
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ length: 500 })
  name: string;

  @Column({ length: 500 })
  email: string;

  @Column({ length: 500 })
  role?: string;

  @Column()
  password: string;

  @Column({ length: 500, default: '' })
  address?: string;

  @Column({ length: 12, default: '' })
  phone_no?: string;

  @Column({ nullable: true })
  create_date?: Date;

  @Column({ nullable: true })
  update_date?: Date;

  @Column({ default: 1 })
  active_flg?: number;

  @Column({ default: 1 })
  status?: number;

  @OneToMany(() => Order, order => order.user)
  orders?: Order[];
}