import { ProductSearchDto, ProductTrendingDto } from './../../dto/product.dto';
import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '../../models/product.entity';
import { ProductDto, ProductRespose } from '../../dto/product.dto';
import { ApiTags } from '@nestjs/swagger';

// @UseGuards(JwtAuthGuard)
@Controller('products')
@ApiTags('products')
export class ProductController {
  constructor(private productService: ProductService) { }

  @Get('trending')
  async getTranding(): Promise<ProductTrendingDto[]> {
    return await this.productService.getBestSellingProducts();
  }

  @Post('create')
  async create(@Body() createProductDto: ProductDto): Promise<Product> {
    return await this.productService.createProduct(createProductDto);
  }

  @Post()
  async findAll(@Body() searchParam: ProductSearchDto, @Query('page') page: number, @Query('size') size: number): Promise<ProductRespose> {
    return await this.productService.findAll(searchParam, page, size);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Product> {
    return await this.productService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateProductDto: ProductDto): Promise<Product> {
    return await this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.productService.delete(id);
  }

  @Get('category/:id')
  async findAllWithCategory(@Param('id') id: number): Promise<Product[]> {
    return await this.productService.getAllProductOfCategory(id);
  }

}
