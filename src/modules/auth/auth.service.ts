import { MailService } from "@/mail/mail.service";
import { RegisterAuthDto } from "@/modules/auth/dto/register-auth.dto";
import { VerifyAccountDto } from "@/modules/auth/dto/verify-auth.dto";
import { User } from "@/modules/users/schema/user.schema";
import { UsersService } from "@/modules/users/users.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import dayjs from "dayjs";
import { Model } from "mongoose";
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  //register a user
  async register(registerDto: RegisterAuthDto) {
    const codeId = uuidv4();
  const codeExpired = dayjs().add(5, 'minutes').toDate(); // Chuyển dayjs về kiểu Date của JS
    const user = await this.usersService.createUser(registerDto, codeId, codeExpired);
    //send a welcome email to the user
    await this.mailService.sendMailVerifyAcount(user.email, user.name, codeId);
    return user;
  }

  async verifyAccount(verificationDto: VerifyAccountDto) {
    const { _id, code_id } = verificationDto;
    const user = await this.userModel.findOne({
      _id,
      code_id
    });

    if (!user) {
      throw new BadRequestException('Invalid verification code');
    }

    const isBeforeCheck = dayjs().isBefore(user.code_expired);

    if (isBeforeCheck) {
      await this.userModel.updateOne(
        { _id },
        {
          isActive: true,
        },
      );
      return { isBeforeCheck };
    } else {
      throw new BadRequestException('Invalid or expired verification code');
    }
  }
}