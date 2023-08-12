import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { MailService } from './mail.service';
import { MAIL_CONFIG } from '../../config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => {
        return {
          transport: {
            host: MAIL_CONFIG?.HOST,
            port: MAIL_CONFIG?.PORT,
            secure: MAIL_CONFIG?.SECURE,
            auth: {
              user: MAIL_CONFIG?.USER,
              pass: MAIL_CONFIG?.PASS,
            },
          },
          defaults: {
            from: MAIL_CONFIG?.FROM,
          },
          template: {
            dir: __dirname + '/templates',
            adapter: new PugAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}