import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AddMemberDto {
  @ApiProperty({ 
    example: 'user@example.com', 
    description: 'Email của thành viên muốn thêm' 
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}