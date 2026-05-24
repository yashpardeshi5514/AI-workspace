import mongoose from 'mongoose';
export declare const Message: mongoose.Model<{
    content: string;
    workspaceId: string;
    userId: string;
    role: "user" | "assistant";
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    content: string;
    workspaceId: string;
    userId: string;
    role: "user" | "assistant";
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    content: string;
    workspaceId: string;
    userId: string;
    role: "user" | "assistant";
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
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    content: string;
    workspaceId: string;
    userId: string;
    role: "user" | "assistant";
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    content: string;
    workspaceId: string;
    userId: string;
    role: "user" | "assistant";
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
//# sourceMappingURL=Message.d.ts.map