import { User } from '@/modules/users/schema/user.schema';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMailVerifyAcount(email: string, name: string, code: string){
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Verify your account from ZOWS-26',
        template: './verify-email', // Tên file .ejs
        context: { // Dữ liệu truyền vào template
          name,
          code,
        },
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Email error: ', error);
    }
  }
}
