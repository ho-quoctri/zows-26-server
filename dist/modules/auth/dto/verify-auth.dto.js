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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyAccountDto = void 0;
const class_validator_1 = require("class-validator");
class VerifyAccountDto {
    _id;
    code_id;
}
exports.VerifyAccountDto = VerifyAccountDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Id is required' }),
    __metadata("design:type", String)
], VerifyAccountDto.prototype, "_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Code is required' }),
    __metadata("design:type", String)
], VerifyAccountDto.prototype, "code_id", void 0);
//# sourceMappingURL=verify-auth.dto.js.map