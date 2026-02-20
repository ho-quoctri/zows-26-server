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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const user_schema_1 = require("./schema/user.schema");
const helper_1 = require("../../utils/helper");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let UsersService = class UsersService {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async findByEmail(email) {
        const user = await this.userModel.findOne({ email });
        return user;
    }
    async createUser(createUserDto, codeId, codeExpired) {
        const isExist = await this.findByEmail(createUserDto.email);
        const hashPassword = await (0, helper_1.hashPasswordHelper)(createUserDto.password);
        if (isExist) {
            throw new common_1.BadRequestException('Email already exists');
        }
        if (!hashPassword) {
            throw new common_1.InternalServerErrorException('Error hashing the password');
        }
        const newUser = await this.userModel.create({
            ...createUserDto,
            password: hashPassword,
            code_id: codeId,
            code_expired: codeExpired,
        });
        return {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
        };
    }
    async findAll() {
        return await this.userModel.find().select('-password');
    }
    async findOne(id) {
        const user = await this.userModel.findById(id).select('-password');
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async findUserByRefreshToken(refreshToken, userId) {
        return await this.userModel.findOne({
            _id: userId,
            refresh_token: refreshToken,
        });
    }
    async updateUserRefreshToken(_id, refreshToken) {
        return await this.userModel.updateOne({ _id }, {
            refreshToken: refreshToken
        });
    }
    async update(id, updateUserDto) {
        return await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
    }
    async remove(id) {
        return await this.userModel.findByIdAndDelete(id);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map