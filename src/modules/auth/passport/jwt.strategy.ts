// jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Lấy token từ header "Authorization: Bearer ..."
      ignoreExpiration: false,
      secretOrKey: String(configService.get<string>('JWT_SECRET')),
    });
  }

  async validate(payload: any) {
    // Trả về thông tin user vào trong request.user
    return { userId: payload.sub, email: payload.email };
  }
}