import mongoose from 'mongoose';
export declare const ChatHistory: mongoose.Model<{
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
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
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
} & mongoose.DefaultTimestampProps, {}, {
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
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
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
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
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
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
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
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export declare const Conversation: mongoose.Model<{
    workspaceId: string;
    userId: string;
    title: string;
    messageCount: number;
    pinned: boolean;
    summary?: string | null | undefined;
    lastMessageAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    workspaceId: string;
    userId: string;
    title: string;
    messageCount: number;
    pinned: boolean;
    summary?: string | null | undefined;
    lastMessageAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    workspaceId: string;
    userId: string;
    title: string;
    messageCount: number;
    pinned: boolean;
    summary?: string | null | undefined;
    lastMessageAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    workspaceId: string;
    userId: string;
    title: string;
    messageCount: number;
    pinned: boolean;
    summary?: string | null | undefined;
    lastMessageAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    workspaceId: string;
    userId: string;
    title: string;
    messageCount: number;
    pinned: boolean;
    summary?: string | null | undefined;
    lastMessageAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    workspaceId: string;
    userId: string;
    title: string;
    messageCount: number;
    pinned: boolean;
    summary?: string | null | undefined;
    lastMessageAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
//# sourceMappingURL=ChatHistory.d.ts.map