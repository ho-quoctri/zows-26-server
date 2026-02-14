import { AuthService } from "@/modules/auth/auth.service";
import { RegisterAuthDto } from "@/modules/auth/dto/register-auth.dto";
import { VerifyAccountDto } from "@/modules/auth/dto/verify-auth.dto";
import { Body, Controller, Post } from "@nestjs/common";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  //register a user
  @Post('register')
  register(@Body() registerDto: RegisterAuthDto) {
    return this.authService.register(registerDto);
  }

  @Post('verify-account')
  verifyAccount(@Body() verificationDto: VerifyAccountDto) {
    return this.authService.verifyAccount(verificationDto);
  }
}