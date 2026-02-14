import { IsNotEmpty } from "class-validator";

export class VerifyAccountDto {

  @IsNotEmpty({ message: 'Id is required' })
  _id: string;

  @IsNotEmpty({ message: 'Code is required' })
  code_id: string;

}
