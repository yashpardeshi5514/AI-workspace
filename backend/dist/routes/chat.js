import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { chatService } from '../services/ChatService';
import { ragService } from 'ai-services';
import { OpenAI } from 'openai';
import { asyncHandler } from '../middleware/errorHandler';
const router = Router();
const openai = new OpenAI();
// Create conversation
router.post('/conversations', authMiddleware, asyncHandler(async (req, res) => {
    const { workspaceId, title } = req.body;
    if (!workspaceId || !title) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    const conv = await chatService.createConversation(workspaceId, req.userId, title);
    res.status(201).json(conv);
}));
// Get conversations
router.get('/conversations', authMiddleware, asyncHandler(async (req, res) => {
    const { workspaceId } = req.query;
    if (!workspaceId) {
        res.status(400).json({ error: 'Workspace ID required' });
        return;
    }
    const conversations = await chatService.getConversations(workspaceId);
    res.json(conversations);
}));
// Get conversation messages
router.get('/conversations/:conversationId/messages', authMiddleware, asyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    const { limit = 100, skip = 0 } = req.query;
    const messages = await chatService.getMessages(conversationId, parseInt(limit), parseInt(skip));
    res.json(messages);
}));
// Streaming chat response (SSE)
router.post('/chat/stream', authMiddleware, async (req, res) => {
    try {
        const { workspaceId, conversationId, message } = req.body;
        if (!workspaceId || !conversationId || !message) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        // Save user message
        await chatService.saveMessage(conversationId, workspaceId, req.userId, 'user', message);
        // Get conversation history for context
        const history = await chatService.getMessages(conversationId, 10);
        // RAG search
        let ragContext = '';
        let sourceFiles = [];
        try {
            const ragResults = await ragService.search(message, 3);
            sourceFiles = ragResults.map((r) => r.metadata?.filename || r.id);
            ragContext = ragResults.map(r => r.content).join('\n\n');
        }
        catch (err) {
            console.error('RAG search error:', err);
        }
        // Prepare messages for OpenAI
        const messages = history.map(m => ({
            role: m.role,
            content: m.content,
        }));
        // Set up SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        let fullResponse = '';
        try {
            // Stream from OpenAI
            const stream = await openai.chat.completions.create({
                model: process.env.OPENAI_MODEL || 'gpt-4-turbo',
                messages: [
                    ...messages,
                    {
                        role: 'user',
                        content: ragContext
                            ? `Context from workspace:\n${ragContext}\n\nUser question: ${message}`
                            : message,
                    },
                ],
                stream: true,
                temperature: 0.7,
                max_tokens: 2000,
            });
            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content;
                if (content) {
                    fullResponse += content;
                    res.write(`data: ${JSON.stringify({ content })}\n\n`);
                }
            }
            // Save assistant message
            await chatService.saveMessage(conversationId, workspaceId, req.userId, 'assistant', fullResponse, { sourceFiles });
            res.write('data: [DONE]\n\n');
            res.end();
        }
        catch (err) {
            console.error('Streaming error:', err);
            res.write(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`);
            res.end();
        }
    }
    catch (err) {
        console.error('Chat stream error:', err);
        res.status(500).json({ error: 'Stream error' });
    }
});
// Non-streaming chat (fallback)
router.post('/chat', authMiddleware, asyncHandler(async (req, res) => {
    const { workspaceId, conversationId, message } = req.body;
    if (!workspaceId || !conversationId || !message) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    // Save user message
    await chatService.saveMessage(conversationId, workspaceId, req.userId, 'user', message);
    // Get conversation history
    const history = await chatService.getMessages(conversationId, 10);
    // RAG search
    let ragContext = '';
    let sourceFiles = [];
    try {
        const ragResults = await ragService.search(message, 3);
        sourceFiles = ragResults.map((r) => r.metadata?.filename || r.id);
        ragContext = ragResults.map(r => r.content).join('\n\n');
    }
    catch (err) {
        console.error('RAG search error:', err);
    }
    const messages = history.map(m => ({
        role: m.role,
        content: m.content,
    }));
    const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo',
        messages: [
            ...messages,
            {
                role: 'user',
                content: ragContext
                    ? `Context from workspace:\n${ragContext}\n\nUser question: ${message}`
                    : message,
            },
        ],
        temperature: 0.7,
        max_tokens: 2000,
    });
    const response = completion.choices[0].message.content || '';
    // Save assistant response
    await chatService.saveMessage(conversationId, workspaceId, req.userId, 'assistant', response, { sourceFiles });
    res.json({
        response,
        sourceFiles,
        usage: {
            promptTokens: completion.usage?.prompt_tokens,
            completionTokens: completion.usage?.completion_tokens,
        },
    });
}));
// Search conversations and messages
router.get('/search', authMiddleware, asyncHandler(async (req, res) => {
    const { workspaceId, query, type = 'all' } = req.query;
    if (!workspaceId || !query) {
        res.status(400).json({ error: 'Missing query parameters' });
        return;
    }
    const results = {};
    if (type === 'conversations' || type === 'all') {
        results.conversations = await chatService.searchConversations(workspaceId, query);
    }
    if (type === 'messages' || type === 'all') {
        results.messages = await chatService.searchMessages(workspaceId, query);
    }
    res.json(results);
}));
// Pin conversation
router.patch('/conversations/:id/pin', authMiddleware, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { pinned } = req.body;
    const conv = await chatService.pinConversation(id, pinned);
    res.json(conv);
}));
// Update conversation title
router.patch('/conversations/:id/title', authMiddleware, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    if (!title) {
        res.status(400).json({ error: 'Title required' });
        return;
    }
    const conv = await chatService.updateConversationTitle(id, title);
    res.json(conv);
}));
// Delete conversation
router.delete('/conversations/:id', authMiddleware, asyncHandler(async (req, res) => {
    const { id } = req.params;
    await chatService.deleteConversation(id);
    res.json({ success: true });
}));
export default router;
//# sourceMappingURL=chat.js.map