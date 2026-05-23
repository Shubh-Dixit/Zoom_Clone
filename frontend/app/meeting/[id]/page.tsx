'use client';

/**
 * Sala de reunión estilo Zoom con video WebRTC, chat y controles.
 * Sólo se renderiza en el cliente (WebRTC/PeerJS requiere el navegador).
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, WifiOff } from 'lucide-react';
import ControlBar from '@/components/meeting/ControlBar';
import ChatPanel from '@/components/meeting/ChatPanel';
import ParticipantTile from '@/components/meeting/ParticipantTile';
import { usePeer } from '@/hooks/usePeer';
import { useSocket } from '@/hooks/useSocket';
import { getMeeting, endMeeting } from '@/lib/api';
import type { SocketUser } from '@/types';

type AppState = 'loading' | 'enter_name' | 'in_meeting' | 'error' | 'ended';

export default function MeetingRoomPage() {
  const params = useParams();
  const router = useRouter();
  const meetingId = params.id as string;

  // Estado general de la aplicación
  const [appState, setAppState] = useState<AppState>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  // Datos del usuario local
  const [username, setUsername] = useState('');
  const [inputName, setInputName] = useState('');
  const [currentUser, setCurrentUser] = useState<SocketUser | null>(null);

  // Estado de los controles de media
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Referencia al video local para el tile
  const localVideoRef = useRef<HTMLVideoElement>(null);

  // Hook de PeerJS (WebRTC)
  const { peerId, localStream, remoteStreams, connectToUser, disconnectUser, isMediaReady, mediaError } =
    usePeer(meetingId);

  // Hook de Socket.IO
  const { isConnected, messages, sendMessage, announceJoin, announceLeave } = useSocket({
    meetingId,
    user: currentUser,
    onNewUser: (userId) => {
      if (localStream) connectToUser(userId, localStream);
    },
    onUserDisconnected: disconnectUser,
  });

  // Validar que la reunión existe en el backend
  useEffect(() => {
    const validate = async () => {
      try {
        await getMeeting(meetingId);
        setAppState('enter_name');
      } catch {
        setErrorMessage('This meeting does not exist or has expired.');
        setAppState('error');
      }
    };
    validate();
  }, [meetingId]);

  // Conectar el stream local al elemento video cuando esté listo
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Anunciar la unión una vez que tenemos peerId, stream y usuario
  useEffect(() => {
    if (currentUser && peerId && isMediaReady && isConnected) {
      announceJoin();
    }
  }, [currentUser, peerId, isMediaReady, isConnected, announceJoin]);

  // Controles de media
  const toggleMute = useCallback(() => {
    if (!localStream) return;
    const track = localStream.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
    }
  }, [localStream]);

  const toggleVideo = useCallback(() => {
    if (!localStream) return;
    const track = localStream.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setIsVideoOff(!track.enabled);
    }
  }, [localStream]);

  // Unirse a la reunión con el nombre ingresado
  const handleJoin = useCallback(() => {
    const name = inputName.trim();
    if (!name || !peerId) return;
    setUsername(name);
    setCurrentUser({ username: name, meetingID: meetingId, userID: peerId });
    setAppState('in_meeting');
  }, [inputName, peerId, meetingId]);

  // Abandonar la reunión
  const handleLeave = useCallback(async () => {
    announceLeave();
    localStream?.getTracks().forEach((t) => t.stop());
    try { await endMeeting(meetingId); } catch {}
    setAppState('ended');
    setTimeout(() => router.push('/'), 1500);
  }, [announceLeave, localStream, meetingId, router]);

  // ── Pantalla: cargando / validando ───────────────────────────────────────
  if (appState === 'loading') {
    return (
      <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="text-zoom-blue animate-spin" />
          <p className="text-zinc-300 text-sm">Connecting to meeting...</p>
        </div>
      </div>
    );
  }

  // ── Pantalla: error ───────────────────────────────────────────────────────
  if (appState === 'error') {
    return (
      <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center">
        <div className="text-center max-w-sm">
          <WifiOff size={48} className="mx-auto text-red-400 mb-4" />
          <p className="text-white text-lg font-semibold mb-2">Cannot join meeting</p>
          <p className="text-zinc-400 text-sm mb-6">{errorMessage}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2.5 bg-zoom-blue text-white rounded-xl text-sm font-medium
                       hover:bg-zoom-blue-dark transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // ── Pantalla: terminada ───────────────────────────────────────────────────
  if (appState === 'ended') {
    return (
      <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl font-semibold mb-2">You left the meeting</p>
          <p className="text-zinc-400 text-sm">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  // ── Pantalla: ingresar nombre ─────────────────────────────────────────────
  if (appState === 'enter_name') {
    return (
      <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center p-4">
        <div className="bg-zinc-900 rounded-2xl p-8 w-full max-w-sm border border-zinc-800 shadow-2xl">
          <h2 className="text-white text-xl font-bold mb-2">Join Meeting</h2>
          <p className="text-zinc-400 text-sm mb-6">
            Enter your name to join the session.
          </p>

          {mediaError && (
            <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded-xl">
              <p className="text-yellow-300 text-xs">{mediaError} — you can still join without media.</p>
            </div>
          )}

          <input
            id="input-username"
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            placeholder="Your display name"
            autoFocus
            className="w-full px-4 py-3 bg-zinc-800 text-white placeholder:text-zinc-500
                       rounded-xl border border-zinc-700 focus:outline-none focus:border-zoom-blue
                       focus:ring-1 focus:ring-zoom-blue/40 transition-all duration-150 mb-4"
          />

          {!isMediaReady && !mediaError && (
            <p className="text-xs text-zinc-500 mb-4 flex items-center gap-2">
              <Loader2 size={12} className="animate-spin" />
              Requesting camera/microphone access...
            </p>
          )}

          <button
            id="btn-join-room"
            onClick={handleJoin}
            disabled={!inputName.trim()}
            className="w-full py-3 bg-zoom-blue hover:bg-zoom-blue-dark text-white font-semibold 
                       rounded-xl transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Join Meeting
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full py-2 mt-2 text-zinc-500 hover:text-zinc-300 text-sm 
                       transition-colors duration-150"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // ── Sala de reunión principal ─────────────────────────────────────────────
  const participantCount = 1 + remoteStreams.length;

  return (
    <div className="fixed inset-0 bg-zinc-950 flex flex-col">
      {/* Header de la sala */}
      <div className="flex items-center justify-between px-6 py-3 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-zoom-blue flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="white" width="14" height="14">
              <path d="M4 6C4 4.9 4.9 4 6 4h8c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V6zm12 1.5l4-2.5v10l-4-2.5V7.5z" />
            </svg>
          </div>
          <span className="text-white font-semibold text-sm">zeus</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400 text-sm font-mono">{meetingId.slice(0, 8)}...</span>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full
            ${isConnected ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse-soft`} />
            {isConnected ? 'Connected' : 'Reconnecting...'}
          </div>
          <span className="text-zinc-400 text-sm">{username}</span>
        </div>
      </div>

      {/* Área principal: video grid + chat */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video grid */}
        <div className="flex-1 p-4 flex flex-wrap gap-3 content-start overflow-y-auto items-center justify-center">
          {/* Tile local */}
          <ParticipantTile
            videoRef={localVideoRef}
            username={username}
            isMuted={isMuted}
            isVideoOff={isVideoOff}
            isLocal={true}
          />

          {/* Tiles remotos */}
          {remoteStreams.map((remote) => (
              <RemoteTile
                key={remote.userId}
                stream={remote.stream}
                username={remote.username}
              />
          ))}
        </div>

        {/* Panel de chat */}
        {isChatOpen && (
          <ChatPanel
            messages={messages}
            currentUser={username}
            onSend={sendMessage}
            onClose={() => setIsChatOpen(false)}
          />
        )}
      </div>

      {/* Barra de controles */}
      <ControlBar
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        isChatOpen={isChatOpen}
        participantCount={participantCount}
        meetingId={meetingId}
        onToggleMute={toggleMute}
        onToggleVideo={toggleVideo}
        onToggleChat={() => setIsChatOpen((v) => !v)}
        onLeave={handleLeave}
      />
    </div>
  );
}

/**
 * Componente auxiliar para renderizar el video de un participante remoto.
 * Necesita montar el stream en el elemento video usando una ref.
 */
function RemoteTile({ stream, username }: { stream: MediaStream; username: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <ParticipantTile
      videoRef={videoRef}
      username={username}
      isLocal={false}
    />
  );
}
