'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader, MessageCircle, Plus } from 'lucide-react';
import { useAuthStore } from '@/hooks/useAuthStore';
import axios from 'axios';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sourceFiles?: string[];
  timestamp: Date;
}

interface ConversationListProps {
  workspaceId: string;
  selectedId?: string;
  onSelect: (id: string) => void;
  onNew: () => void;
}

export function ConversationList({
  workspaceId,
  selectedId,
  onSelect,
  onNew,
}: ConversationListProps) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuthStore();

  useEffect(() => {
    loadConversations();
  }, [workspaceId, token]);

  const loadConversations = async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/conversations?workspaceId=${workspaceId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setConversations(res.data);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 border-r border-zinc-800">
      <button
        onClick={onNew}
        className="m-3 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium transition-colors"
      >
        <Plus className="w-4 h-4" />
        New Chat
      </button>

      <div className="flex-1 overflow-y-auto space-y-1 p-2">
        {conversations.map(conv => (
          <button
            key={conv._id}
            onClick={() => onSelect(conv._id)}
            className={`w-full text-left px-3 py-2 rounded text-sm transition-colors truncate ${
              selectedId === conv._id
                ? 'bg-zinc-800 text-white'
                : 'hover:bg-zinc-800 text-zinc-300'
            }`}
            title={conv.title}
          >
            {conv.pinned && <span className="mr-1">📌</span>}
            {conv.title}
          </button>
        ))}
      </div>
    </div>
  );
}

interface StreamingChatProps {
  workspaceId: string;
  conversationId: string;
}

export function StreamingChat({
  workspaceId,
  conversationId,
}: StreamingChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { token } = useAuthStore();

  useEffect(() => {
    loadMessages();
  }, [conversationId, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    if (!token) return;

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/conversations/${conversationId}/messages`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages(
        res.data.map((m: any) => ({
          id: m._id,
          role: m.role,
          content: m.content,
          sourceFiles: m.metadata?.sourceFiles,
          timestamp: new Date(m.createdAt),
        }))
      );
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !token) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setError('');
    setIsLoading(true);

    const assistantId = (Date.now() + 1).toString();
    let assistantContent = '';

    try {
      const eventSource = new EventSource(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/stream`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          } as any,
        }
      );

      // Add placeholder for streaming response
      setMessages(prev => [
        ...prev,
        {
          id: assistantId,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
        },
      ]);

      // Note: EventSource doesn't support POST, so we'll use fetch instead
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/stream`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            workspaceId,
            conversationId,
            message: input,
          }),
        }
      );

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') break;

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  assistantContent += parsed.content;
                  setMessages(prev =>
                    prev.map(m =>
                      m.id === assistantId
                        ? { ...m, content: assistantContent }
                        : m
                    )
                  );
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to get response'
      );
      setMessages(prev => prev.filter(m => m.id !== assistantId));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center text-zinc-500">
            <div>
              <MessageCircle className="w-12 h-12 mx-auto mb-2 text-zinc-600" />
              <p className="text-lg font-medium">Start a conversation</p>
            </div>
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-zinc-800 text-zinc-100 rounded-bl-none'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">
                  {msg.content}
                </p>
                {msg.sourceFiles && msg.sourceFiles.length > 0 && (
                  <div className="mt-2 text-xs text-zinc-400">
                    Sources: {msg.sourceFiles.join(', ')}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-2 bg-red-900/20 border-t border-red-900 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-zinc-800 bg-zinc-800/50"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
