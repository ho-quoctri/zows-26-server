import { CurrentUser } from '@/common/decorator/current-user.decorator';
import { JwtAuthGuard } from '@/modules/auth/passport/jwt-auth.guard';
import { AddMemberDto } from '@/modules/spaces/dto/add-member-dto';
import { CreateSpaceDto } from '@/modules/spaces/dto/create-space.dto';
import { UpdateSpaceDto } from '@/modules/spaces/dto/update-space.dto';
import { SpacesService } from '@/modules/spaces/spaces.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiTags('Spaces')
@ApiBearerAuth('token') 
@Controller('spaces')
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createSpaceDto: CreateSpaceDto, @Request() req) {
    // Lấy userId từ token đã được JwtStrategy giải mã vào req.user
    const ownerId = req.user.userId;
    return this.spacesService.create(createSpaceDto, ownerId);
  }

  @Get('my-spaces')
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser('userId') userId: string) {
  return this.spacesService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.spacesService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSpaceDto: UpdateSpaceDto) {
  //   return this.spacesService.update(+id, updateSpaceDto);
  // }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.spacesService.remove(+id);
  }

  @Post(':id/members')
  @UseGuards(JwtAuthGuard)
  async addMember(
    @Param('id') spaceId: string,
    @Body() addMemberDto: AddMemberDto,
) {
  return await this.spacesService.addMember(spaceId, addMemberDto.email);
}

  /**
   * 5. Xóa thành viên hoặc tự rời khỏi Space
   * DELETE /spaces/:id/members/:memberId
   */
  @Delete(':id/members/:memberId')
  async removeMember(
    @Param('id') spaceId: string,
    @Param('memberId') memberId: string,
    @CurrentUser('userId') requesterId: string, // Rất tiện lợi!
  ) {
    return await this.spacesService.removeMember(
      spaceId, 
      memberId, 
      requesterId
    );
  }
}
