// Real-time collaboration service for cursor sync
import { Server as SocketServer } from 'socket.io';

interface CursorPosition {
  line: number;
  column: number;
  userId: string;
  userName: string;
}

interface EditorSession {
  fileId: string;
  users: Map<string, { userId: string; userName: string; cursor: CursorPosition }>;
  content: string;
}

export class CollaborationService {
  private sessions = new Map<string, EditorSession>();

  createSession(fileId: string, initialContent: string) {
    this.sessions.set(fileId, {
      fileId,
      users: new Map(),
      content: initialContent,
    });
  }

  getSession(fileId: string) {
    return this.sessions.get(fileId);
  }

  addUser(fileId: string, userId: string, userName: string) {
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

  removeUser(fileId: string, userId: string) {
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

  updateCursor(
    fileId: string,
    userId: string,
    line: number,
    column: number
  ) {
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

  getActiveCursors(fileId: string) {
    const session = this.sessions.get(fileId);
    if (session) {
      return Array.from(session.users.values()).map(u => u.cursor);
    }
    return [];
  }

  updateContent(fileId: string, newContent: string) {
    const session = this.sessions.get(fileId);
    if (session) {
      session.content = newContent;
    }
  }

  getContent(fileId: string) {
    const session = this.sessions.get(fileId);
    return session?.content || '';
  }
}

export const collaborationService = new CollaborationService();

// WebSocket integration for collaboration
export function setupCollaborationEvents(io: SocketServer) {
  io.on('connection', socket => {
    // Join editor session
    socket.on(
      'join-editor',
      (data: { fileId: string; userId: string; userName: string }) => {
        const { fileId, userId, userName } = data;
        socket.join(`editor-${fileId}`);

        const users = collaborationService.addUser(fileId, userId, userName);

        // Notify others that user joined
        io.to(`editor-${fileId}`).emit('user-joined', { userId, userName, users });
      }
    );

    // Leave editor session
    socket.on('leave-editor', (data: { fileId: string; userId: string }) => {
      const { fileId, userId } = data;
      socket.leave(`editor-${fileId}`);

      const users = collaborationService.removeUser(fileId, userId);
      io.to(`editor-${fileId}`).emit('user-left', { userId, users });
    });

    // Broadcast cursor position
    socket.on(
      'cursor-move',
      (data: {
        fileId: string;
        userId: string;
        line: number;
        column: number;
      }) => {
        const { fileId, userId, line, column } = data;
        const cursor = collaborationService.updateCursor(
          fileId,
          userId,
          line,
          column
        );

        if (cursor) {
          io.to(`editor-${fileId}`).emit('cursor-updated', cursor);
        }
      }
    );

    // Content change (from one user)
    socket.on(
      'content-change',
      (data: { fileId: string; userId: string; newContent: string }) => {
        const { fileId, userId, newContent } = data;
        collaborationService.updateContent(fileId, newContent);

        // Broadcast to others (not sender)
        socket.to(`editor-${fileId}`).emit('content-updated', {
          userId,
          content: newContent,
        });
      }
    );

    // Get active users in session
    socket.on('get-users', (data: { fileId: string }) => {
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
