import mongoose from 'mongoose';
export declare const Analytics: mongoose.Model<{
    workspaceId: string;
    userId: string;
    event: "chat_message" | "file_upload" | "file_delete" | "code_execute" | "search_query" | "login" | "logout" | "workspace_create" | "user_invite";
    data?: any;
    metadata?: {
        ip?: string | null | undefined;
        userAgent?: string | null | undefined;
        duration?: number | null | undefined;
    } | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    workspaceId: string;
    userId: string;
    event: "chat_message" | "file_upload" | "file_delete" | "code_execute" | "search_query" | "login" | "logout" | "workspace_create" | "user_invite";
    data?: any;
    metadata?: {
        ip?: string | null | undefined;
        userAgent?: string | null | undefined;
        duration?: number | null | undefined;
    } | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    workspaceId: string;
    userId: string;
    event: "chat_message" | "file_upload" | "file_delete" | "code_execute" | "search_query" | "login" | "logout" | "workspace_create" | "user_invite";
    data?: any;
    metadata?: {
        ip?: string | null | undefined;
        userAgent?: string | null | undefined;
        duration?: number | null | undefined;
    } | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    workspaceId: string;
    userId: string;
    event: "chat_message" | "file_upload" | "file_delete" | "code_execute" | "search_query" | "login" | "logout" | "workspace_create" | "user_invite";
    data?: any;
    metadata?: {
        ip?: string | null | undefined;
        userAgent?: string | null | undefined;
        duration?: number | null | undefined;
    } | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    workspaceId: string;
    userId: string;
    event: "chat_message" | "file_upload" | "file_delete" | "code_execute" | "search_query" | "login" | "logout" | "workspace_create" | "user_invite";
    data?: any;
    metadata?: {
        ip?: string | null | undefined;
        userAgent?: string | null | undefined;
        duration?: number | null | undefined;
    } | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    workspaceId: string;
    userId: string;
    event: "chat_message" | "file_upload" | "file_delete" | "code_execute" | "search_query" | "login" | "logout" | "workspace_create" | "user_invite";
    data?: any;
    metadata?: {
        ip?: string | null | undefined;
        userAgent?: string | null | undefined;
        duration?: number | null | undefined;
    } | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export declare const TeamMember: mongoose.Model<{
    email: string;
    workspaceId: string;
    userId: string;
    role: "owner" | "admin" | "member" | "viewer";
    status: "active" | "invited" | "disabled";
    invitedAt?: NativeDate | null | undefined;
    joinedAt?: NativeDate | null | undefined;
    permissions?: {
        canEdit?: boolean | null | undefined;
        canDelete?: boolean | null | undefined;
        canInvite?: boolean | null | undefined;
        canManageTeam?: boolean | null | undefined;
    } | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    email: string;
    workspaceId: string;
    userId: string;
    role: "owner" | "admin" | "member" | "viewer";
    status: "active" | "invited" | "disabled";
    invitedAt?: NativeDate | null | undefined;
    joinedAt?: NativeDate | null | undefined;
    permissions?: {
        canEdit?: boolean | null | undefined;
        canDelete?: boolean | null | undefined;
        canInvite?: boolean | null | undefined;
        canManageTeam?: boolean | null | undefined;
    } | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    email: string;
    workspaceId: string;
    userId: string;
    role: "owner" | "admin" | "member" | "viewer";
    status: "active" | "invited" | "disabled";
    invitedAt?: NativeDate | null | undefined;
    joinedAt?: NativeDate | null | undefined;
    permissions?: {
        canEdit?: boolean | null | undefined;
        canDelete?: boolean | null | undefined;
        canInvite?: boolean | null | undefined;
        canManageTeam?: boolean | null | undefined;
    } | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    email: string;
    workspaceId: string;
    userId: string;
    role: "owner" | "admin" | "member" | "viewer";
    status: "active" | "invited" | "disabled";
    invitedAt?: NativeDate | null | undefined;
    joinedAt?: NativeDate | null | undefined;
    permissions?: {
        canEdit?: boolean | null | undefined;
        canDelete?: boolean | null | undefined;
        canInvite?: boolean | null | undefined;
        canManageTeam?: boolean | null | undefined;
    } | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    email: string;
    workspaceId: string;
    userId: string;
    role: "owner" | "admin" | "member" | "viewer";
    status: "active" | "invited" | "disabled";
    invitedAt?: NativeDate | null | undefined;
    joinedAt?: NativeDate | null | undefined;
    permissions?: {
        canEdit?: boolean | null | undefined;
        canDelete?: boolean | null | undefined;
        canInvite?: boolean | null | undefined;
        canManageTeam?: boolean | null | undefined;
    } | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    email: string;
    workspaceId: string;
    userId: string;
    role: "owner" | "admin" | "member" | "viewer";
    status: "active" | "invited" | "disabled";
    invitedAt?: NativeDate | null | undefined;
    joinedAt?: NativeDate | null | undefined;
    permissions?: {
        canEdit?: boolean | null | undefined;
        canDelete?: boolean | null | undefined;
        canInvite?: boolean | null | undefined;
        canManageTeam?: boolean | null | undefined;
    } | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export declare const Integration: mongoose.Model<{
    type: "slack" | "discord" | "webhook" | "api_key";
    workspaceId: string;
    enabled: boolean;
    usageCount: number;
    name?: string | null | undefined;
    config?: any;
    apiKey?: string | null | undefined;
    lastUsed?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    type: "slack" | "discord" | "webhook" | "api_key";
    workspaceId: string;
    enabled: boolean;
    usageCount: number;
    name?: string | null | undefined;
    config?: any;
    apiKey?: string | null | undefined;
    lastUsed?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    type: "slack" | "discord" | "webhook" | "api_key";
    workspaceId: string;
    enabled: boolean;
    usageCount: number;
    name?: string | null | undefined;
    config?: any;
    apiKey?: string | null | undefined;
    lastUsed?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    type: "slack" | "discord" | "webhook" | "api_key";
    workspaceId: string;
    enabled: boolean;
    usageCount: number;
    name?: string | null | undefined;
    config?: any;
    apiKey?: string | null | undefined;
    lastUsed?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    type: "slack" | "discord" | "webhook" | "api_key";
    workspaceId: string;
    enabled: boolean;
    usageCount: number;
    name?: string | null | undefined;
    config?: any;
    apiKey?: string | null | undefined;
    lastUsed?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    type: "slack" | "discord" | "webhook" | "api_key";
    workspaceId: string;
    enabled: boolean;
    usageCount: number;
    name?: string | null | undefined;
    config?: any;
    apiKey?: string | null | undefined;
    lastUsed?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export declare const AuditLog: mongoose.Model<{
    result: "success" | "failure";
    workspaceId: string;
    userId: string;
    action?: string | null | undefined;
    targetType?: string | null | undefined;
    targetId?: string | null | undefined;
    changes?: any;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    result: "success" | "failure";
    workspaceId: string;
    userId: string;
    action?: string | null | undefined;
    targetType?: string | null | undefined;
    targetId?: string | null | undefined;
    changes?: any;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    result: "success" | "failure";
    workspaceId: string;
    userId: string;
    action?: string | null | undefined;
    targetType?: string | null | undefined;
    targetId?: string | null | undefined;
    changes?: any;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    result: "success" | "failure";
    workspaceId: string;
    userId: string;
    action?: string | null | undefined;
    targetType?: string | null | undefined;
    targetId?: string | null | undefined;
    changes?: any;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    result: "success" | "failure";
    workspaceId: string;
    userId: string;
    action?: string | null | undefined;
    targetType?: string | null | undefined;
    targetId?: string | null | undefined;
    changes?: any;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    result: "success" | "failure";
    workspaceId: string;
    userId: string;
    action?: string | null | undefined;
    targetType?: string | null | undefined;
    targetId?: string | null | undefined;
    changes?: any;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
//# sourceMappingURL=Enterprise.d.ts.map