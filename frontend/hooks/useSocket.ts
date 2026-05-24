'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useChatStore } from './useChatStore';
import { useAuthStore } from './useAuthStore';

const WORKSPACE_ID = 'default-workspace'; // TODO: Dynamic workspace

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { addMessage, setLoading } = useChatStore();
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token) return;

    const socketUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';
    socketRef.current = io(socketUrl, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to server');
      socketRef.current?.emit('workspace:join', WORKSPACE_ID);
    });

    socketRef.current.on('message', (data: any) => {
      addMessage({
        id: data.id,
        content: data.content,
        role: data.role,
        timestamp: new Date(data.timestamp),
      });
      setLoading(false);
    });

    socketRef.current.on('error', (err) => {
      console.error('Socket error:', err);
      setLoading(false);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [addMessage, setLoading, token]);

  const sendMessage = (content: string) => {
    if (!socketRef.current) return;
    setLoading(true);
    socketRef.current.emit('message:send', {
      content,
    });
  };

  return { sendMessage, socket: socketRef.current };
}
