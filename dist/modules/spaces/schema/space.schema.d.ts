import mongoose, { HydratedDocument } from 'mongoose';
export type SpaceDocument = HydratedDocument<Space>;
declare class Member {
    userId: string;
    role: string;
}
export declare class Space {
    name: string;
    description?: string;
    ownerId: mongoose.Schema.Types.ObjectId;
    members: Member[];
}
export declare const SpaceSchema: mongoose.Schema<Space, mongoose.Model<Space, any, any, any, (mongoose.Document<unknown, any, Space, any, mongoose.DefaultSchemaOptions> & Space & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (mongoose.Document<unknown, any, Space, any, mongoose.DefaultSchemaOptions> & Space & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}), any, Space>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Space, mongoose.Document<unknown, {}, Space, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<Space & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: mongoose.SchemaDefinitionProperty<string, Space, mongoose.Document<unknown, {}, Space, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Space & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: mongoose.SchemaDefinitionProperty<string | undefined, Space, mongoose.Document<unknown, {}, Space, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Space & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    ownerId?: mongoose.SchemaDefinitionProperty<mongoose.Schema.Types.ObjectId, Space, mongoose.Document<unknown, {}, Space, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Space & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    members?: mongoose.SchemaDefinitionProperty<Member[], Space, mongoose.Document<unknown, {}, Space, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Space & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Space>;
export {};
