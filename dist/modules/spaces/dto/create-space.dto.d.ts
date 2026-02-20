declare class MemberDto {
    userId: string;
    role: 'admin' | 'member';
}
export declare class CreateSpaceDto {
    name: string;
    description?: string;
    members?: MemberDto[];
}
export {};
