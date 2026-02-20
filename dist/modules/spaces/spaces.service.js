"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpacesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = __importStar(require("mongoose"));
const space_schema_1 = require("./schema/space.schema");
const mongoose_2 = require("@nestjs/mongoose");
const users_service_1 = require("../users/users.service");
let SpacesService = class SpacesService {
    userService;
    spaceModel;
    constructor(userService, spaceModel) {
        this.userService = userService;
        this.spaceModel = spaceModel;
    }
    async create(dto, ownerId) {
        const newSpace = new this.spaceModel({
            ...dto,
            ownerId: new mongoose_1.default.Types.ObjectId(ownerId),
            members: [{ userId: ownerId, role: 'admin' }],
        });
        return newSpace.save();
    }
    async findAll(userId) {
        if (!mongoose_1.Types.ObjectId.isValid(userId)) {
            return [];
        }
        const userObjectId = new mongoose_1.Types.ObjectId(userId);
        return this.spaceModel
            .find({
            $or: [
                { ownerId: userObjectId },
                { 'members.userId': userObjectId }
            ],
        })
            .populate('ownerId', 'name email avatar')
            .exec();
    }
    async findOne(id) {
        const space = await this.spaceModel
            .findById(id)
            .populate('ownerId', 'name email avatar')
            .populate('members.userId', 'name email avatar')
            .exec();
        if (!space)
            throw new common_1.NotFoundException('Space not found');
        return space;
    }
    remove(id) {
        return `This action removes a #${id} space`;
    }
    async addMember(spaceId, newUserEmail) {
        const space = await this.spaceModel.findOne({ _id: spaceId });
        if (!space)
            throw new common_1.NotFoundException('Space not found');
        const userToAdd = await this.userService.findByEmail(newUserEmail);
        if (!userToAdd) {
            throw new common_1.NotFoundException(`Can not found user with email ${newUserEmail}`);
        }
        const isExisted = space.members.find((m) => m.userId.toString() === userToAdd.id.toString());
        if (isExisted) {
            throw new common_1.BadRequestException('Người dùng đã có trong Space');
        }
        space.members.push({
            userId: userToAdd.id,
            role: 'member'
        });
        return space.save();
    }
    async removeMember(spaceId, memberId, requesterId) {
        const space = await this.spaceModel.findById(spaceId);
        if (!space || (space.ownerId.toString() !== requesterId && memberId !== requesterId)) {
            throw new common_1.ForbiddenException('Bạn không có quyền xóa thành viên này');
        }
        if (memberId === space.ownerId.toString()) {
            throw new common_1.BadRequestException('Không thể xóa chủ sở hữu');
        }
        space.members = space.members.filter((m) => m.userId.toString() !== memberId);
        return space.save();
    }
};
exports.SpacesService = SpacesService;
exports.SpacesService = SpacesService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_2.InjectModel)(space_schema_1.Space.name)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        mongoose_1.Model])
], SpacesService);
//# sourceMappingURL=spaces.service.js.map