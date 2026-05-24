export declare class ChatService {
    createConversation(workspaceId: string, userId: string, title: string): Promise<import("mongoose").Document<unknown, {}, {
        workspaceId: string;
        userId: string;
        title: string;
        messageCount: number;
        pinned: boolean;
        summary?: string | null | undefined;
        lastMessageAt?: NativeDate | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {}, {
        timestamps: true;
    }> & {
        workspaceId: string;
        userId: string;
        title: string;
        messageCount: number;
        pinned: boolean;
        summary?: string | null | undefined;
        lastMessageAt?: NativeDate | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getConversations(workspaceId: string, limit?: number): Promise<(import("mongoose").Document<unknown, {}, {
        workspaceId: string;
        userId: string;
        title: string;
        messageCount: number;
        pinned: boolean;
        summary?: string | null | undefined;
        lastMessageAt?: NativeDate | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {}, {
        timestamps: true;
    }> & {
        workspaceId: string;
        userId: string;
        title: string;
        messageCount: number;
        pinned: boolean;
        summary?: string | null | undefined;
        lastMessageAt?: NativeDate | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getConversation(conversationId: string): Promise<(import("mongoose").Document<unknown, {}, {
        workspaceId: string;
        userId: string;
        title: string;
        messageCount: number;
        pinned: boolean;
        summary?: string | null | undefined;
        lastMessageAt?: NativeDate | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {}, {
        timestamps: true;
    }> & {
        workspaceId: string;
        userId: string;
        title: string;
        messageCount: number;
        pinned: boolean;
        summary?: string | null | undefined;
        lastMessageAt?: NativeDate | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    saveMessage(conversationId: string, workspaceId: string, userId: string, role: 'user' | 'assistant', content: string, metadata?: any): Promise<import("mongoose").Document<unknown, {}, {
        content: string;
        workspaceId: string;
        userId: string;
        role: "user" | "assistant";
        conversationId: string;
        metadata?: {
            sourceFiles: string[];
            agentsUsed: string[];
            tokensUsed?: number | null | undefined;
        } | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {}, {
        timestamps: true;
    }> & {
        content: string;
        workspaceId: string;
        userId: string;
        role: "user" | "assistant";
        conversationId: string;
        metadata?: {
            sourceFiles: string[];
            agentsUsed: string[];
            tokensUsed?: number | null | undefined;
        } | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getMessages(conversationId: string, limit?: number, skip?: number): Promise<(import("mongoose").Document<unknown, {}, {
        content: string;
        workspaceId: string;
        userId: string;
        role: "user" | "assistant";
        conversationId: string;
        metadata?: {
            sourceFiles: string[];
            agentsUsed: string[];
            tokensUsed?: number | null | undefined;
        } | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {}, {
        timestamps: true;
    }> & {
        content: string;
        workspaceId: string;
        userId: string;
        role: "user" | "assistant";
        conversationId: string;
        metadata?: {
            sourceFiles: string[];
            agentsUsed: string[];
            tokensUsed?: number | null | undefined;
        } | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    searchConversations(workspaceId: string, query: string): Promise<(import("mongoose").Document<unknown, {}, {
        workspaceId: string;
        userId: string;
        title: string;
        messageCount: number;
        pinned: boolean;
        summary?: string | null | undefined;
        lastMessageAt?: NativeDate | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {}, {
        timestamps: true;
    }> & {
        workspaceId: string;
        userId: string;
        title: string;
        messageCount: number;
        pinned: boolean;
        summary?: string | null | undefined;
        lastMessageAt?: NativeDate | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    searchMessages(workspaceId: string, query: string, limit?: number): Promise<(import("mongoose").Document<unknown, {}, {
        content: string;
        workspaceId: string;
        userId: string;
        role: "user" | "assistant";
        conversationId: string;
        metadata?: {
            sourceFiles: string[];
            agentsUsed: string[];
            tokensUsed?: number | null | undefined;
        } | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {}, {
        timestamps: true;
    }> & {
        content: string;
        workspaceId: string;
        userId: string;
        role: "user" | "assistant";
        conversationId: string;
        metadata?: {
            sourceFiles: string[];
            agentsUsed: string[];
            tokensUsed?: number | null | undefined;
        } | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    pinConversation(conversationId: string, pinned: boolean): Promise<(import("mongoose").Document<unknown, {}, {
        workspaceId: string;
        userId: string;
        title: string;
        messageCount: number;
        pinned: boolean;
        summary?: string | null | undefined;
        lastMessageAt?: NativeDate | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {}, {
        timestamps: true;
    }> & {
        workspaceId: string;
        userId: string;
        title: string;
        messageCount: number;
        pinned: boolean;
        summary?: string | null | undefined;
        lastMessageAt?: NativeDate | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    updateConversationTitle(conversationId: string, title: string): Promise<(import("mongoose").Document<unknown, {}, {
        workspaceId: string;
        userId: string;
        title: string;
        messageCount: number;
        pinned: boolean;
        summary?: string | null | undefined;
        lastMessageAt?: NativeDate | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {}, {
        timestamps: true;
    }> & {
        workspaceId: string;
        userId: string;
        title: string;
        messageCount: number;
        pinned: boolean;
        summary?: string | null | undefined;
        lastMessageAt?: NativeDate | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    deleteConversation(conversationId: string): Promise<(import("mongoose").Document<unknown, {}, {
        workspaceId: string;
        userId: string;
        title: string;
        messageCount: number;
        pinned: boolean;
        summary?: string | null | undefined;
        lastMessageAt?: NativeDate | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {}, {
        timestamps: true;
    }> & {
        workspaceId: string;
        userId: string;
        title: string;
        messageCount: number;
        pinned: boolean;
        summary?: string | null | undefined;
        lastMessageAt?: NativeDate | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    getConversationSummary(conversationId: string): Promise<string>;
}
export declare const chatService: ChatService;
//# sourceMappingURL=ChatService.d.ts.map