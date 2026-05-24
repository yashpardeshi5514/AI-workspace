export declare class MessageService {
    saveMessage(workspaceId: string, userId: string, content: string, role: 'user' | 'assistant'): Promise<import("mongoose").Document<unknown, {}, {
        content: string;
        workspaceId: string;
        userId: string;
        role: "user" | "assistant";
    } & import("mongoose").DefaultTimestampProps, {}, {
        timestamps: true;
    }> & {
        content: string;
        workspaceId: string;
        userId: string;
        role: "user" | "assistant";
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getMessages(workspaceId: string, limit?: number): Promise<(import("mongoose").Document<unknown, {}, {
        content: string;
        workspaceId: string;
        userId: string;
        role: "user" | "assistant";
    } & import("mongoose").DefaultTimestampProps, {}, {
        timestamps: true;
    }> & {
        content: string;
        workspaceId: string;
        userId: string;
        role: "user" | "assistant";
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    clearMessages(workspaceId: string): Promise<import("mongodb").DeleteResult>;
}
export declare const messageService: MessageService;
//# sourceMappingURL=MessageService.d.ts.map