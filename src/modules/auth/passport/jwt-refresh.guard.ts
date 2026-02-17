import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtRefreshGuard {
  canActivate(context: any): boolean {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies['refresh_token'];
    return !!refreshToken; // Trả về true nếu có refresh token, ngược lại false
  }
}