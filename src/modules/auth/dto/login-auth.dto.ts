import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class LoginAuthDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  readonly email: string;
  
  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*])/, {
    message:
      'Password must contain at least one letter, one number, and one special character',
  })
  readonly password: string;
}