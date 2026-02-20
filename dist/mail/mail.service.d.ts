import { MailerService } from '@nestjs-modules/mailer';
export declare class MailService {
    private mailerService;
    constructor(mailerService: MailerService);
    sendMailVerifyAcount(email: string, name: string, code: string): Promise<void>;
}
