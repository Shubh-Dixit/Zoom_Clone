'use client';

/**
 * Página de listado de todas las reuniones.
 * Muestra tabs para: Upcoming y Recent.
 */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Video, Clock } from 'lucide-react';
import { UpcomingMeetingCard, RecentMeetingCard } from '@/components/dashboard/MeetingCard';
import { getUpcomingMeetings, getRecentMeetings, deleteScheduledMeeting } from '@/lib/api';
import type { Meeting, ScheduledMeeting } from '@/types';

type Tab = 'upcoming' | 'recent';

export default function MeetingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');
  const [upcoming, setUpcoming] = useState<ScheduledMeeting[]>([]);
  const [recent, setRecent] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [u, r] = await Promise.all([getUpcomingMeetings(), getRecentMeetings(20)]);
        setUpcoming(u);
        setRecent(r);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteScheduledMeeting(id);
    setUpcoming((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
        <p className="text-gray-500 text-sm mt-1">View your upcoming and past meetings.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {(['upcoming', 'recent'] as Tab[]).map((tab) => (
          <button
            key={tab}
            id={`tab-${tab}`}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-150
              ${activeTab === tab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {tab === 'upcoming' ? (
              <span className="flex items-center gap-2">
                <Calendar size={14} /> Upcoming
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Clock size={14} /> Recent
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Contenido del tab */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : activeTab === 'upcoming' ? (
        upcoming.length > 0 ? (
          <div className="flex flex-col gap-3">
            {upcoming.map((m) => (
              <UpcomingMeetingCard
                key={m.id}
                meeting={m}
                onDelete={handleDelete}
                onStart={(meetingId) => router.push(`/meeting/${meetingId}`)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <Calendar size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="font-medium text-gray-900 mb-1">No upcoming meetings</p>
            <p className="text-gray-500 text-sm mb-4">Schedule a meeting to see it here.</p>
            <button
              onClick={() => router.push('/schedule')}
              className="text-sm text-zoom-blue hover:underline font-medium"
            >
              Schedule a Meeting →
            </button>
          </div>
        )
      ) : (
        recent.length > 0 ? (
          <div className="flex flex-col gap-3">
            {recent.map((m) => (
              <RecentMeetingCard key={m.id} meeting={m} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <Video size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="font-medium text-gray-900 mb-1">No recent meetings</p>
            <p className="text-gray-500 text-sm">Your meeting history will appear here.</p>
          </div>
        )
      )}
    </div>
  );
}
