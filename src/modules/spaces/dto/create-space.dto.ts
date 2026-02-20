import { IsNotEmpty, IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class MemberDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  role: 'admin' | 'member';
}

export class CreateSpaceDto {
  @IsString()
  @IsNotEmpty({ message: 'Space name cannot be empty' })
  name: string;

  @IsString()
  @IsOptional() // Sử dụng IsOptional thay vì chỉ để dấu ?
  description?: string;

  // ownerId sẽ lấy từ req.user trong Controller, không nên để ở đây

  @IsArray()
  @ValidateNested({ each: true }) // Bắt buộc phải validate từng object trong mảng
  @Type(() => MemberDto) // Cần thiết để class-validator hiểu kiểu dữ liệu của object trong mảng
  @IsOptional() 
  members?: MemberDto[];
}