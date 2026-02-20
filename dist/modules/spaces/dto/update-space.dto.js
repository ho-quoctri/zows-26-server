"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSpaceDto = void 0;
const create_space_dto_1 = require("./create-space.dto");
const swagger_1 = require("@nestjs/swagger");
class UpdateSpaceDto extends (0, swagger_1.PartialType)(create_space_dto_1.CreateSpaceDto) {
}
exports.UpdateSpaceDto = UpdateSpaceDto;
//# sourceMappingURL=update-space.dto.js.map