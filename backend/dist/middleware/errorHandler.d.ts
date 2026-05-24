import { Request, Response, NextFunction } from 'express';
export declare class AppError extends Error {
    statusCode: number;
    code: string;
    constructor(statusCode: number, code: string, message: string);
}
export declare const errorHandler: (err: any, _req: Request, res: Response, _next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const asyncHandler: (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map