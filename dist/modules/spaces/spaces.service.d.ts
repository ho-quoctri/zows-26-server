import { CreateSpaceDto } from '@/modules/spaces/dto/create-space.dto';
import mongoose, { Model, Types } from 'mongoose';
import { Space } from '@/modules/spaces/schema/space.schema';
import { UsersService } from '@/modules/users/users.service';
export declare class SpacesService {
    private readonly userService;
    private spaceModel;
    constructor(userService: UsersService, spaceModel: Model<Space>);
    create(dto: CreateSpaceDto, ownerId: string): Promise<mongoose.Document<unknown, {}, Space, {}, mongoose.DefaultSchemaOptions> & Space & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(userId: string): Promise<(mongoose.Document<unknown, {}, Space, {}, mongoose.DefaultSchemaOptions> & Space & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(id: string): Promise<mongoose.Document<unknown, {}, Space, {}, mongoose.DefaultSchemaOptions> & Space & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(id: number): string;
    addMember(spaceId: string, newUserEmail: string): Promise<mongoose.Document<unknown, {}, Space, {}, mongoose.DefaultSchemaOptions> & Space & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    removeMember(spaceId: string, memberId: string, requesterId: string): Promise<mongoose.Document<unknown, {}, Space, {}, mongoose.DefaultSchemaOptions> & Space & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
}
