import { ProductCreateDto, ProductSearchDto, ProductTrendingDto, ProductUpdateDto } from './../../dto/product.dto';
import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '../../models/product.entity';
import { ProductRespose } from '../../dto/product.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('products')
@ApiTags('products')
export class ProductController {
  constructor(private productService: ProductService) { }

  @Get('trending')
  async getTranding(): Promise<ProductTrendingDto[]> {
    return await this.productService.getBestSellingProducts();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async create(@Body() createProductDto: ProductCreateDto): Promise<Product> {
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

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateProductDto: ProductUpdateDto): Promise<Product> {
    return await this.productService.updateProduct(id, updateProductDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.productService.delete(id);
  }
}
