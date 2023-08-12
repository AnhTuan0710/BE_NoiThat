import { Product } from "../models/product.entity";

export class ProductDto {
  name?: string;
  price?: number;
  image?: string;
  size?: string;
  weight?: string;
  description?: string;
  categoryId: number;
  unit?: string;
  status?: number;
}

export interface ProductRespose {
  data: Product[],
  total: number
}

export class ProductTrendingDto extends Product {
  total_sale: number
}

export class ProductSearchDto {
  categoryId?: number[]
  name?: string
}