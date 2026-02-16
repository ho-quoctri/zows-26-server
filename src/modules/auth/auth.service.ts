import { MailService } from "@/mail/mail.service";
import { LoginAuthDto } from "@/modules/auth/dto/login-auth.dto";
import { RegisterAuthDto } from "@/modules/auth/dto/register-auth.dto";
import { VerifyAccountDto } from "@/modules/auth/dto/verify-auth.dto";
import { User } from "@/modules/users/schema/user.schema";
import { UsersService } from "@/modules/users/users.service";
import { comparePasswordHelper } from "@/utils/helper";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import dayjs from "dayjs";
import { Model } from "mongoose";
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
    private configService: ConfigService

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
  // verify account
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

  // validate user for local strategy
  async validateUser(email: string, password: string): Promise<any> {

    const user = await this.usersService.findByEmail(email)

    if (!user) {
      return null
    }
    const isValidPassword = await comparePasswordHelper(password, user.password)

    if (!isValidPassword) {
      return null
    }

    return user
  }

  // login a user
  async login(user: any) {
    const payload = { useremail: user.email, sub: user._id };
    const refreshTokenExpires = this.configService.get('JWT_REFRESH_TOKEN_EXPIRED');
      return {
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          isActive: user.isActive
        },
        access_token: this.jwtService.sign(payload),
        refresh_token: this.jwtService.sign(payload, { expiresIn: refreshTokenExpires }),
      }
  }
}