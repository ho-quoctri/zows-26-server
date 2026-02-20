import { Response } from 'express';
export declare const hashPasswordHelper: (plainPassword: string) => Promise<string | null>;
export declare const comparePasswordHelper: (plainPassword: string, hashedPassword: string) => Promise<boolean>;
export declare const setRefreshTokenCookie: (res: Response, refreshToken: string) => void;
export declare const clearRefreshTokenCookie: (res: Response) => void;
