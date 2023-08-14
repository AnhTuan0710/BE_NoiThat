import { Controller, Post, Body, Logger, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { UsersService } from '../user/user.service';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto, LoginDto, RegisterDto } from '../../dto/user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private mailService: MailService,
  ) { }

  @Post('login')
  async login(@Body() req: LoginDto) {
    this.logger.log(`Bạn đang đăng nhập với tài khoản ${req}`);
    return this.authService.login(req);
  }

  @Post('register')
  async register(@Body() signUpDto: RegisterDto) {
    this.logger.log(`Start signup user with data ${JSON.stringify(signUpDto)}`);
    const { email, password, name } = signUpDto;
    const oldEmail = await this.userService.findOne(email);
    if (oldEmail) {
      this.logger.warn(`Email is already used ${signUpDto.email}`);
      throw new HttpException('Email is already used', HttpStatus.BAD_REQUEST);
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    await this.userService.regiter({email,name, password: hashedPassword});
    this.logger.log(`Signup new user with data ${JSON.stringify(signUpDto)}`);
    try {
      await this.mailService.sendCreateUserEmail(name, email, password);
      this.logger.log(`Send create user mail to email ${signUpDto.email}`);
    } catch (error) {
      this.logger.error('sendEmail error: ', error);
      return
    }
    return {
      status: HttpStatus.OK,
      message: 'Sign up successfully',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('change')
  async changePassword(@Body() req: ChangePasswordDto) {
    return this.authService.changePass(req.email, req.password_old, req.password_new);
  }
}