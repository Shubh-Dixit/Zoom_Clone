'use client';

/**
 * Página para programar una reunión futura.
 * Formulario con título, descripción, fecha/hora, duración y host.
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, User, AlignLeft, Repeat } from 'lucide-react';
import Button from '@/components/ui/Button';
import { scheduleMeeting } from '@/lib/api';

export default function SchedulePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    description: '',
    host_name: '',
    date: '',
    time: '',
    duration_min: 60,
    is_recurring: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.host_name || !form.date || !form.time) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      // Combinar fecha y hora en un ISO string
      const scheduled_at = new Date(`${form.date}T${form.time}:00`).toISOString();
      await scheduleMeeting({
        title: form.title,
        description: form.description || undefined,
        host_name: form.host_name,
        scheduled_at,
        duration_min: Number(form.duration_min),
        is_recurring: form.is_recurring,
      });
      setSuccess(true);
    } catch {
      setError('Failed to schedule meeting. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="p-6 max-w-lg mx-auto mt-12 text-center animate-fade-in">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar size={36} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Meeting Scheduled!</h2>
        <p className="text-gray-500 text-sm mb-6">
          <strong>{form.title}</strong> has been added to your calendar.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={() => { setSuccess(false); setForm({ title: '', description: '', host_name: '', date: '', time: '', duration_min: 60, is_recurring: false }); }}>
            Schedule Another
          </Button>
          <Button onClick={() => router.push('/')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Schedule a Meeting</h1>
        <p className="text-gray-500 text-sm mt-1">
          Plan your meeting in advance and share the link with participants.
        </p>
      </div>

      <form
        id="form-schedule-meeting"
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5"
      >
        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Meeting Title <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="input-title"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Weekly Standup"
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-zoom-blue/30 focus:border-zoom-blue
                         transition-all duration-150 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Description <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <AlignLeft size={16} className="absolute left-3 top-3 text-gray-400" />
            <textarea
              id="input-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="What is this meeting about?"
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-zoom-blue/30 focus:border-zoom-blue
                         transition-all duration-150 placeholder:text-gray-400 resize-none"
            />
          </div>
        </div>

        {/* Nombre del host */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Your Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="input-host-name"
              type="text"
              name="host_name"
              value={form.host_name}
              onChange={handleChange}
              placeholder="Alex Johnson"
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-zoom-blue/30 focus:border-zoom-blue
                         transition-all duration-150 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Fecha y Hora */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              id="input-date"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-zoom-blue/30 focus:border-zoom-blue
                         transition-all duration-150"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Time <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="input-time"
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-zoom-blue/30 focus:border-zoom-blue
                           transition-all duration-150"
              />
            </div>
          </div>
        </div>

        {/* Duración */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration</label>
          <select
            id="input-duration"
            name="duration_min"
            value={form.duration_min}
            onChange={handleChange}
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl
                       focus:outline-none focus:ring-2 focus:ring-zoom-blue/30 focus:border-zoom-blue
                       transition-all duration-150 bg-white"
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>1 hour</option>
            <option value={90}>1.5 hours</option>
            <option value={120}>2 hours</option>
            <option value={180}>3 hours</option>
          </select>
        </div>

        {/* Recurrente */}
        <div className="flex items-center gap-3">
          <input
            id="input-recurring"
            type="checkbox"
            name="is_recurring"
            checked={form.is_recurring}
            onChange={handleChange}
            className="w-4 h-4 rounded text-zoom-blue focus:ring-zoom-blue/30"
          />
          <label htmlFor="input-recurring" className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <Repeat size={15} className="text-gray-400" />
            Recurring meeting (weekly)
          </label>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>
        )}

        {/* Submit */}
        <Button
          id="btn-submit-schedule"
          type="submit"
          isLoading={isSubmitting}
          size="lg"
          className="w-full"
        >
          Schedule Meeting
        </Button>
      </form>
    </div>
  );
}
