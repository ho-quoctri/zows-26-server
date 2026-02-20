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
exports.SpacesController = void 0;
const current_user_decorator_1 = require("../../common/decorator/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/passport/jwt-auth.guard");
const add_member_dto_1 = require("./dto/add-member-dto");
const create_space_dto_1 = require("./dto/create-space.dto");
const spaces_service_1 = require("./spaces.service");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let SpacesController = class SpacesController {
    spacesService;
    constructor(spacesService) {
        this.spacesService = spacesService;
    }
    create(createSpaceDto, req) {
        const ownerId = req.user.userId;
        return this.spacesService.create(createSpaceDto, ownerId);
    }
    findAll(userId) {
        return this.spacesService.findAll(userId);
    }
    findOne(id) {
        return this.spacesService.findOne(id);
    }
    remove(id) {
        return this.spacesService.remove(+id);
    }
    async addMember(spaceId, addMemberDto) {
        return await this.spacesService.addMember(spaceId, addMemberDto.email);
    }
    async removeMember(spaceId, memberId, requesterId) {
        return await this.spacesService.removeMember(spaceId, memberId, requesterId);
    }
};
exports.SpacesController = SpacesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_space_dto_1.CreateSpaceDto, Object]),
    __metadata("design:returntype", void 0)
], SpacesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('my-spaces'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SpacesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SpacesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SpacesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/members'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_member_dto_1.AddMemberDto]),
    __metadata("design:returntype", Promise)
], SpacesController.prototype, "addMember", null);
__decorate([
    (0, common_1.Delete)(':id/members/:memberId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('memberId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], SpacesController.prototype, "removeMember", null);
exports.SpacesController = SpacesController = __decorate([
    (0, swagger_1.ApiTags)('Spaces'),
    (0, swagger_1.ApiBearerAuth)('token'),
    (0, common_1.Controller)('spaces'),
    __metadata("design:paramtypes", [spaces_service_1.SpacesService])
], SpacesController);
//# sourceMappingURL=spaces.controller.js.map