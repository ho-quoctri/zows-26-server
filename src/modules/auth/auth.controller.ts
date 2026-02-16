import { Public } from "@/common/decorator/public.decorator";
import { AuthService } from "@/modules/auth/auth.service";
import { RegisterAuthDto } from "@/modules/auth/dto/register-auth.dto";
import { VerifyAccountDto } from "@/modules/auth/dto/verify-auth.dto";
import { JwtAuthGuard } from "@/modules/auth/passport/jwt-auth.guard";
import { LocalAuthGuard } from "@/modules/auth/passport/local-auth.guard";
import { clearRefreshTokenCookie, setRefreshTokenCookie } from "@/utils/helper";
import { Body, Controller, Get, Post, Request, Res, UseGuards } from "@nestjs/common";
import type { Response } from "express";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  //register a user
  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterAuthDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('verify-account')
  verifyAccount(@Body() verificationDto: VerifyAccountDto) {
    return this.authService.verifyAccount(verificationDto);
  }

  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const { access_token, refresh_token, user } = await this.authService.login(req.user);
    setRefreshTokenCookie(res, refresh_token); 
    return { access_token, user }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    clearRefreshTokenCookie(res)
    return { message: 'Logout successful' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async myProfile(@Request() req) {
    return req.user;
  }

}