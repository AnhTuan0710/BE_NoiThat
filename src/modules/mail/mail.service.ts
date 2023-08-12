import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { MailCreateUserTemplate } from './templates/create-user';
import { MailCreateOrderTemplate } from './templates/create-order';
import { CreateOrderDto } from '../../dto/order.dto';
import { Readable } from 'stream';


@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  async sendCreateUserEmail(name: string, email: string, password: string) {
    const template = MailCreateUserTemplate(name, email, password);
    await this.mailerService.sendMail(template);
  }

  async sendCreateOrderEmail(name: string, email: string, createOrderDto: CreateOrderDto) {
    const template = await MailCreateOrderTemplate(name, email, createOrderDto);
    await this.mailerService.sendMail(template);
  }
}
