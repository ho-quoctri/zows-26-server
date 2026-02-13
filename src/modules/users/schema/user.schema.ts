import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  name: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop()
  code_id: string;

  @Prop()
  code_expired: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
