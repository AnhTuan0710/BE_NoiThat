import { OrderDetail } from './../../models/orderDetail';
import { OrderDetailService } from './orderDetai.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([OrderDetail])],
  providers: [OrderDetailService],
  exports: [OrderDetailService, TypeOrmModule],
})
export class OrderDetailModule { }