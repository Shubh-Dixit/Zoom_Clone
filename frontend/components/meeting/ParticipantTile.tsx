'use client';

/**
 * Tile individual de participante en la sala de reuniones.
 * Muestra el video o un avatar con las iniciales cuando la cámara está apagada.
 */
import { MicOff } from 'lucide-react';

interface ParticipantTileProps {
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  username: string;
  isMuted?: boolean;
  isVideoOff?: boolean;
  isLocal?: boolean;
}

export default function ParticipantTile({
  videoRef,
  username,
  isMuted = false,
  isVideoOff = false,
  isLocal = false,
}: ParticipantTileProps) {
  // Extraer iniciales del nombre de usuario
  const initials = username
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="relative bg-zinc-800 rounded-xl overflow-hidden aspect-video 
                    min-w-[240px] flex-1 max-w-[400px] border border-zinc-700
                    transition-all duration-200">
      {/* Video stream */}
      {!isVideoOff && videoRef ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="w-full h-full object-cover"
        />
      ) : (
        // Avatar cuando no hay video
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-zinc-600 flex items-center justify-center">
            <span className="text-white text-2xl font-semibold">{initials}</span>
          </div>
        </div>
      )}

      {/* Overlay con nombre de usuario */}
      <div className="absolute bottom-0 left-0 right-0 px-3 py-2 
                      bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex items-center justify-between">
          <span className="text-white text-xs font-medium truncate">
            {username} {isLocal && '(You)'}
          </span>
          {isMuted && (
            <MicOff size={12} className="text-red-400 flex-shrink-0 ml-2" />
          )}
        </div>
      </div>

      {/* Indicador en vivo */}
      {isLocal && (
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-500 rounded text-white 
                        text-xs font-medium flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-soft" />
          LIVE
        </div>
      )}
    </div>
  );
}
