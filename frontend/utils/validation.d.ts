export declare const validators: {
    email: (email: string) => boolean;
    password: (password: string) => string | null;
    filename: (name: string) => string | null;
    workspaceName: (name: string) => string | null;
    chatMessage: (message: string) => string | null;
};
export interface ValidationError {
    field: string;
    message: string;
}
export declare const validateForm: (data: Record<string, any>, rules: Record<string, (value: any) => string | null>) => ValidationError[];
//# sourceMappingURL=validation.d.ts.map