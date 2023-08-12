import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UpdateUserDto } from '../../dto/user.dto';
import { User } from '../../models/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  update(id: any, user: any) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(User)
    private readonly usersService: Repository<User>
  ) { }

  async findOne(email: string): Promise<User | undefined> {
    return this.usersService.findOne({ where: { email: email } });
  }

  async regiter(user: User): Promise<User> {
    user.create_date = new Date()
    user.update_date = new Date()
    return await this.usersService.save(user)
  }

  async findAll(): Promise<User[] | undefined> {
    return await this.usersService.find({ where: { active_flg: 1 } })
  }

  async getUserInfo(id: number): Promise<User | undefined> {
    return this.usersService.findOne({ where: { id: id } });
  }

  async findById(id: number): Promise<User | undefined> {
    return this.usersService.findOne({ where: { id: id } });
  }

  async updateInfoUser(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    const user = await this.usersService.findOne({ where: { id: id } })
    if (!user) {
      throw new HttpException('Không tìm thấy khách hàng', HttpStatus.NOT_FOUND);
    }
    if (updateUserDto.address) {
      user.address = updateUserDto.address
    }
    if (updateUserDto.name) {
      user.name = updateUserDto.name
    }
    if (updateUserDto.phone_no) {
      user.phone_no = updateUserDto.phone_no
    }
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(updateUserDto.password, salt);
      user.password = hashedPassword
    }
    user.update_date = new Date()
    return this.usersService.update(id, user)
  }

  async delete(id: number): Promise<void> {
    const user = await this.usersService.findOne({ where: { id: id } })
    this.usersService.update(id, { ...user, active_flg: 0 })
  }
}