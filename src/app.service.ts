import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Chúc Mừng Năm Mới 2026, Mong một năm mới bình an, hạnh phúc và thành công đến với tất cả mọi người!';
  }
}
