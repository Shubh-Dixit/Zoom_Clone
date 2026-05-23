'use client';

/**
 * Hook de Socket.IO para la sala de reuniones.
 * Abstrae la conexión y los eventos de socket en un hook reutilizable.
 * Porteado de los manejadores originales de Flask-SocketIO.
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type { ChatMessage, SocketUser } from '@/types';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000';

interface UseSocketOptions {
  meetingId: string;
  user: SocketUser | null;
  onNewUser: (userId: string) => void;
  onUserDisconnected: (userId: string) => void;
}

interface UseSocketReturn {
  isConnected: boolean;
  messages: ChatMessage[];
  sendMessage: (content: string) => void;
  announceJoin: () => void;
  announceLeave: () => void;
}

export function useSocket({
  meetingId,
  user,
  onNewUser,
  onUserDisconnected,
}: UseSocketOptions): UseSocketReturn {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    // Conectar al servidor Socket.IO en el path /ws/socket.io
    const socket = io(SOCKET_URL, {
      path: '/ws/socket.io',
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    // Otro usuario se unió a la sala
    socket.on('newUser', (msg: string) => {
      const data = JSON.parse(msg) as SocketUser;
      if (data.meetingID === meetingId) {
        onNewUser(data.userID);
      }
    });

    // Otro usuario abandonó la sala
    socket.on('userDisconnected', (msg: string) => {
      const data = JSON.parse(msg) as SocketUser;
      onUserDisconnected(data.userID);
    });

    // Mensajes de chat y respuestas de sistema
    socket.on('message', (msg: string) => {
      if (msg === 'userExists' || msg === 'userOK') return;
      try {
        const parsed = JSON.parse(msg) as ChatMessage;
        if (parsed.meetingID === meetingId) {
          setMessages((prev) => [...prev, parsed]);
        }
      } catch {
        // Mensaje no JSON — ignorar
      }
    });

    return () => {
      socket.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingId]);

  /** Anuncia la llegada del usuario a la sala */
  const announceJoin = useCallback(() => {
    if (!socketRef.current || !user) return;
    socketRef.current.emit('newUser', JSON.stringify(user));
  }, [user]);

  /** Anuncia la salida del usuario de la sala */
  const announceLeave = useCallback(() => {
    if (!socketRef.current || !user) return;
    socketRef.current.emit('userDisconnected', JSON.stringify(user));
  }, [user]);

  /** Envía un mensaje de chat al servidor para broadcast */
  const sendMessage = useCallback((content: string) => {
    if (!socketRef.current || !user) return;
    const msg: ChatMessage = { user: user.username, content, meetingID: meetingId };
    socketRef.current.emit('message', JSON.stringify(msg));
    // Agregar el mensaje propio a la lista local
    setMessages((prev) => [...prev, msg]);
  }, [user, meetingId]);

  return { isConnected, messages, sendMessage, announceJoin, announceLeave };
}
