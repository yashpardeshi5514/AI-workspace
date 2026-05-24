export declare class APIError extends Error {
    status: number;
    code: string;
    details?: any | undefined;
    constructor(status: number, code: string, message: string, details?: any | undefined);
}
export declare const handleAPIError: (error: any) => APIError;
export declare const getUserFriendlyError: (error: APIError) => string;
//# sourceMappingURL=apiErrors.d.ts.map