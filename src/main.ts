import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  app.setGlobalPrefix('zows/api/v1', { exclude: [''] });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,       // Tự động loại bỏ các field không được định nghĩa trong DTO
    forbidNonWhitelisted: true, // Báo lỗi nếu client gửi field lạ lên
    transform: true,       // Tự động convert kiểu dữ liệu
  }));
  await app.listen(port);
}
bootstrap();
