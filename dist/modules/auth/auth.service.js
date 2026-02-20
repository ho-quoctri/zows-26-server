"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const mail_service_1 = require("../../mail/mail.service");
const user_schema_1 = require("../users/schema/user.schema");
const users_service_1 = require("../users/users.service");
const helper_1 = require("../../utils/helper");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const dayjs_1 = __importDefault(require("dayjs"));
const mongoose_2 = require("mongoose");
const uuid_1 = require("uuid");
let AuthService = class AuthService {
    usersService;
    mailService;
    configService;
    jwtService;
    userModel;
    constructor(usersService, mailService, configService, jwtService, userModel) {
        this.usersService = usersService;
        this.mailService = mailService;
        this.configService = configService;
        this.jwtService = jwtService;
        this.userModel = userModel;
    }
    async register(registerDto) {
        const codeId = (0, uuid_1.v4)();
        const codeExpired = (0, dayjs_1.default)().add(5, 'minutes').toDate();
        const user = await this.usersService.createUser(registerDto, codeId, codeExpired);
        await this.mailService.sendMailVerifyAcount(user.email, user.name, codeId);
        return user;
    }
    async verifyAccount(verificationDto) {
        const { _id, code_id } = verificationDto;
        const user = await this.userModel.findOne({
            _id,
            code_id,
        });
        if (!user) {
            throw new common_1.BadRequestException('Invalid verification code');
        }
        const isBeforeCheck = (0, dayjs_1.default)().isBefore(user.code_expired);
        if (isBeforeCheck) {
            await this.userModel.updateOne({ _id }, {
                isActive: true,
            });
            return { isBeforeCheck };
        }
        else {
            throw new common_1.BadRequestException('Invalid or expired verification code');
        }
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return null;
        }
        const isValidPassword = await (0, helper_1.comparePasswordHelper)(password, user.password);
        if (!isValidPassword) {
            return null;
        }
        return user;
    }
    async login(user) {
        const payload = { useremail: user.email, sub: user._id };
        const refreshTokenExpires = this.configService.get('JWT_REFRESH_TOKEN_EXPIRED');
        return {
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                isActive: user.isActive,
            },
            access_token: this.jwtService.sign(payload),
            refresh_token: this.jwtService.sign(payload, {
                expiresIn: refreshTokenExpires,
            }),
        };
    }
    async resendVerifyAccount(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.BadRequestException('Email not found');
        }
        if (user.isActive) {
            throw new common_1.BadRequestException('Account already verified');
        }
        if (!user) {
            throw new common_1.BadRequestException('Email not found');
        }
        const now = (0, dayjs_1.default)();
        if (user.code_expired &&
            now.isBefore((0, dayjs_1.default)(user.code_expired).subtract(4, 'minutes'))) {
            throw new common_1.BadRequestException('Please wait before requesting a new verification email. You can request a new email after 1 minute.');
        }
        const codeId = (0, uuid_1.v4)();
        const codeExpired = (0, dayjs_1.default)().add(5, 'minutes').toDate();
        await this.userModel.updateOne({ _id: user._id }, {
            code_id: codeId,
            code_expired: codeExpired,
        });
        this.mailService
            .sendMailVerifyAcount(user.email, user.name, codeId)
            .catch((err) => {
            console.error('Error', err);
        });
        return { message: 'Verification email resent' };
    }
    createRefreshToken(payload) {
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: '7d',
        });
        return refreshToken;
    }
    async refreshToken(refreshToken, response) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
            });
            const user = await this.usersService.findUserByRefreshToken(refreshToken, payload.sub);
            if (!user) {
                throw new common_1.UnauthorizedException('Refresh Token not valid or user not found');
            }
            const newPayload = { username: user.email, sub: user._id };
            const access_token = this.jwtService.sign(newPayload);
            const new_refresh_token = this.createRefreshToken({ useremail: user.email, sub: user._id });
            await this.usersService.updateUserRefreshToken(user._id, new_refresh_token);
            (0, helper_1.setRefreshTokenCookie)(response, new_refresh_token);
            return {
                access_token,
                user: {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                }
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        mail_service_1.MailService,
        config_1.ConfigService,
        jwt_1.JwtService,
        mongoose_2.Model])
], AuthService);
//# sourceMappingURL=auth.service.js.map