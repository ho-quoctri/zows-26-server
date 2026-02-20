import { AuthService } from '@/modules/auth/auth.service';
import { LoginAuthDto } from '@/modules/auth/dto/login-auth.dto';
import { RegisterAuthDto } from '@/modules/auth/dto/register-auth.dto';
import { VerifyAccountDto } from '@/modules/auth/dto/verify-auth.dto';
import type { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterAuthDto): Promise<{
        _id: import("mongoose").Types.ObjectId;
        name: string;
        email: string;
    }>;
    verifyAccount(verificationDto: VerifyAccountDto): Promise<{
        isBeforeCheck: true;
    }>;
    resendVerifyAccount(email: string): Promise<{
        message: string;
    }>;
    handleRefreshToken(req: any, res: Response): Promise<{
        access_token: string;
        user: {
            _id: import("mongoose").Types.ObjectId;
            email: string;
            name: string;
        };
    }>;
    login(loginDto: LoginAuthDto, req: any, res: Response): Promise<{
        access_token: string;
        user: {
            _id: any;
            email: any;
            name: any;
            isActive: any;
        };
    }>;
    logout(res: Response): Promise<{
        message: string;
    }>;
}
