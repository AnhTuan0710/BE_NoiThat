import { Category } from './../../models/category.entity';
import { Product } from './../../models/product.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCreateDto, ProductRespose, ProductSearchDto, ProductTrendingDto, ProductUpdateDto } from '../../dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  async createProduct(productDto: ProductCreateDto): Promise<Product> {
    const { name, sell_price, image, size, weight, description, category_id, unit, listed_price } = productDto;
    const category = await this.categoryRepository.findOne({ where: { id: category_id } });
    if (category) {
      const product = new Product();
      product.name = name;
      product.listed_price = listed_price;
      product.sell_price = sell_price
      product.image = image;
      product.size = size;
      product.weight = weight;
      product.unit = unit;
      product.description = description;
      product.category = category;
      product.active_flg = 1;
      product.create_date = new Date();
      product.status = 1;
      product.update_date = new Date();
      return await this.productRepository.save(product);
    } else {
      throw new HttpException('Mã danh mục không tồn tại!', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(searchParam: ProductSearchDto, page: number, size: number,): Promise<ProductRespose> {
    const { category_id, name } = searchParam;
    const queryBuilder = this.productRepository.createQueryBuilder('products')
      .leftJoinAndSelect('products.category', 'categories')
      .where('products.active_flg != 0');
    if (category_id && category_id.length > 0) {
      queryBuilder.andWhere('categories.id IN (:...category_id)', { category_id });
    }
    if (name) {
      queryBuilder.andWhere('products.name LIKE :name', { name: `%${name}%` });
    }
    const data: ProductRespose = {
      data: (await queryBuilder.skip((page - 1) * size).take(size).getMany()),
      total: (await queryBuilder.getCount())
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

  async updateProduct(id: number, productDto: ProductUpdateDto): Promise<Product> {
    const { name, listed_price, image, size, weight, description, category_id, status, unit, sell_price } = productDto;
    const category = await this.categoryRepository.findOne({ where: { id: category_id } });
    if (category) {
      const product = await this.productRepository.findOne({ where: { id: id } });
      if (product) {
        product.name = name;
        product.listed_price = listed_price;
        product.sell_price = sell_price;
        product.image = image;
        product.size = size;
        product.weight = weight;
        product.description = description;
        product.category = category;
        product.status = status;
        product.unit = unit;
        return await this.productRepository.save(product);
      } else {
        throw new HttpException('Mã sản phẩm không tồn tại!', HttpStatus.BAD_REQUEST);
      }
    }
    throw new HttpException('Mã danh mục không tồn tại !', HttpStatus.BAD_REQUEST);
  }

  async delete(id: number): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id: id, active_flg: 1 } })
    if (product) {
      product.active_flg = 0;
      await this.productRepository.update(id, product);
      throw new HttpException('Xóa thành công', HttpStatus.OK);
    } else {
      throw new HttpException('Mã sản phẩm không tồn tại hoặc đã xóa!', HttpStatus.BAD_REQUEST);
    }
  }

  async getBestSellingProducts(): Promise<ProductTrendingDto[]> {
    const queryBuilder = await this.productRepository.createQueryBuilder('products')
      .innerJoin('detail_order', 'ddo', 'ddo.product_id = products.id')
      .select('SUM(ddo.quantity)', 'total_sale')
      .addSelect('products.*')
      .where('products.active_flg != 0')
      .andWhere('products.status != 0')
      .groupBy('products.id')
      .orderBy('total_sale', 'DESC');
    return queryBuilder.getRawMany()
  }
}