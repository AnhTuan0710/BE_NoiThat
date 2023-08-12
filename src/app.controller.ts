import { Public } from './constants/auth';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }
  
  @Public()
  @Get()
  findAll() {
    return [];
  }
}
