export interface TokenPayload {
    userId: string;
    email: string;
}
export declare class AuthService {
    static generateToken(payload: TokenPayload): string;
    static verifyToken(token: string): TokenPayload;
    register(email: string, name: string, password: string): Promise<{
        user: import("mongoose").FlattenMaps<import("../models/User").IUser> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        token: string;
    }>;
    login(email: string, password: string): Promise<{
        user: import("mongoose").FlattenMaps<import("../models/User").IUser> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        token: string;
    }>;
    getUser(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("../models/User").IUser, {}, {}> & import("../models/User").IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
}
export declare const authService: AuthService;
//# sourceMappingURL=AuthService.d.ts.map