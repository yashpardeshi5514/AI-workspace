import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import 'express-async-errors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import fileRoutes from './routes/files';
import { messageService } from './services/MessageService';
import { AuthService } from './services/AuthService';
import { aiService } from 'ai-services';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Database connection
async function connectDB() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-workspace'
    );
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);

app.get('/api/workspaces/:id/messages', async (req, res) => {
  try {
    const messages = await messageService.getMessages(req.params.id);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Socket.IO Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const payload = AuthService.verifyToken(token);
    socket.data.userId = payload.userId;
    socket.data.email = payload.email;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

// Socket.IO
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.data.userId}`);

  socket.on('workspace:join', (workspaceId) => {
    socket.join(`workspace:${workspaceId}`);
    socket.data.workspaceId = workspaceId;
    console.log(`User joined workspace: ${workspaceId}`);
  });

  socket.on('message:send', async (data) => {
    const { content } = data;
    const { userId, workspaceId } = socket.data;

    try {
      // Save user message
      const userMsg = await messageService.saveMessage(
        workspaceId,
        userId,
        content,
        'user'
      );

      io.to(`workspace:${workspaceId}`).emit('message', {
        id: userMsg._id,
        content: userMsg.content,
        role: 'user',
        timestamp: userMsg.createdAt,
      });

      // Get conversation history
      const history = await messageService.getMessages(workspaceId, 10);
      const conversationHistory = history
        .reverse()
        .slice(0, -1) // Exclude current message
        .map(m => ({
          role: m.role,
          content: m.content,
        }));

      // Process with AI agent
      const response = await aiService.processMessage(content, conversationHistory);

      // Save assistant response
      const assistantMsg = await messageService.saveMessage(
        workspaceId,
        'assistant',
        response,
        'assistant'
      );

      io.to(`workspace:${workspaceId}`).emit('message', {
        id: assistantMsg._id,
        content: assistantMsg.content,
        role: 'assistant',
        timestamp: assistantMsg.createdAt,
      });
    } catch (err) {
      console.error('Message processing error:', err);
      socket.emit('error', 'Failed to process message');
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.data.userId}`);
  });
});

const PORT = process.env.PORT || 3001;

async function start() {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch(console.error);

export default app;
