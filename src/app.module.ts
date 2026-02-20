import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '@/modules/users/users.module';
import { MailModule } from '@/mail/mail.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { SpacesModule } from '@/modules/spaces/spaces.module';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '@/modules/auth/passport/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),
    AuthModule,
    UsersModule,
    MailModule,
    SpacesModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Đặt Jw/tAuthGuard làm guard mặc định
    },
    Reflector
  ],
})
export class AppModule {}
