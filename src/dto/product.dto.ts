import { ApiProperty } from "@nestjs/swagger";
import { Product } from "../models/product.entity";
export interface ProductRespose {
  data: Product[],
  total: number
}

export class ProductTrendingDto extends Product {
  total_sale: number
}

export class ProductSearchDto {
  @ApiProperty({
    description: 'category_id',
    example: '[1,2]',
  })
  category_id?: number[];

  @ApiProperty({
    description: 'name',
    example: 'Bàn',
  })
  name?: string
}

export class ProductCreateDto {
  @ApiProperty({
    description: 'name',
    example: 'Bàn',
  })
  name: string;

  @ApiProperty({
    description: 'listed_price',
    example: 122435,
  })
  listed_price: number;

  @ApiProperty({
    description: 'sell_price',
    example: 122435,
  })
  sell_price: number;

  @ApiProperty({
    description: 'image',
    example: 'link anh',
  })
  image: string;

  @ApiProperty({
    description: 'size',
    example: '1.2m * 3m',
  })
  size?: string;

  @ApiProperty({
    description: 'weight',
    example: '20kg',
  })
  weight?: string;

  @ApiProperty({
    description: 'description',
    example: 'San pham noi bat',
  })
  description?: string;

  @ApiProperty({
    description: 'category_id',
    example: 1,
  })
  category_id: number;

  @ApiProperty({
    description: 'unit',
    example: 'Cái',
  })
  unit?: string;
}

export class ProductUpdateDto extends ProductCreateDto {
  @ApiProperty({
    description: 'status',
    example: 1,
  })
  status: number;
}