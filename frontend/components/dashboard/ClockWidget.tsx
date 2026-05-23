'use client';

/**
 * Widget de reloj en tiempo real para el dashboard.
 * Muestra hora y fecha actual actualizándose cada segundo.
 */
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function ClockWidget() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Inicializar en el cliente para evitar hydration mismatch
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!now) {
    return (
      <div className="h-40 rounded-2xl bg-gradient-to-br from-zoom-blue to-blue-700 
                      flex flex-col items-center justify-center">
        <div className="skeleton w-32 h-8 mb-2" />
        <div className="skeleton w-40 h-4" />
      </div>
    );
  }

  return (
    <div className="h-40 rounded-2xl bg-gradient-to-br from-zoom-blue via-blue-600 to-blue-800 
                    flex flex-col items-center justify-center text-white shadow-lg shadow-blue-200
                    relative overflow-hidden">
      {/* Círculos decorativos de fondo */}
      <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10" />
      <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-white/5" />

      <p className="text-4xl font-bold tracking-tight relative z-10">
        {format(now, 'h:mm')}
        <span className="text-2xl font-normal ml-1 opacity-80">
          {format(now, 'a')}
        </span>
      </p>
      <p className="text-sm font-medium opacity-80 mt-1 relative z-10">
        {format(now, 'EEEE, MMMM d, yyyy')}
      </p>
    </div>
  );
}
