import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from '../../constants/auth';
import { LoginDto } from '../../dto/user.dto';
const jwt = require('jsonwebtoken');

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: LoginDto) {
    const dbUser = await this.usersService.findOne(user.email);
    if (user.role) {
      if (dbUser && dbUser.active_flg !== 0 && await bcrypt.compare(user.password, dbUser.password) && dbUser.role === 'admin') {
        const payload = { email: dbUser.email, sub: dbUser.id };
        return {
          access_token: this.jwtService.sign(payload),
          user: dbUser
        };
      }
      throw new UnauthorizedException('Invalid credentials');
    } else {
      if (dbUser && dbUser.active_flg !== 0 && await bcrypt.compare(user.password, dbUser.password)) {
        const payload = { email: dbUser.email, sub: dbUser.id };
        return {
          access_token: this.jwtService.sign(payload),
          user: dbUser
        };
      }
      throw new UnauthorizedException('Invalid credentials');
    }

  }

  async getUserFromToken(token) {
    try {
      const decodedToken = jwt.verify(token, jwtConstants.secret);
      const user = decodedToken.user;
      return user;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async changePass(email: string, pwold: string, pwnew: string) {
    const dbUser = await this.usersService.findOne(email);
    if (dbUser && await bcrypt.compare(pwold, dbUser.password)) {
      return this.usersService.updateInfoUser(dbUser.id, { password: pwnew })
    }
    throw new UnauthorizedException('Mật khẩu cũ không chính xác');
  }
}