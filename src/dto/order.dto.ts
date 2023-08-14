import { ApiProperty } from "@nestjs/swagger";

export class CreateOrderDto {
  @ApiProperty({
    description: 'totalAmount',
    example: 1500000,
  })
  total_amount: number;

  @ApiProperty({
    description: 'productIds',
    example: '[{ id: 1, quantity: 2}, {id: 2, quantity: 10}]',
  })
  products: ProductOrderDto[];

  @ApiProperty({
    description: 'phone_no',
    example: '0857847685',
  })
  phone_no: string;

  @ApiProperty({
    description: 'address',
    example: 'Yen Loc Y Yen Nam Dinh',
  })
  address: string;

  @ApiProperty({
    description: 'name',
    example: 'Anh Tuan',
  })
  name: string;
}

export class UpdateOrderDto extends CreateOrderDto {
  @ApiProperty({
    description: 'status',
    example: 1,
  })
  status: number;
}

export class OrderCreateNewDto {
  userId: number;
  product: ProductOrderDto[];
  totalAmount: number;
  createDate?: string;
  updateDate?: string;
}

export class ProductOrderDto {
  @ApiProperty({
    description: 'id',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'quantity',
    example: 10,
  })
  quantity: number;
}

export class ReportRenuave {
  time: string | number;
  total: number;
  total_invoice: number;
}

export class ReportTime {
  total_order_date: number;
  total_date: number;
  total_order_month: number;
  total_month: number;
}