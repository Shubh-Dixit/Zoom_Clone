'use client';

/**
 * Página principal del dashboard (Homepage).
 * Muestra las acciones principales, reuniones próximas y recientes.
 * Coordina los modales de Nueva Reunión y Unirse a Reunión.
 */
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Video, Plus, Calendar, BookOpen } from 'lucide-react';
import ActionCard from '@/components/dashboard/ActionCard';
import ClockWidget from '@/components/dashboard/ClockWidget';
import { UpcomingMeetingCard, RecentMeetingCard } from '@/components/dashboard/MeetingCard';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import {
  createMeeting,
  getMeeting,
  getRecentMeetings,
  getUpcomingMeetings,
  deleteScheduledMeeting,
} from '@/lib/api';
import type { Meeting, ScheduledMeeting } from '@/types';

type ActiveModal = 'newMeeting' | 'joinMeeting' | null;

export default function DashboardPage() {
  const router = useRouter();

  // Estado de la UI
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  // Datos del formulario
  const [hostName, setHostName] = useState('');
  const [newMeeting, setNewMeeting] = useState<Meeting | null>(null);
  const [joinId, setJoinId] = useState('');
  const [joinError, setJoinError] = useState('');

  // Datos de las listas
  const [upcomingMeetings, setUpcomingMeetings] = useState<ScheduledMeeting[]>([]);
  const [recentMeetings, setRecentMeetings] = useState<Meeting[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Cargar datos al montar
  const loadData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const [upcoming, recent] = await Promise.all([
        getUpcomingMeetings(),
        getRecentMeetings(5),
      ]);
      setUpcomingMeetings(upcoming);
      setRecentMeetings(recent);
    } catch {
      // Datos no disponibles — mostrar listas vacías
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Acciones ─────────────────────────────────────────────────────────────

  const handleCreateMeeting = async () => {
    if (!hostName.trim()) return;
    setIsCreating(true);
    try {
      const meeting = await createMeeting({ host_name: hostName.trim() });
      setNewMeeting(meeting);
    } catch {
      alert('Failed to create meeting. Is the backend running?');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinNewMeeting = () => {
    if (!newMeeting) return;
    router.push(`/meeting/${newMeeting.id}`);
  };

  const handleJoinById = async () => {
    const id = joinId.trim();
    if (!id) { setJoinError('Please enter a meeting ID'); return; }

    setIsJoining(true);
    setJoinError('');
    try {
      await getMeeting(id);
      router.push(`/meeting/${id}`);
    } catch {
      setJoinError('Meeting not found. Please check the ID and try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleDeleteScheduled = async (id: number) => {
    await deleteScheduledMeeting(id);
    setUpcomingMeetings((prev) => prev.filter((m) => m.id !== id));
  };

  const closeModal = () => {
    setActiveModal(null);
    setNewMeeting(null);
    setHostName('');
    setJoinId('');
    setJoinError('');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto animate-fade-in">
      {/* Grid de acciones principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Columna izquierda: acciones */}
        <div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <ActionCard
              id="btn-new-meeting"
              icon={<Video size={22} />}
              label="New Meeting"
              description="Start an instant meeting"
              color="orange"
              onClick={() => setActiveModal('newMeeting')}
            />
            <ActionCard
              id="btn-join-meeting"
              icon={<Plus size={22} />}
              label="Join"
              description="Join via Meeting ID"
              color="blue"
              onClick={() => setActiveModal('joinMeeting')}
            />
            <ActionCard
              id="btn-schedule-meeting"
              icon={<Calendar size={22} />}
              label="Schedule"
              description="Plan a future meeting"
              color="purple"
              onClick={() => router.push('/schedule')}
            />
            <ActionCard
              id="btn-view-meetings"
              icon={<BookOpen size={22} />}
              label="Meetings"
              description="View all meetings"
              color="green"
              onClick={() => router.push('/meetings')}
            />
          </div>
        </div>

        {/* Columna derecha: reloj + próximas reuniones */}
        <div className="flex flex-col gap-3">
          <ClockWidget />
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500">
              {upcomingMeetings.length > 0
                ? `You have ${upcomingMeetings.length} upcoming meeting${upcomingMeetings.length > 1 ? 's' : ''} today`
                : 'No upcoming meetings today'}
            </p>
          </div>
        </div>
      </div>

      {/* Reuniones Próximas */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Upcoming Meetings</h2>
        {isLoadingData ? (
          <div className="flex flex-col gap-3">
            {[1, 2].map((i) => (
              <div key={i} className="skeleton h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : upcomingMeetings.length > 0 ? (
          <div className="flex flex-col gap-3">
            {upcomingMeetings.map((m) => (
              <UpcomingMeetingCard
                key={m.id}
                meeting={m}
                onDelete={handleDeleteScheduled}
                onStart={(meetingId) => router.push(`/meeting/${meetingId}`)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
            <Calendar size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No upcoming meetings scheduled.</p>
            <button
              onClick={() => router.push('/schedule')}
              className="mt-3 text-sm text-zoom-blue hover:underline font-medium"
            >
              Schedule one now →
            </button>
          </div>
        )}
      </section>

      {/* Reuniones Recientes */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent Meetings</h2>
        {isLoadingData ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : recentMeetings.length > 0 ? (
          <div className="flex flex-col gap-3">
            {recentMeetings.map((m) => (
              <RecentMeetingCard key={m.id} meeting={m} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
            <Video size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No recent meetings yet.</p>
          </div>
        )}
      </section>

      {/* ── Modal: Nueva Reunión ──────────────────────────────────────────── */}
      <Modal
        isOpen={activeModal === 'newMeeting'}
        onClose={closeModal}
        title="Start an Instant Meeting"
        size="md"
      >
        {!newMeeting ? (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Your Name
              </label>
              <input
                id="input-host-name"
                type="text"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateMeeting()}
                placeholder="Enter your display name"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-zoom-blue/30 focus:border-zoom-blue
                           transition-all duration-150 placeholder:text-gray-400"
                autoFocus
              />
            </div>
            <Button
              id="btn-create-meeting"
              onClick={handleCreateMeeting}
              isLoading={isCreating}
              disabled={!hostName.trim()}
              size="lg"
              className="w-full"
            >
              Create Meeting
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Éxito: mostrar ID y enlace */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <p className="text-xs font-medium text-blue-600 mb-1">Meeting ID</p>
              <p className="font-mono text-sm text-gray-900 break-all">{newMeeting.id}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs font-medium text-gray-500 mb-1">Invite Link</p>
              <p className="text-sm text-gray-700 break-all">{newMeeting.invite_link}</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => navigator.clipboard.writeText(newMeeting.invite_link)}
                className="flex-1"
              >
                Copy Invite Link
              </Button>
              <Button
                id="btn-join-new-meeting"
                onClick={handleJoinNewMeeting}
                className="flex-1"
              >
                Start Meeting
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Modal: Unirse a Reunión ───────────────────────────────────────── */}
      <Modal
        isOpen={activeModal === 'joinMeeting'}
        onClose={closeModal}
        title="Join a Meeting"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Meeting ID or Link
            </label>
            <input
              id="input-join-id"
              type="text"
              value={joinId}
              onChange={(e) => { setJoinId(e.target.value); setJoinError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleJoinById()}
              placeholder="Enter Meeting ID"
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-zoom-blue/30 focus:border-zoom-blue
                         transition-all duration-150 placeholder:text-gray-400"
              autoFocus
            />
            {joinError && (
              <p className="mt-1.5 text-xs text-red-500">{joinError}</p>
            )}
          </div>
          <Button
            id="btn-join-submit"
            onClick={handleJoinById}
            isLoading={isJoining}
            disabled={!joinId.trim()}
            size="lg"
            className="w-full"
          >
            Join Meeting
          </Button>
        </div>
      </Modal>
    </div>
  );
}
