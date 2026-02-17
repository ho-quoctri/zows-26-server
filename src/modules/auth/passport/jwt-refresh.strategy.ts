import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: (req) => {
        return req?.cookies?.['refresh_token'];
      },
      ignoreExpiration: false,
      secretOrKey:String(configService.get<string>('JWT_SECRET')),
    });
  }

  validate(payload: any) {
    // Payload này là data sau khi dã giải mã token thành công
    return { userId: payload.sub, email: payload.username };
  }
  
}