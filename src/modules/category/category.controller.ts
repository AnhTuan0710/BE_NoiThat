import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { Category } from '../../models/category.entity';
import { CategoryService } from './category.service';

@Controller('categories')
@ApiTags('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get()
  @ApiOkResponse({ description: 'Category retrieved successfully.' })
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get('product')
  @ApiOkResponse({ description: 'Product of category retrieved successfully.' })
  findAllWithProducts(): Promise<Category[]> {
    return this.categoryService.findAllWithProducts();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Category retrieved successfully.' })
  @ApiNotFoundResponse({ description: 'Category not found.' })
  findOne(@Param('id') id: string): Promise<Category> {
    return this.categoryService.findOne(+id);
  }

  @Post()
  @ApiCreatedResponse({ description: 'Category created successfully.' })
  @ApiUnprocessableEntityResponse({ description: 'Category title already exists.' })
  async create(@Body() category: Category): Promise<Category> {
    const oldName = await this.categoryService.findByName(category.name);
    if (oldName) {
      throw new HttpException('Tên danh mục đã tồn tại!', HttpStatus.BAD_REQUEST);
    }
    return this.categoryService.create(category);
  }

  @Put(':id')
  @ApiOkResponse({ description: 'Category updated successfully.' })
  @ApiNotFoundResponse({ description: 'Category not found.' })
  @ApiUnprocessableEntityResponse({ description: 'Category title already exists.' })

  update(@Param('id') id: string, @Body() category: Category): Promise<Category> {
    return this.categoryService.update(+id, category);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Category deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Category not found.' })
  async delete(@Param('id') id: number): Promise<void> {
    const category = await this.categoryService.findOne(id);
    return this.categoryService.delete(+id, category);
  }
}
