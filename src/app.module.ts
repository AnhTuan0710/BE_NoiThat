import { OrderDetailModule } from './modules/orderDetail/orderDetail.module';
import { OrderDetail } from './models/orderDetail';
import { CategoriesModule } from './modules/category/category.module';
import { Category } from './models/category.entity';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/user/user.module';
import { User } from './models/user.entity';
import { DATABASE } from './config';
import { Product } from './models/product.entity';
import { ProductsModule } from './modules/product/product.module';
import { Order } from './models/order.entity';
import { OrdersModule } from './modules/order/order.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: DATABASE.TYPE,
      host: DATABASE.HOST,
      port: DATABASE.PORT,
      username: DATABASE.USER_NAME,
      password: DATABASE.PASSWORD,
      database: DATABASE.DATABASE,
      entities: [User, Product, Category, Order, OrderDetail],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    OrderDetailModule,
  ],
  controllers: [
    AppController
  ],
  providers: [AppService],
})
export class AppModule { }