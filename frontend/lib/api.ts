/**
 * Cliente HTTP para comunicarse con el backend FastAPI.
 * Centraliza la URL base y el manejo de errores.
 */
import axios from 'axios';
import type {
  Meeting,
  MeetingCreatePayload,
  ScheduledMeeting,
  ScheduledMeetingCreatePayload,
} from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// ── Meetings ─────────────────────────────────────────────────────────────────

export async function createMeeting(payload: MeetingCreatePayload): Promise<Meeting> {
  const { data } = await client.post<Meeting>('/api/meetings', payload);
  return data;
}

export async function getMeeting(meetingId: string): Promise<Meeting> {
  const { data } = await client.get<Meeting>(`/api/meetings/${meetingId}`);
  return data;
}

export async function getRecentMeetings(limit = 10): Promise<Meeting[]> {
  const { data } = await client.get<Meeting[]>('/api/meetings', {
    params: { limit },
  });
  return data;
}

export async function endMeeting(meetingId: string): Promise<Meeting> {
  const { data } = await client.patch<Meeting>(`/api/meetings/${meetingId}/end`);
  return data;
}

// ── Scheduled Meetings ────────────────────────────────────────────────────────

export async function scheduleMeeting(
  payload: ScheduledMeetingCreatePayload
): Promise<ScheduledMeeting> {
  const { data } = await client.post<ScheduledMeeting>('/api/scheduled', payload);
  return data;
}

export async function getUpcomingMeetings(): Promise<ScheduledMeeting[]> {
  const { data } = await client.get<ScheduledMeeting[]>('/api/scheduled/upcoming');
  return data;
}

export async function deleteScheduledMeeting(id: number): Promise<void> {
  await client.delete(`/api/scheduled/${id}`);
}
