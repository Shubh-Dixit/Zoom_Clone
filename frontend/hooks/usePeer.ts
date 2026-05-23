'use client';

/**
 * Hook de PeerJS para conexiones WebRTC peer-to-peer.
 * Abstrae la inicialización del peer, streams de video y conexión con otros usuarios.
 * Porteado de la lógica de main.js original.
 */
import { useEffect, useRef, useState, useCallback } from 'react';

interface RemoteStream {
  userId: string;
  stream: MediaStream;
  username: string;
}

interface UsePeerReturn {
  peerId: string | null;
  localStream: MediaStream | null;
  remoteStreams: RemoteStream[];
  connectToUser: (userId: string, stream: MediaStream) => void;
  disconnectUser: (userId: string) => void;
  isMediaReady: boolean;
  mediaError: string | null;
}

export function usePeer(meetingId: string): UsePeerReturn {
  const peerRef = useRef<any>(null);
  const [peerId, setPeerId] = useState<string | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);
  const [isMediaReady, setIsMediaReady] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const peersRef = useRef<Record<string, any>>({});

  useEffect(() => {
    // PeerJS solo funciona en el navegador (no en SSR)
    if (typeof window === 'undefined') return;

    // Importar PeerJS dinámicamente para evitar errores de SSR
    import('peerjs').then(({ Peer }) => {
      const peer = new Peer({
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
          ],
        },
      });

      peerRef.current = peer;

      peer.on('open', (id) => {
        setPeerId(id);

        // Solicitar acceso a cámara y micrófono
        navigator.mediaDevices
          .getUserMedia({ audio: true, video: true })
          .then((stream) => {
            setLocalStream(stream);
            setIsMediaReady(true);

            // Responder a llamadas entrantes
            peer.on('call', (call) => {
              call.answer(stream);
              call.on('stream', (remoteStream) => {
                setRemoteStreams((prev) => {
                  const exists = prev.find((r) => r.userId === call.peer);
                  if (exists) return prev;
                  return [...prev, { userId: call.peer, stream: remoteStream, username: call.peer }];
                });
              });
            });
          })
          .catch((err) => {
            setMediaError(err.message || 'Camera/microphone access denied');
            setIsMediaReady(false);
          });
      });

      peer.on('error', (err) => {
        setMediaError(err.message);
      });
    });

    return () => {
      peerRef.current?.destroy();
      localStream?.getTracks().forEach((t) => t.stop());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingId]);

  /** Inicia una llamada a un nuevo usuario que se unió a la sala */
  const connectToUser = useCallback(
    (userId: string, stream: MediaStream) => {
      if (!peerRef.current || !stream) return;
      const call = peerRef.current.call(userId, stream);
      peersRef.current[userId] = call;

      call.on('stream', (remoteStream: MediaStream) => {
        setRemoteStreams((prev) => {
          const exists = prev.find((r) => r.userId === userId);
          if (exists) return prev;
          return [...prev, { userId, stream: remoteStream, username: userId }];
        });
      });

      call.on('close', () => disconnectUser(userId));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /** Cierra la conexión con un usuario que abandonó la sala */
  const disconnectUser = useCallback((userId: string) => {
    if (peersRef.current[userId]) {
      peersRef.current[userId].close();
      delete peersRef.current[userId];
    }
    setRemoteStreams((prev) => prev.filter((r) => r.userId !== userId));
  }, []);

  return { peerId, localStream, remoteStreams, connectToUser, disconnectUser, isMediaReady, mediaError };
}
