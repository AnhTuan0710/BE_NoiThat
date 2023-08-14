import { Order } from './order.entity';
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity({name: 'products'})
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  listed_price: number;

  @Column()
  sell_price: number;

  @Column()
  image: string;

  @Column()
  size: string;

  @Column()
  weight: string;

  @Column()
  unit: string;

  @Column()
  description: string;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @ManyToMany(() => Order)
  orders: Order[];

  @Column({ nullable: true })
  create_date?: Date;

  @Column({ nullable: true })
  update_date?: Date;

  @Column({ default: 1 })
  active_flg?: number;

  @Column({ default: 1 })
  status?: number;
}
