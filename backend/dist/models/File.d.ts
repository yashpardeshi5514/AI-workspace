import mongoose from 'mongoose';
export declare const File: mongoose.Model<{
    path: string;
    workspaceId: string;
    userId: string;
    filename: string;
    isDirectory: boolean;
    indexed: boolean;
    size?: number | null | undefined;
    content?: string | null | undefined;
    mimeType?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    path: string;
    workspaceId: string;
    userId: string;
    filename: string;
    isDirectory: boolean;
    indexed: boolean;
    size?: number | null | undefined;
    content?: string | null | undefined;
    mimeType?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    path: string;
    workspaceId: string;
    userId: string;
    filename: string;
    isDirectory: boolean;
    indexed: boolean;
    size?: number | null | undefined;
    content?: string | null | undefined;
    mimeType?: string | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    path: string;
    workspaceId: string;
    userId: string;
    filename: string;
    isDirectory: boolean;
    indexed: boolean;
    size?: number | null | undefined;
    content?: string | null | undefined;
    mimeType?: string | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    path: string;
    workspaceId: string;
    userId: string;
    filename: string;
    isDirectory: boolean;
    indexed: boolean;
    size?: number | null | undefined;
    content?: string | null | undefined;
    mimeType?: string | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    path: string;
    workspaceId: string;
    userId: string;
    filename: string;
    isDirectory: boolean;
    indexed: boolean;
    size?: number | null | undefined;
    content?: string | null | undefined;
    mimeType?: string | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
//# sourceMappingURL=File.d.ts.map