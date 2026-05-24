# Advanced Features Guide

## Phase 10: Production-Grade Features

### 1. Streaming Responses

**Backend:** `POST /api/chat/stream`
- Server-Sent Events (SSE) for real-time streaming
- Chunks OpenAI response back to client as tokens arrive
- Saves complete message after streaming ends

```typescript
// Usage
const response = await fetch('/api/chat/stream', {
  method: 'POST',
  body: JSON.stringify({ workspaceId, conversationId, message }),
});

const reader = response.body?.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  // Parse 'data: {...}' lines
  // Stream token arrives immediately for real-time UI updates
}
```

**Frontend:**
- Real-time message streaming with `StreamingChat` component
- Message placeholder shown immediately
- Content updates as tokens arrive
- No page freeze during AI response

### 2. Chat History & Persistence

**Models:**
- `Conversation` — Chat thread metadata (title, pinned, lastMessageAt, messageCount)
- `ChatHistory` — Individual messages with metadata (role, content, sourceFiles, tokensUsed)

**Features:**
- Save all messages automatically
- Retrieve conversation history
- Pin important conversations
- Rename conversations
- Delete with cascade (removes all messages)

```typescript
// Create conversation
POST /api/chat/conversations
{ "workspaceId": "...", "title": "Project Discussion" }

// Get all conversations
GET /api/chat/conversations?workspaceId=...

// Get messages
GET /api/chat/conversations/:conversationId/messages?limit=100&skip=0

// Update title
PATCH /api/chat/conversations/:id/title
{ "title": "New Title" }

// Pin/unpin
PATCH /api/chat/conversations/:id/pin
{ "pinned": true }
```

### 3. Advanced RAG Features

**Semantic Search:**
```typescript
const results = await advancedRAGService.search(
  "How do I authenticate users?",
  workspaceId,
  5
);
// Returns: [{ id, content, metadata, score }, ...]
```

**Similarity Search with Threshold:**
```typescript
const relevant = await advancedRAGService.semanticSearch(
  query,
  workspaceId,
  { limit: 5, threshold: 0.7 }
);
```

**Hybrid Search (Semantic + Full-text):**
```typescript
const hybrid = await advancedRAGService.hybridSearch(
  query,
  workspaceId,
  0.7 // semantic weight
);
```

**Reranking:**
```typescript
const reranked = await advancedRAGService.rerank(
  query,
  documents,
  3 // top K results
);
```

### 4. Real-Time Collaboration

**WebSocket Events:**

```javascript
// Client connects
socket.emit('join-workspace', workspaceId);

// Send message (broadcasts to all users)
socket.emit('send-message', {
  workspaceId,
  conversationId,
  userId,
  message: "Hello!"
});

// Listen for new messages
socket.on('new-message', (data) => {
  // Update UI with new message
});

// Typing indicator
socket.emit('typing', { workspaceId, conversationId, userId });
socket.emit('stop-typing', { workspaceId, conversationId });

// Conversation renamed
socket.on('conversation-updated', (data) => {
  // Update conversation title in UI
});
```

### 5. Search Capabilities

**Conversation & Message Search:**
```
GET /api/chat/search?workspaceId=...&query=...&type=all|conversations|messages
```

Returns:
```json
{
  "conversations": [{ _id, title, summary, ... }],
  "messages": [{ _id, content, role, ... }]
}
```

**Features:**
- Full-text search across conversations
- Message content search
- Filter by type (conversations, messages, or all)
- Case-insensitive matching

### 6. Context Metadata

**Message Metadata:**
```typescript
{
  sourceFiles: ["auth.ts", "config.ts"],  // Files referenced in response
  agentsUsed: ["codeAgent", "docAgent"],  // Multi-agent trace
  tokensUsed: 1250                         // Token consumption tracking
}
```

**Conversation Summary:**
- Auto-generated from first 5 messages
- Used for search and list previews
- Searchable field

### 7. Components

**ConversationList**
- Sidebar with all conversations
- Pin/unpin conversations (pinned at top)
- New chat button
- Auto-refresh on conversation list change

**StreamingChat**
- Load message history from server
- Real-time streaming display
- Source file attribution
- Error handling with retry

**AdvancedSearch**
- Search across workspaces
- Filter: conversations, messages, or all
- Result preview with truncation
- Date information

## Integration Steps

### 1. Backend Setup

```typescript
import { setupWebSocket } from './websocket/setup';
import chatRoutes from './routes/chat';

// In main server file
const io = setupWebSocket(httpServer);
app.use('/api/chat', chatRoutes);

// Add error handler
app.use(errorHandler);
```

### 2. Frontend Setup

```tsx
import { ConversationList } from '@/components/AdvancedChat';
import { StreamingChat } from '@/components/AdvancedChat';
import { AdvancedSearch } from '@/components/AdvancedSearch';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export function ChatInterface({ workspaceId }) {
  const [selectedConv, setSelectedConv] = useState<string>('');

  return (
    <ErrorBoundary>
      <div className="flex h-screen">
        <ConversationList
          workspaceId={workspaceId}
          selectedId={selectedConv}
          onSelect={setSelectedConv}
          onNew={() => createNewConversation()}
        />
        {selectedConv && (
          <StreamingChat
            workspaceId={workspaceId}
            conversationId={selectedConv}
          />
        )}
      </div>
      <AdvancedSearch workspaceId={workspaceId} />
    </ErrorBoundary>
  );
}
```

### 3. Streaming Setup

Requirements:
- OPENAI_API_KEY environment variable
- OpenAI SDK (already installed)
- Response headers allow streaming

### 4. Database Indexes

```typescript
// Already configured in models:
- ChatHistory: workspaceId + conversationId
- Conversation: workspaceId + createdAt
- Conversation: pinned (for sorting)
```

## Performance Considerations

**Streaming:**
- Reduces perceived latency (tokens appear immediately)
- Reduces bandwidth (partial responses sent)
- Better UX than waiting for full response

**History:**
- Message limit per load (100 by default)
- Pagination with skip/limit
- Index on workspace + conversation for fast queries

**Search:**
- Full-text search on message content
- Prefix indexes for autocomplete
- Semantic search through RAG

**WebSocket:**
- Room-based broadcasting (only sends to workspace)
- Message queuing for offline clients
- Automatic reconnection

## Limitations & Future Work

**Current:**
- Conversations are workspace-scoped
- No real-time file sharing (only metadata)
- Single threaded responses

**Future:**
- Multi-threaded conversations
- Parallel agent responses
- Real-time cursor positions
- Document versioning
- Conversation branching

---

**Advanced Features Complete (Phase 10/10)** ✅

Full production-grade system with:
- Streaming responses
- Chat persistence
- Advanced search
- Real-time collaboration
- Hybrid RAG
- Message metadata tracking

🚀 **Ready for full production deployment and user testing!**
