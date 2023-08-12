import { UsersService } from './user.service';
import { Controller, UseGuards, Get, Query, Request, Put, Param, Body, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../models/user.entity';
import { UpdateResult } from 'typeorm';
import { UpdateUserDto } from '../../dto/user.dto';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private userService: UsersService) { }

  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  getProfile(@Query('id') id: number) {
    return this.userService.getUserInfo(id)
  }

  @Get()
  findAll() {
    return this.userService.findAll()
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getUserInfo(@Request() req) {
    return req.user;
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    return await this.userService.updateInfoUser(id, updateUserDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.userService.delete(id);
  }
}