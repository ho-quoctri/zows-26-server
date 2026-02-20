import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSpaceDto } from '@/modules/spaces/dto/create-space.dto';
import { UpdateSpaceDto } from '@/modules/spaces/dto/update-space.dto';
import mongoose, { Model, Types } from 'mongoose';
import { Space } from '@/modules/spaces/schema/space.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from '@/modules/users/users.service';

@Injectable()
export class SpacesService {
  constructor(
    private readonly userService: UsersService,
    @InjectModel(Space.name) private spaceModel: Model<Space>,
  ) {}

  async create(dto: CreateSpaceDto, ownerId: string) {
    const newSpace = new this.spaceModel({
      ...dto,
      ownerId: new mongoose.Types.ObjectId(ownerId), // Ép kiểu tại đây
      members: [{ userId: ownerId, role: 'admin' }], // Tự động cho chủ sở hữu vào làm admin
    });
    return newSpace.save();
  }

  async findAll(userId: string) {
    // Kiểm tra nếu userId không hợp lệ thì trả về mảng rỗng luôn
    if (!Types.ObjectId.isValid(userId)) {
      return [];
    }
  
    const userObjectId = new Types.ObjectId(userId);
  
    return this.spaceModel
      .find({
        $or: [
          { ownerId: userObjectId },
          { 'members.userId': userObjectId }
        ],
      } as any)
      .populate('ownerId', 'name email avatar')
      .exec();
  }

  // 2. Chi tiết Space (kèm danh sách member đầy đủ tên tuổi)
  async findOne(id: string) {
    const space = await this.spaceModel
      .findById(id)
      .populate('ownerId', 'name email avatar')
      .populate('members.userId', 'name email avatar')
      .exec();

    if (!space) throw new NotFoundException('Space not found');
    return space;
  }

  // 3. Cập nhật Space
  // async update(id: string, updateSpaceDto: UpdateSpaceDto, userId: string) {
  //   // Chỉ chủ sở hữu mới được đổi tên/mô tả Space
  //   const space = await this.spaceModel.findOneAndUpdate(
  //     { _id: id, ownerId: userId },
  //     { $set: updateSpaceDto },
  //     { new: true }
  //   );
  //   if (!space) throw new ForbiddenException('Bạn không có quyền sửa Space này');
  //   return space;
  // }

  remove(id: number) {
    return `This action removes a #${id} space`;
  }

  // // 4. Thêm thành viên mới
  async addMember(spaceId: string, newUserEmail: string) {
    const space = await this.spaceModel.findOne({ _id: spaceId });
    if (!space) throw new NotFoundException('Space not found');
  
    // 1. Tìm user theo email
    const userToAdd = await this.userService.findByEmail(newUserEmail);
    
    // 2. PHẢI CHECK: Nếu không tìm thấy User thì báo lỗi luôn, không đi tiếp
    if (!userToAdd) {
      throw new NotFoundException(`Can not found user with email ${newUserEmail}`);
    }
  
    // 3. Kiểm tra xem user đã là member chưa (Sử dụng id đã chắc chắn tồn tại)
    const isExisted = space.members.find(
      (m) => m.userId.toString() === userToAdd.id.toString(),
    );
    if (isExisted) {
      throw new BadRequestException('Người dùng đã có trong Space');
    }
  
    // 4. Push ID xịn vào, không dùng || '' nữa
    space.members.push({ 
      userId: userToAdd.id, 
      role: 'member' 
    });
  
    return space.save();
  }

  // // 5. Xóa thành viên
  async removeMember(spaceId: string, memberId: string, requesterId: string) {
    const space = await this.spaceModel.findById(spaceId);

    // Bảo mật: Chỉ owner mới được xóa người khác, hoặc member tự rời khỏi
    if (!space || (space.ownerId.toString() !== requesterId && memberId !== requesterId)) {
      throw new ForbiddenException('Bạn không có quyền xóa thành viên này');
    }

    // Không cho phép xóa chính chủ sở hữu khỏi danh sách member
    if (memberId === space.ownerId.toString()) {
      throw new BadRequestException('Không thể xóa chủ sở hữu');
    }

    space.members = space.members.filter(
      (m) => m.userId.toString() !== memberId,
    );
    return space.save();
  }
}
