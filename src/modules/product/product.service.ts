import { Category } from './../../models/category.entity';
import { Product } from './../../models/product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductDto, ProductRespose, ProductSearchDto, ProductTrendingDto } from '../../dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  async createProduct(productDto: ProductDto): Promise<Product> {
    const { name, price, image, size, weight, description, categoryId, unit } = productDto;
    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
    const product = new Product();
    product.name = name;
    product.price = price;
    product.image = image;
    product.size = size;
    product.weight = weight;
    product.unit = unit;
    product.description = description;
    product.category = category;
    return await this.productRepository.save(product);
  }

  async findAll(searchParam: ProductSearchDto, page: number, size: number,): Promise<ProductRespose> {
    const { categoryId, name } = searchParam;
    const queryBuilder = this.productRepository.createQueryBuilder('products')
      .leftJoinAndSelect('products.category', 'categories')
      .where('products.active_flg != 0');
    if (categoryId && categoryId.length > 0) {
      queryBuilder.andWhere('categories.id IN (:...categoryId)', { categoryId });
    }

    if (name) {
      queryBuilder.andWhere('products.name LIKE :name', { name: `%${name}%` });
    }

    const data: ProductRespose = {
      data: (await queryBuilder.skip((page - 1) * size).take(size).getMany()),
      total: (await this.productRepository.find({ where: { active_flg: 1 } })).length
    };

    return data;
  }


  async findOne(id: number): Promise<Product> {
    return await this.productRepository.findOne({
      where: {
        id: id,
      },
      relations: ['category']
    });
  }

  async updateProduct(id: number, productDto: ProductDto): Promise<Product> {
    const { name, price, image, size, weight, description, categoryId, status, unit } = productDto;
    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
    const product = await this.productRepository.findOne({ where: { id: id } });
    product.name = name;
    product.price = price;
    product.image = image;
    product.size = size;
    product.weight = weight;
    product.description = description;
    product.category = category;
    product.status = status;
    product.unit = unit;
    return await this.productRepository.save(product);
  }

  async delete(id: number): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id: id } })
    product.active_flg = 0
    await this.productRepository.update(id, product);
  }

  async getAllProductOfCategory(id: number): Promise<Product[]> {
    const listproduct = await this.productRepository.find({ relations: ['category'] });
    return listproduct.filter(item => item.category.id === id)
  }

  async getBestSellingProducts(): Promise<ProductTrendingDto[]> {
    const queryBuilder = await this.productRepository.createQueryBuilder('products')
      .innerJoin('detail_order', 'ddo', 'ddo.productId = products.id')
      .select('SUM(ddo.quantity)', 'total_sale')
      .addSelect('products.*')
      .where('products.active_flg != 0')
      .andWhere('products.status != 0')
      .groupBy('products.id')
      .orderBy('total_sale', 'DESC');
    return queryBuilder.getRawMany()
  }
}