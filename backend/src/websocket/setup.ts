// WebSocket setup for real-time features
import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { chatService } from '../services/ChatService';

export function setupWebSocket(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    },
  });

  io.on('connection', socket => {
    console.log('Client connected:', socket.id);

    // Join workspace room
    socket.on('join-workspace', (workspaceId: string) => {
      socket.join(`workspace-${workspaceId}`);
      console.log(`Client joined workspace: ${workspaceId}`);
    });

    // Real-time message broadcasting
    socket.on(
      'send-message',
      async (data: {
        workspaceId: string;
        conversationId: string;
        userId: string;
        message: string;
      }) => {
        const { workspaceId, conversationId, userId, message } = data;

        try {
          // Save to database
          const msg = await chatService.saveMessage(
            conversationId,
            workspaceId,
            userId,
            'user',
            message
          );

          // Broadcast to all users in workspace
          io.to(`workspace-${workspaceId}`).emit('new-message', {
            conversationId,
            message: msg,
          });
        } catch (err) {
          socket.emit('error', { message: 'Failed to send message' });
        }
      }
    );

    // Typing indicator
    socket.on(
      'typing',
      (data: { workspaceId: string; conversationId: string; userId: string }) => {
        io.to(`workspace-${data.workspaceId}`).emit('user-typing', {
          conversationId: data.conversationId,
          userId: data.userId,
        });
      }
    );

    socket.on(
      'stop-typing',
      (data: { workspaceId: string; conversationId: string }) => {
        io.to(`workspace-${data.workspaceId}`).emit('user-stop-typing', {
          conversationId: data.conversationId,
        });
      }
    );

    // Conversation update
    socket.on(
      'update-conversation',
      async (data: { workspaceId: string; conversationId: string; title: string }) => {
        try {
          await chatService.updateConversationTitle(data.conversationId, data.title);
          io.to(`workspace-${data.workspaceId}`).emit('conversation-updated', {
            conversationId: data.conversationId,
            title: data.title,
          });
        } catch (err) {
          socket.emit('error', { message: 'Failed to update conversation' });
        }
      }
    );

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}
