import { Server as SocketServer } from 'socket.io';
interface CursorPosition {
    line: number;
    column: number;
    userId: string;
    userName: string;
}
interface EditorSession {
    fileId: string;
    users: Map<string, {
        userId: string;
        userName: string;
        cursor: CursorPosition;
    }>;
    content: string;
}
export declare class CollaborationService {
    private sessions;
    createSession(fileId: string, initialContent: string): void;
    getSession(fileId: string): EditorSession | undefined;
    addUser(fileId: string, userId: string, userName: string): {
        userId: string;
        userName: string;
        cursor: CursorPosition;
    }[];
    removeUser(fileId: string, userId: string): {
        userId: string;
        userName: string;
        cursor: CursorPosition;
    }[];
    updateCursor(fileId: string, userId: string, line: number, column: number): CursorPosition | null;
    getActiveCursors(fileId: string): CursorPosition[];
    updateContent(fileId: string, newContent: string): void;
    getContent(fileId: string): string;
}
export declare const collaborationService: CollaborationService;
export declare function setupCollaborationEvents(io: SocketServer): void;
export {};
//# sourceMappingURL=CollaborationService.d.ts.map