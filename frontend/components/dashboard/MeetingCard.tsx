'use client';

/**
 * Tarjeta de reunión para las secciones Upcoming y Recent.
 * Muestra título, host, hora, duración y acciones contextuales.
 */
import { Calendar, Clock, Trash2, Video, ExternalLink, Repeat } from 'lucide-react';
import { formatDateTime, formatDuration, formatRelative } from '@/lib/utils';
import type { ScheduledMeeting, Meeting } from '@/types';
import { cn } from '@/lib/utils';

// ── Upcoming Meeting Card ────────────────────────────────────────────────────

interface UpcomingCardProps {
  meeting: ScheduledMeeting;
  onDelete?: (id: number) => void;
  onStart?: (meetingId: string) => void;
}

export function UpcomingMeetingCard({ meeting, onDelete, onStart }: UpcomingCardProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl 
                    border border-gray-100 shadow-sm hover:shadow-md 
                    transition-all duration-200 animate-fade-in group">
      <div className="flex items-center gap-4">
        {/* Indicador de fecha */}
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex flex-col items-center 
                        justify-center flex-shrink-0">
          <Calendar size={20} className="text-zoom-blue" />
        </div>

        {/* Detalles */}
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-900 text-sm">{meeting.title}</p>
            {meeting.is_recurring && (
              <Repeat size={12} className="text-zoom-blue" />
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {formatDateTime(meeting.scheduled_at)} · {formatDuration(meeting.duration_min)}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Host: {meeting.host_name}</p>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button
          onClick={() => onStart?.(meeting.meeting_id)}
          className="px-3 py-1.5 text-xs font-medium text-zoom-blue bg-blue-50 
                     rounded-lg hover:bg-zoom-blue hover:text-white transition-colors duration-150"
        >
          Start
        </button>
        <button
          onClick={() => onDelete?.(meeting.id)}
          className="p-1.5 text-gray-400 rounded-lg hover:bg-red-50 hover:text-red-500 
                     transition-colors duration-150"
          aria-label="Delete meeting"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

// ── Recent Meeting Card ──────────────────────────────────────────────────────

interface RecentCardProps {
  meeting: Meeting;
}

export function RecentMeetingCard({ meeting }: RecentCardProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl 
                    border border-gray-100 shadow-sm hover:shadow-md 
                    transition-all duration-200 animate-fade-in group">
      <div className="flex items-center gap-4">
        {/* Indicador de estado */}
        <div className={cn(
          'w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0',
          meeting.is_active ? 'bg-green-50' : 'bg-gray-50'
        )}>
          <Video size={20} className={meeting.is_active ? 'text-green-600' : 'text-gray-400'} />
        </div>

        {/* Detalles */}
        <div>
          <p className="font-semibold text-gray-900 text-sm">{meeting.title}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {formatRelative(meeting.created_at)} · Host: {meeting.host_name}
          </p>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            {meeting.id.split('-')[0]}...
          </p>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button
          onClick={() => navigator.clipboard.writeText(meeting.invite_link)}
          className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 
                     rounded-lg hover:bg-gray-100 transition-colors duration-150 flex items-center gap-1"
        >
          <ExternalLink size={12} />
          Copy link
        </button>
      </div>
    </div>
  );
}
