import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsMongoId({ message: '_id not right' })
  @IsNotEmpty({ message: '_id cannot be empty' })
  _id: string;

  @IsNotEmpty({ message: 'User name cannot be empty' })
  readonly name: string;
}
