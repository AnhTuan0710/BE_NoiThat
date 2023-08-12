import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../models/category.entity';

@Injectable()
export class CategoryService {
  logger: any;
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findOne(id: number): Promise<Category> {
    return this.categoryRepository.findOne({ where: { id: id }, relations: ['products'] });
  }

  async findByName(nameCate: string): Promise<Category> {
    return this.categoryRepository.findOne({ where: { name: nameCate } });
  }

  async create(category: Category): Promise<Category> {
    const categoryNew = new Category();
    categoryNew.name = category.name
    categoryNew.active_flg = 1
    categoryNew.create_date = new Date()
    categoryNew.status = 1
    categoryNew.update_date = new Date()
    return this.categoryRepository.save(categoryNew);
  }

  async update(id: number, category: Category): Promise<Category> {
    await this.categoryRepository.update(id, category);
    return this.categoryRepository.findOne({ where: { id: id } });
  }

  async delete(id: number, category: Category): Promise<void> {
    const categoryNew = new Category();
    categoryNew.name = category.name
    categoryNew.active_flg = 0
    categoryNew.create_date = category.create_date
    categoryNew.status = category.status
    categoryNew.update_date = new Date()
    await this.categoryRepository.update(id, categoryNew);
    throw new HttpException('Xóa thuốc thành công', HttpStatus.OK);
  }

  async findAllWithProducts(): Promise<Category[]> {
    const queryBuilder = this.categoryRepository.createQueryBuilder('category')
      .leftJoinAndSelect('category.products', 'product')
    const categories = await queryBuilder.getMany();
    const cateNew = categories.filter(item => item.active_flg !== 0)
    return cateNew;
  }
}
