export declare class FileService {
    saveFile(workspaceId: string, userId: string, filename: string, content: string, mimeType?: string, size?: number, path?: string): Promise<import("mongoose").Document<unknown, {}, {
        path: string;
        workspaceId: string;
        userId: string;
        filename: string;
        isDirectory: boolean;
        indexed: boolean;
        content?: string | null | undefined;
        size?: number | null | undefined;
        mimeType?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {}, {
        timestamps: true;
    }> & {
        path: string;
        workspaceId: string;
        userId: string;
        filename: string;
        isDirectory: boolean;
        indexed: boolean;
        content?: string | null | undefined;
        size?: number | null | undefined;
        mimeType?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    createDirectory(workspaceId: string, userId: string, name: string, parentPath?: string): Promise<import("mongoose").Document<unknown, {}, {
        path: string;
        workspaceId: string;
        userId: string;
        filename: string;
        isDirectory: boolean;
        indexed: boolean;
        content?: string | null | undefined;
        size?: number | null | undefined;
        mimeType?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {}, {
        timestamps: true;
    }> & {
        path: string;
        workspaceId: string;
        userId: string;
        filename: string;
        isDirectory: boolean;
        indexed: boolean;
        content?: string | null | undefined;
        size?: number | null | undefined;
        mimeType?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getFile(fileId: string): Promise<(import("mongoose").Document<unknown, {}, {
        path: string;
        workspaceId: string;
        userId: string;
        filename: string;
        isDirectory: boolean;
        indexed: boolean;
        content?: string | null | undefined;
        size?: number | null | undefined;
        mimeType?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {}, {
        timestamps: true;
    }> & {
        path: string;
        workspaceId: string;
        userId: string;
        filename: string;
        isDirectory: boolean;
        indexed: boolean;
        content?: string | null | undefined;
        size?: number | null | undefined;
        mimeType?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    getByPath(workspaceId: string, path: string): Promise<(import("mongoose").Document<unknown, {}, {
        path: string;
        workspaceId: string;
        userId: string;
        filename: string;
        isDirectory: boolean;
        indexed: boolean;
        content?: string | null | undefined;
        size?: number | null | undefined;
        mimeType?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {}, {
        timestamps: true;
    }> & {
        path: string;
        workspaceId: string;
        userId: string;
        filename: string;
        isDirectory: boolean;
        indexed: boolean;
        content?: string | null | undefined;
        size?: number | null | undefined;
        mimeType?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    getWorkspaceFiles(workspaceId: string, parentPath?: string): Promise<(import("mongoose").Document<unknown, {}, {
        path: string;
        workspaceId: string;
        userId: string;
        filename: string;
        isDirectory: boolean;
        indexed: boolean;
        content?: string | null | undefined;
        size?: number | null | undefined;
        mimeType?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {}, {
        timestamps: true;
    }> & {
        path: string;
        workspaceId: string;
        userId: string;
        filename: string;
        isDirectory: boolean;
        indexed: boolean;
        content?: string | null | undefined;
        size?: number | null | undefined;
        mimeType?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getTree(workspaceId: string): Promise<(import("mongoose").Document<unknown, {}, {
        path: string;
        workspaceId: string;
        userId: string;
        filename: string;
        isDirectory: boolean;
        indexed: boolean;
        content?: string | null | undefined;
        size?: number | null | undefined;
        mimeType?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {}, {
        timestamps: true;
    }> & {
        path: string;
        workspaceId: string;
        userId: string;
        filename: string;
        isDirectory: boolean;
        indexed: boolean;
        content?: string | null | undefined;
        size?: number | null | undefined;
        mimeType?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    renameFile(fileId: string, newName: string): Promise<(import("mongoose").Document<unknown, {}, {
        path: string;
        workspaceId: string;
        userId: string;
        filename: string;
        isDirectory: boolean;
        indexed: boolean;
        content?: string | null | undefined;
        size?: number | null | undefined;
        mimeType?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {}, {
        timestamps: true;
    }> & {
        path: string;
        workspaceId: string;
        userId: string;
        filename: string;
        isDirectory: boolean;
        indexed: boolean;
        content?: string | null | undefined;
        size?: number | null | undefined;
        mimeType?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    moveFile(fileId: string, newParentPath: string): Promise<(import("mongoose").Document<unknown, {}, {
        path: string;
        workspaceId: string;
        userId: string;
        filename: string;
        isDirectory: boolean;
        indexed: boolean;
        content?: string | null | undefined;
        size?: number | null | undefined;
        mimeType?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {}, {
        timestamps: true;
    }> & {
        path: string;
        workspaceId: string;
        userId: string;
        filename: string;
        isDirectory: boolean;
        indexed: boolean;
        content?: string | null | undefined;
        size?: number | null | undefined;
        mimeType?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    updateIndexed(fileId: string): Promise<(import("mongoose").Document<unknown, {}, {
        path: string;
        workspaceId: string;
        userId: string;
        filename: string;
        isDirectory: boolean;
        indexed: boolean;
        content?: string | null | undefined;
        size?: number | null | undefined;
        mimeType?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {}, {
        timestamps: true;
    }> & {
        path: string;
        workspaceId: string;
        userId: string;
        filename: string;
        isDirectory: boolean;
        indexed: boolean;
        content?: string | null | undefined;
        size?: number | null | undefined;
        mimeType?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    deleteFile(fileId: string): Promise<(import("mongoose").Document<unknown, {}, {
        path: string;
        workspaceId: string;
        userId: string;
        filename: string;
        isDirectory: boolean;
        indexed: boolean;
        content?: string | null | undefined;
        size?: number | null | undefined;
        mimeType?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {}, {
        timestamps: true;
    }> & {
        path: string;
        workspaceId: string;
        userId: string;
        filename: string;
        isDirectory: boolean;
        indexed: boolean;
        content?: string | null | undefined;
        size?: number | null | undefined;
        mimeType?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    searchFiles(workspaceId: string, query: string): Promise<(import("mongoose").Document<unknown, {}, {
        path: string;
        workspaceId: string;
        userId: string;
        filename: string;
        isDirectory: boolean;
        indexed: boolean;
        content?: string | null | undefined;
        size?: number | null | undefined;
        mimeType?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps, {}, {
        timestamps: true;
    }> & {
        path: string;
        workspaceId: string;
        userId: string;
        filename: string;
        isDirectory: boolean;
        indexed: boolean;
        content?: string | null | undefined;
        size?: number | null | undefined;
        mimeType?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
}
export declare const fileService: FileService;
//# sourceMappingURL=FileService.d.ts.map