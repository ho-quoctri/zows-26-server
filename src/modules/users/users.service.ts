import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/dto/update-user.dto';
import { User } from '@/modules/users/schema/user.schema';
import { hashPasswordHelper } from '@/utils/helper';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  // CREATE (Sẽ được Auth gọi sau này)
  async createUser(createUserDto: CreateUserDto, codeId?: string, codeExpired?: Date) {
    const isExist = await this.findByEmail(createUserDto.email);
    const hashPassword = await hashPasswordHelper(createUserDto.password);

    if (isExist) {
      throw new BadRequestException('Email already exists')
    }

    if (!hashPassword) {
      throw new InternalServerErrorException('Error hashing the password');
    }
    const newUser = await this.userModel.create({
      ...createUserDto,
      password: hashPassword,
      code_id: codeId,
      code_expired: codeExpired,
    })
    return {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    };
  }

  // READ ALL
  async findAll() {
    return await this.userModel.find().select('-password'); // Ẩn password khi lấy list
  }

  // READ ONE
  async findOne(id: string) {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // read one by refresh token
  async findUserByRefreshToken(refreshToken: string, userId: string) {
    return await this.userModel.findOne({
      _id: userId,
      refresh_token: refreshToken, // Giả sử bạn lưu token vào field này
    });
  }
 // update refresh token
  async updateUserRefreshToken(_id: any, refreshToken: string) {
    return await this.userModel.updateOne(
      { _id },
      { 
        // Lưu token mới vào DB
        refreshToken: refreshToken 
      }
    );
  }

  // UPDATE
  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  // DELETE
  async remove(id: string) {
    return await this.userModel.findByIdAndDelete(id);
  }
}
