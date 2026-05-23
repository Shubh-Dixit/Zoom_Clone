/**
 * Interfaces TypeScript compartidas entre todos los componentes.
 * Espejo de los schemas Pydantic del backend.
 */

export interface Meeting {
  id: string;
  title: string;
  host_name: string;
  invite_link: string;
  is_active: boolean;
  started_at: string;
  ended_at: string | null;
  created_at: string;
}

export interface ScheduledMeeting {
  id: number;
  title: string;
  description: string | null;
  host_name: string;
  meeting_id: string;
  scheduled_at: string;
  duration_min: number;
  is_recurring: boolean;
  created_at: string;
}

export interface Participant {
  id: number;
  meeting_id: string;
  username: string;
  peer_id: string;
  joined_at: string;
  left_at: string | null;
}

export interface MeetingCreatePayload {
  host_name: string;
  title?: string;
}

export interface ScheduledMeetingCreatePayload {
  title: string;
  description?: string;
  host_name: string;
  scheduled_at: string;
  duration_min: number;
  is_recurring: boolean;
}

export interface SocketUser {
  username: string;
  meetingID: string;
  userID: string;
}

export interface ChatMessage {
  user: string;
  content: string;
  meetingID: string;
}
