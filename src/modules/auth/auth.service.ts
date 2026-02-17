import { MailService } from '@/mail/mail.service';
import { RegisterAuthDto } from '@/modules/auth/dto/register-auth.dto';
import { VerifyAccountDto } from '@/modules/auth/dto/verify-auth.dto';
import { User } from '@/modules/users/schema/user.schema';
import { UsersService } from '@/modules/users/users.service';
import { comparePasswordHelper, setRefreshTokenCookie } from '@/utils/helper';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private configService: ConfigService,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  //register a user
  async register(registerDto: RegisterAuthDto) {
    const codeId = uuidv4();
    const codeExpired = dayjs().add(5, 'minutes').toDate(); // Chuyển dayjs về kiểu Date của JS
    const user = await this.usersService.createUser(
      registerDto,
      codeId,
      codeExpired,
    );
    //send a welcome email to the user
    await this.mailService.sendMailVerifyAcount(user.email, user.name, codeId);
    return user;
  }
  // verify account
  async verifyAccount(verificationDto: VerifyAccountDto) {
    const { _id, code_id } = verificationDto;
    const user = await this.userModel.findOne({
      _id,
      code_id,
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
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }
    const isValidPassword = await comparePasswordHelper(
      password,
      user.password,
    );

    if (!isValidPassword) {
      return null;
    }

    return user;
  }
  // login a user
  async login(user: any) {
    const payload = { useremail: user.email, sub: user._id };
    const refreshTokenExpires = this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRED',
    );
    return {
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        isActive: user.isActive,
      },
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: refreshTokenExpires,
      }),
    };
  }

  // resend verify account
  async resendVerifyAccount(email: string) {
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      throw new BadRequestException('Email not found');
    }
    
    if (user.isActive) {
      throw new BadRequestException('Account already verified');
    }
    
    if (!user) {
      throw new BadRequestException('Email not found');
    }

    const now = dayjs();
    if (
      user.code_expired &&
      now.isBefore(dayjs(user.code_expired).subtract(4, 'minutes'))
    ) {
      throw new BadRequestException(
        'Please wait before requesting a new verification email. You can request a new email after 1 minute.',
      );
    }

    const codeId = uuidv4();
    const codeExpired = dayjs().add(5, 'minutes').toDate();
    await this.userModel.updateOne(
      { _id: user._id },
      {
        code_id: codeId,
        code_expired: codeExpired,
      },
    );
    this.mailService
      .sendMailVerifyAcount(user.email, user.name, codeId)
      .catch((err) => {
        console.error('Error', err);
      });
    return { message: 'Verification email resent' };
  }

  createRefreshToken(payload: { useremail: string; sub: any }) {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: '7d', // Thường để 7 ngày hoặc 30 ngày
    });
    return refreshToken;
  }

  async refreshToken(refreshToken: string, response: any) {
    try {
      // 1. Verify token xem có đúng chữ ký và còn hạn không
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });
  
      // 2. Tìm user trong DB để check xem Refresh Token có khớp không 
      // (Tránh trường hợp token đã bị thu hồi/đăng xuất)
      const user = await this.usersService.findUserByRefreshToken(refreshToken, payload.sub);
      
      if (!user) {
        throw new UnauthorizedException('Refresh Token not valid or user not found');
      }
  
      // 3. Tạo bộ Token mới (Access & Refresh)
      const newPayload = { username: user.email, sub: user._id };
      const access_token = this.jwtService.sign(newPayload);
      const new_refresh_token = this.createRefreshToken({ useremail: user.email, sub: user._id });
  
      // 4. Update Refresh Token mới vào DB (Token Rotation - Bảo mật cao)
      await this.usersService.updateUserRefreshToken(user._id, new_refresh_token);
  
      // 5. Set lại Cookie mới
      setRefreshTokenCookie(response, new_refresh_token);
  
      return {
        access_token,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
        }
      };
    } catch (error) {
      throw new UnauthorizedException('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
    }
  }
}
