import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/dto/update-user.dto';
import { UsersService } from '@/modules/users/users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
        _id: import("mongoose").Types.ObjectId;
        name: string;
        email: string;
    }>;
    myProfile(req: any): Promise<any>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./schema/user.schema").User, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schema/user.schema").User, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<(import("mongoose").Document<unknown, {}, import("./schema/user.schema").User, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    remove(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schema/user.schema").User, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
