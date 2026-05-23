'use client';

/**
 * Barra de controles inferior de la sala de reuniones estilo Zoom.
 * Contiene: micrófono, cámara, participantes, chat y botón de salir.
 */
import {
  Mic, MicOff, Video, VideoOff,
  Users, MessageSquare, MoreHorizontal, Phone,
  Share2, Smile,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ControlBarProps {
  isMuted: boolean;
  isVideoOff: boolean;
  isChatOpen: boolean;
  participantCount: number;
  meetingId: string;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleChat: () => void;
  onLeave: () => void;
}

interface ControlButtonProps {
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  label: string;
  isActive?: boolean;
  isRed?: boolean;
  onClick: () => void;
  id?: string;
}

function ControlButton({
  icon, activeIcon, label, isActive, isRed, onClick, id
}: ControlButtonProps) {
  return (
    <button
      id={id}
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-1 px-3 py-2 rounded-xl',
        'transition-all duration-150 min-w-[64px]',
        'hover:bg-zinc-700 active:bg-zinc-600',
        isActive && !isRed && 'bg-zinc-700',
      )}
    >
      <div className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
        isRed && isActive ? 'bg-red-500 text-white' :
        isActive ? 'bg-zinc-600 text-white' : 'text-zinc-200'
      )}>
        {isActive && activeIcon ? activeIcon : icon}
      </div>
      <span className="text-xs text-zinc-400 font-medium whitespace-nowrap">{label}</span>
    </button>
  );
}

export default function ControlBar({
  isMuted,
  isVideoOff,
  isChatOpen,
  participantCount,
  meetingId,
  onToggleMute,
  onToggleVideo,
  onToggleChat,
  onLeave,
}: ControlBarProps) {
  return (
    <div className="bg-zinc-900 border-t border-zinc-800 px-6 py-3">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {/* Información de la reunión */}
        <div className="hidden md:flex flex-col">
          <span className="text-zinc-400 text-xs">Meeting ID</span>
          <span className="text-zinc-200 text-sm font-mono font-medium">
            {meetingId.split('-')[0]}...
          </span>
        </div>

        {/* Controles centrales */}
        <div className="flex items-center gap-1">
          <ControlButton
            id="btn-mute"
            icon={<Mic size={20} />}
            activeIcon={<MicOff size={20} />}
            label={isMuted ? 'Unmute' : 'Mute'}
            isActive={isMuted}
            isRed={isMuted}
            onClick={onToggleMute}
          />
          <ControlButton
            id="btn-video"
            icon={<Video size={20} />}
            activeIcon={<VideoOff size={20} />}
            label={isVideoOff ? 'Start Video' : 'Stop Video'}
            isActive={isVideoOff}
            isRed={isVideoOff}
            onClick={onToggleVideo}
          />
          <div className="w-px h-10 bg-zinc-700 mx-1" />
          <ControlButton
            id="btn-share"
            icon={<Share2 size={20} />}
            label="Share"
            onClick={() => {}}
          />
          <ControlButton
            id="btn-chat"
            icon={<MessageSquare size={20} />}
            label="Chat"
            isActive={isChatOpen}
            onClick={onToggleChat}
          />
          <ControlButton
            id="btn-participants"
            icon={<Users size={20} />}
            label={`${participantCount}`}
            onClick={() => {}}
          />
          <ControlButton
            id="btn-reactions"
            icon={<Smile size={20} />}
            label="Reactions"
            onClick={() => {}}
          />
          <ControlButton
            id="btn-more"
            icon={<MoreHorizontal size={20} />}
            label="More"
            onClick={() => {}}
          />
        </div>

        {/* Botón de salir */}
        <button
          id="btn-leave"
          onClick={onLeave}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 
                     active:bg-red-700 text-white rounded-xl font-medium text-sm 
                     transition-all duration-150 shadow-lg shadow-red-900/30"
        >
          <Phone size={16} className="rotate-[135deg]" />
          <span className="hidden sm:inline">Leave</span>
        </button>
      </div>
    </div>
  );
}
