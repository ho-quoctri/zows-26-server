import { User } from '@/modules/users/schema/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type SpaceDocument = HydratedDocument<Space>;

@Schema({ _id: false }) // Không cần tạo _id riêng cho từng member trong mảng
class Member {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
  userId: string;

  @Prop({ enum: ['admin', 'member'], default: 'member' })
  role: string;
}

@Schema({ timestamps: true })
export class Space {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
  ownerId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: [SchemaFactory.createForClass(Member)] })
  members: Member[];
}

export const SpaceSchema = SchemaFactory.createForClass(Space);