/**
 * Funciones utilitarias para formateo de fechas, UUIDs y clases CSS.
 */
import { clsx, type ClassValue } from 'clsx';
import { format, formatDistanceToNow, isPast, isToday } from 'date-fns';

/** Combina clases CSS de forma condicional (helper para Tailwind). */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/** Genera un UUID v4 en el navegador usando la API crypto nativa. */
export function generateUUID(): string {
  return crypto.randomUUID();
}

/** Formatea una fecha ISO en "MMM dd, yyyy" → "May 23, 2026" */
export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), 'MMM dd, yyyy');
}

/** Formatea una fecha ISO en "h:mm a" → "2:30 PM" */
export function formatTime(dateStr: string): string {
  return format(new Date(dateStr), 'h:mm a');
}

/** Devuelve la hora y fecha juntas → "2:30 PM · May 23" */
export function formatDateTime(dateStr: string): string {
  return format(new Date(dateStr), "h:mm a · MMM d");
}

/** Devuelve tiempo relativo → "in 2 hours", "3 days ago" */
export function formatRelative(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
}

/** Devuelve true si la fecha es hoy */
export function isDateToday(dateStr: string): boolean {
  return isToday(new Date(dateStr));
}

/** Devuelve true si la fecha ya pasó */
export function isDatePast(dateStr: string): boolean {
  return isPast(new Date(dateStr));
}

/** Construye el enlace de invitación a partir del meeting ID */
export function buildInviteLink(meetingId: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return `${base}/meeting/${meetingId}`;
}

/** Formatea duración en minutos → "1h 30m" o "45m" */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}
