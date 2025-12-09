'use client'; // if using Next.js 13+ App Router

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:8000';

interface UseSocketOptions {
  namespace?: string; // '/', '/notifications', '/realtime', '/chat'
  userId?: string;
  autoConnect?: boolean;
}

export function useSocket(options: UseSocketOptions = {}) {
  const { namespace = '/', userId, autoConnect = true } = options;
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Create socket connection
    const socketInstance = io(`${SOCKET_URL}${namespace}`, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      autoConnect,
      query: userId ? { userId } : undefined,
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    // Connection event handlers
    socketInstance.on('connect', () => {
      console.log('WebSocket connected:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', error => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
    });

    // Cleanup on unmount
    return () => {
      socketInstance.off('connect');
      socketInstance.off('disconnect');
      socketInstance.off('connect_error');
      socketInstance.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [namespace, userId, autoConnect]);

  return {
    socket,
    isConnected,
  };
}
