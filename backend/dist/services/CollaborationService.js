export class CollaborationService {
    constructor() {
        this.sessions = new Map();
    }
    createSession(fileId, initialContent) {
        this.sessions.set(fileId, {
            fileId,
            users: new Map(),
            content: initialContent,
        });
    }
    getSession(fileId) {
        return this.sessions.get(fileId);
    }
    addUser(fileId, userId, userName) {
        const session = this.sessions.get(fileId);
        if (session) {
            session.users.set(userId, {
                userId,
                userName,
                cursor: { line: 0, column: 0, userId, userName },
            });
            return Array.from(session.users.values());
        }
        return [];
    }
    removeUser(fileId, userId) {
        const session = this.sessions.get(fileId);
        if (session) {
            session.users.delete(userId);
            if (session.users.size === 0) {
                this.sessions.delete(fileId);
            }
            return Array.from(session.users.values());
        }
        return [];
    }
    updateCursor(fileId, userId, line, column) {
        const session = this.sessions.get(fileId);
        if (session) {
            const user = session.users.get(userId);
            if (user) {
                user.cursor = { ...user.cursor, line, column };
                return user.cursor;
            }
        }
        return null;
    }
    getActiveCursors(fileId) {
        const session = this.sessions.get(fileId);
        if (session) {
            return Array.from(session.users.values()).map(u => u.cursor);
        }
        return [];
    }
    updateContent(fileId, newContent) {
        const session = this.sessions.get(fileId);
        if (session) {
            session.content = newContent;
        }
    }
    getContent(fileId) {
        const session = this.sessions.get(fileId);
        return session?.content || '';
    }
}
export const collaborationService = new CollaborationService();
// WebSocket integration for collaboration
export function setupCollaborationEvents(io) {
    io.on('connection', socket => {
        // Join editor session
        socket.on('join-editor', (data) => {
            const { fileId, userId, userName } = data;
            socket.join(`editor-${fileId}`);
            const users = collaborationService.addUser(fileId, userId, userName);
            // Notify others that user joined
            io.to(`editor-${fileId}`).emit('user-joined', { userId, userName, users });
        });
        // Leave editor session
        socket.on('leave-editor', (data) => {
            const { fileId, userId } = data;
            socket.leave(`editor-${fileId}`);
            const users = collaborationService.removeUser(fileId, userId);
            io.to(`editor-${fileId}`).emit('user-left', { userId, users });
        });
        // Broadcast cursor position
        socket.on('cursor-move', (data) => {
            const { fileId, userId, line, column } = data;
            const cursor = collaborationService.updateCursor(fileId, userId, line, column);
            if (cursor) {
                io.to(`editor-${fileId}`).emit('cursor-updated', cursor);
            }
        });
        // Content change (from one user)
        socket.on('content-change', (data) => {
            const { fileId, userId, newContent } = data;
            collaborationService.updateContent(fileId, newContent);
            // Broadcast to others (not sender)
            socket.to(`editor-${fileId}`).emit('content-updated', {
                userId,
                content: newContent,
            });
        });
        // Get active users in session
        socket.on('get-users', (data) => {
            const session = collaborationService.getSession(data.fileId);
            const users = session
                ? Array.from(session.users.values()).map(u => ({
                    userId: u.userId,
                    userName: u.userName,
                    cursor: u.cursor,
                }))
                : [];
            socket.emit('active-users', users);
        });
    });
}
//# sourceMappingURL=CollaborationService.js.map