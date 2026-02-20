import { AddMemberDto } from '@/modules/spaces/dto/add-member-dto';
import { CreateSpaceDto } from '@/modules/spaces/dto/create-space.dto';
import { SpacesService } from '@/modules/spaces/spaces.service';
export declare class SpacesController {
    private readonly spacesService;
    constructor(spacesService: SpacesService);
    create(createSpaceDto: CreateSpaceDto, req: any): Promise<import("mongoose").Document<unknown, {}, import("./schema/space.schema").Space, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/space.schema").Space & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schema/space.schema").Space, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/space.schema").Space & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schema/space.schema").Space, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/space.schema").Space & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(id: string): string;
    addMember(spaceId: string, addMemberDto: AddMemberDto): Promise<import("mongoose").Document<unknown, {}, import("./schema/space.schema").Space, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/space.schema").Space & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    removeMember(spaceId: string, memberId: string, requesterId: string): Promise<import("mongoose").Document<unknown, {}, import("./schema/space.schema").Space, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/space.schema").Space & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
}
