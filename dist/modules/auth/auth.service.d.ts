import { MailService } from '@/mail/mail.service';
import { RegisterAuthDto } from '@/modules/auth/dto/register-auth.dto';
import { VerifyAccountDto } from '@/modules/auth/dto/verify-auth.dto';
import { User } from '@/modules/users/schema/user.schema';
import { UsersService } from '@/modules/users/users.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
export declare class AuthService {
    private readonly usersService;
    private readonly mailService;
    private configService;
    private jwtService;
    private userModel;
    constructor(usersService: UsersService, mailService: MailService, configService: ConfigService, jwtService: JwtService, userModel: Model<User>);
    register(registerDto: RegisterAuthDto): Promise<{
        _id: import("mongoose").Types.ObjectId;
        name: string;
        email: string;
    }>;
    verifyAccount(verificationDto: VerifyAccountDto): Promise<{
        isBeforeCheck: true;
    }>;
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
        user: {
            _id: any;
            email: any;
            name: any;
            isActive: any;
        };
        access_token: string;
        refresh_token: string;
    }>;
    resendVerifyAccount(email: string): Promise<{
        message: string;
    }>;
    createRefreshToken(payload: {
        useremail: string;
        sub: any;
    }): string;
    refreshToken(refreshToken: string, response: any): Promise<{
        access_token: string;
        user: {
            _id: import("mongoose").Types.ObjectId;
            email: string;
            name: string;
        };
    }>;
}
