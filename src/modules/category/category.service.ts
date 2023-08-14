import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Category } from '../../models/category.entity';
import { CreateCategoryDto } from '../../dto/category.dto';
import { Product } from '../../models/product.entity';

@Injectable()
export class CategoryService {
  logger: any;
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectEntityManager() private entityManager: EntityManager,
  ) { }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({ where: { active_flg: 1 } });
  }

  async findOne(id: number): Promise<Category> {
    return this.categoryRepository.findOne({ where: { id: id }, relations: ['products'] });
  }

  async findByName(nameCate: string): Promise<Category> {
    return this.categoryRepository.findOne({ where: { name: nameCate, active_flg: 1 } });
  }

  async create(category: CreateCategoryDto): Promise<Category> {
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
    await this.entityManager.transaction(async transactionalEntityManager => {
      await transactionalEntityManager
        .createQueryBuilder()
        .update(Product)
        .set({ active_flg: 0 })
        .where('category_id = :category_id', { category_id: id })
        .execute();
    });

    const categoryNew = new Category();
    categoryNew.active_flg = 0
    await this.categoryRepository.update(id, categoryNew);
    throw new HttpException('Xóa danh mục thành công', HttpStatus.OK);
  }

  async findAllWithProducts(): Promise<Category[]> {
    const queryBuilder = this.categoryRepository.createQueryBuilder('category')
      .leftJoinAndSelect('category.products', 'product')
    const categories = await queryBuilder.getMany();
    const cateNew = categories.filter(item => item.active_flg !== 0)
    return cateNew;
  }
}
