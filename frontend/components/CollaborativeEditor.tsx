'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Editor, OnChange, OnMount } from '@monaco-editor/react';

interface ActiveUser {
  userId: string;
  userName: string;
  cursor: { line: number; column: number };
}

interface CollaborativeEditorProps {
  fileId: string;
  content: string;
  language?: string;
  onChange?: (content: string) => void;
  readOnly?: boolean;
}

export function CollaborativeEditor({
  fileId,
  content,
  language = 'typescript',
  onChange,
  readOnly = false,
}: CollaborativeEditorProps) {
  const socketRef = useRef<Socket | null>(null);
  const editorRef = useRef<any>(null);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const currentUserRef = useRef<string>('user-' + Date.now());

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_WS_URL || '', {
      path: '/socket.io',
    });

    const socket = socketRef.current;
    const userId = currentUserRef.current;

    socket.emit('join-editor', {
      fileId,
      userId,
      userName: 'User ' + userId.slice(-4),
    });

    socket.on('user-joined', (data: { users: ActiveUser[] }) => {
      setActiveUsers(data.users);
    });

    socket.on('user-left', (data: { users: ActiveUser[] }) => {
      setActiveUsers(data.users);
    });

    socket.on('cursor-updated', (_cursor: ActiveUser['cursor']) => {
      // Remote cursor handling
    });

    socket.on('content-updated', (data: { userId: string; content: string }) => {
      if (data.userId !== userId && editorRef.current) {
        editorRef.current.setValue(data.content);
      }
    });

    socket.emit('get-users', { fileId });

    socket.on('active-users', (users: ActiveUser[]) => {
      setActiveUsers(users);
    });

    return () => {
      socket.emit('leave-editor', { fileId, userId });
      socket.disconnect();
    };
  }, [fileId]);

  const handleEditorChange: OnChange = (newContent) => {
    const updatedContent = newContent || '';

    if (socketRef.current) {
      socketRef.current.emit('content-change', {
        fileId,
        userId: currentUserRef.current,
        newContent: updatedContent,
      });
    }

    onChange?.(updatedContent);
  };

  const handleCursorChange = () => {
    if (editorRef.current && socketRef.current) {
      const selection = editorRef.current.getSelection();

      socketRef.current.emit('cursor-move', {
        fileId,
        userId: currentUserRef.current,
        line: selection?.startLineNumber || 0,
        column: selection?.startColumn || 0,
      });
    }
  };

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;

    editor.onDidChangeCursorPosition(() => {
      handleCursorChange();
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Active Users Bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border-b border-zinc-700 text-xs">
        <span className="text-zinc-400">Editing:</span>

        {activeUsers.map((user) => (
          <div
            key={user.userId}
            className="flex items-center gap-1 px-2 py-1 bg-zinc-700 rounded"
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: hashColor(user.userId),
              }}
            />

            <span>{user.userName}</span>
          </div>
        ))}
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          value={content}
          onChange={handleEditorChange}
          onMount={handleEditorMount}
          options={{
            minimap: { enabled: false },
            readOnly,
            theme: 'vs-dark',
          }}
        />
      </div>
    </div>
  );
}

function hashColor(str: string): string {
  const colors = [
    '#ff6b6b',
    '#4ecdc4',
    '#45b7d1',
    '#ffa502',
    '#ff006e',
    '#8338ec',
  ];

  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}