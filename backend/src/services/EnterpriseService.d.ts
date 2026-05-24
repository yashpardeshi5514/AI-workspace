export declare class EnterpriseService {
    trackEvent(workspaceId: string, userId: string, event: string, data: any, metadata?: any): Promise<import("mongoose").Document<unknown, {}, {
        workspaceId: string;
        userId: string;
        event: "chat_message" | "file_upload" | "file_delete" | "code_execute" | "search_query" | "login" | "logout" | "workspace_create" | "user_invite";
        data?: any;
        metadata?: {
            ip?: string | null | undefined;
            userAgent?: string | null | undefined;
            duration?: number | null | undefined;
        } | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {}, {
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
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getAnalytics(workspaceId: string, days?: number): Promise<{
        totalEvents: number;
        eventsByType: any;
        activeUsers: number;
        timeline: any;
    }>;
    addTeamMember(workspaceId: string, email: string, role?: string): Promise<import("mongoose").Document<unknown, {}, {
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
    } & import("mongoose").DefaultTimestampProps, {}, {
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
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getTeamMembers(workspaceId: string): Promise<(import("mongoose").Document<unknown, {}, {
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
    } & import("mongoose").DefaultTimestampProps, {}, {
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
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    updateMemberRole(memberId: string, newRole: string): Promise<(import("mongoose").Document<unknown, {}, {
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
    } & import("mongoose").DefaultTimestampProps, {}, {
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
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    removeMember(memberId: string): Promise<(import("mongoose").Document<unknown, {}, {
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
    } & import("mongoose").DefaultTimestampProps, {}, {
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
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    createIntegration(workspaceId: string, type: string, name: string, config: any): Promise<import("mongoose").Document<unknown, {}, {
        type: "slack" | "discord" | "webhook" | "api_key";
        workspaceId: string;
        enabled: boolean;
        usageCount: number;
        apiKey?: string | null | undefined;
        name?: string | null | undefined;
        config?: any;
        lastUsed?: NativeDate | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {}, {
        timestamps: true;
    }> & {
        type: "slack" | "discord" | "webhook" | "api_key";
        workspaceId: string;
        enabled: boolean;
        usageCount: number;
        apiKey?: string | null | undefined;
        name?: string | null | undefined;
        config?: any;
        lastUsed?: NativeDate | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getIntegrations(workspaceId: string): Promise<(import("mongoose").Document<unknown, {}, {
        type: "slack" | "discord" | "webhook" | "api_key";
        workspaceId: string;
        enabled: boolean;
        usageCount: number;
        apiKey?: string | null | undefined;
        name?: string | null | undefined;
        config?: any;
        lastUsed?: NativeDate | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {}, {
        timestamps: true;
    }> & {
        type: "slack" | "discord" | "webhook" | "api_key";
        workspaceId: string;
        enabled: boolean;
        usageCount: number;
        apiKey?: string | null | undefined;
        name?: string | null | undefined;
        config?: any;
        lastUsed?: NativeDate | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    updateIntegration(integrationId: string, updates: any): Promise<(import("mongoose").Document<unknown, {}, {
        type: "slack" | "discord" | "webhook" | "api_key";
        workspaceId: string;
        enabled: boolean;
        usageCount: number;
        apiKey?: string | null | undefined;
        name?: string | null | undefined;
        config?: any;
        lastUsed?: NativeDate | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {}, {
        timestamps: true;
    }> & {
        type: "slack" | "discord" | "webhook" | "api_key";
        workspaceId: string;
        enabled: boolean;
        usageCount: number;
        apiKey?: string | null | undefined;
        name?: string | null | undefined;
        config?: any;
        lastUsed?: NativeDate | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    verifyApiKey(apiKey: string): Promise<(import("mongoose").Document<unknown, {}, {
        type: "slack" | "discord" | "webhook" | "api_key";
        workspaceId: string;
        enabled: boolean;
        usageCount: number;
        apiKey?: string | null | undefined;
        name?: string | null | undefined;
        config?: any;
        lastUsed?: NativeDate | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {}, {
        timestamps: true;
    }> & {
        type: "slack" | "discord" | "webhook" | "api_key";
        workspaceId: string;
        enabled: boolean;
        usageCount: number;
        apiKey?: string | null | undefined;
        name?: string | null | undefined;
        config?: any;
        lastUsed?: NativeDate | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    logAction(workspaceId: string, userId: string, action: string, targetType: string, targetId: string, changes?: any): Promise<import("mongoose").Document<unknown, {}, {
        result: "success" | "failure";
        workspaceId: string;
        userId: string;
        action?: string | null | undefined;
        targetType?: string | null | undefined;
        targetId?: string | null | undefined;
        changes?: any;
    } & import("mongoose").DefaultTimestampProps, {}, {
        timestamps: true;
    }> & {
        result: "success" | "failure";
        workspaceId: string;
        userId: string;
        action?: string | null | undefined;
        targetType?: string | null | undefined;
        targetId?: string | null | undefined;
        changes?: any;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getAuditLog(workspaceId: string, limit?: number): Promise<(import("mongoose").Document<unknown, {}, {
        result: "success" | "failure";
        workspaceId: string;
        userId: string;
        action?: string | null | undefined;
        targetType?: string | null | undefined;
        targetId?: string | null | undefined;
        changes?: any;
    } & import("mongoose").DefaultTimestampProps, {}, {
        timestamps: true;
    }> & {
        result: "success" | "failure";
        workspaceId: string;
        userId: string;
        action?: string | null | undefined;
        targetType?: string | null | undefined;
        targetId?: string | null | undefined;
        changes?: any;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    private groupByDay;
    private generateApiKey;
}
export declare const enterpriseService: EnterpriseService;
//# sourceMappingURL=EnterpriseService.d.ts.map