export class CreateOrderDto {
  totalAmount: number;
  userId: number;
  productIds: ProductOrderDto[];
}

export class UpdateOrderDto {
  orderNumber?: string;
  totalAmount?: number;
  userId?: number;
  productIds?: ProductOrderDto[];
  status?: number;
}

export class OrderCreateNewDto {
  userId: number;
  product: ProductOrderDto[];
  totalAmount: number;
  createDate?: string;
  updateDate?: string;
}

export class ProductOrderDto {
  id: number;
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