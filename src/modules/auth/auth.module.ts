import { MailModule } from "@/mail/mail.module";
import { AuthController } from "@/modules/auth/auth.controller";
import { AuthService } from "@/modules/auth/auth.service";
import { JwtStrategy } from "@/modules/auth/passport/jwt.strategy";
import { LocalStrategy } from "@/modules/auth/passport/local.strategy";
import { User, UserSchema } from "@/modules/users/schema/user.schema";
import { UsersModule } from "@/modules/users/users.module";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";

const jwtFactory = {
  useFactory: async (configService: ConfigService) => ({
    global: true,
    secret: configService.get<string>('JWT_SECRET'),
    signOptions: {
      expiresIn: Number(configService.get<string>('JWT_ACCESS_TOKEN_EXPIRED')),
    },
  }),
  inject: [ConfigService],
};
@Module({
  imports: [UsersModule, MailModule, PassportModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync(jwtFactory),
  ],
  exports: [AuthService],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}