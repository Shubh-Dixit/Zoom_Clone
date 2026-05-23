'use client';

/**
 * Tarjeta de acción principal del dashboard (New Meeting, Join, Schedule, Record).
 * Cada tarjeta tiene un color, icono y acción onClick personalizados.
 */
import { cn } from '@/lib/utils';

interface ActionCardProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  color: 'orange' | 'blue' | 'purple' | 'green';
  onClick: () => void;
  id: string;
}

const COLOR_MAP = {
  orange: {
    bg: 'bg-orange-500',
    hover: 'hover:bg-orange-600',
    shadow: 'shadow-orange-200',
    text: 'text-orange-600',
    lightBg: 'bg-orange-50',
  },
  blue: {
    bg: 'bg-zoom-blue',
    hover: 'hover:bg-zoom-blue-dark',
    shadow: 'shadow-blue-200',
    text: 'text-zoom-blue',
    lightBg: 'bg-blue-50',
  },
  purple: {
    bg: 'bg-purple-600',
    hover: 'hover:bg-purple-700',
    shadow: 'shadow-purple-200',
    text: 'text-purple-600',
    lightBg: 'bg-purple-50',
  },
  green: {
    bg: 'bg-emerald-600',
    hover: 'hover:bg-emerald-700',
    shadow: 'shadow-emerald-200',
    text: 'text-emerald-600',
    lightBg: 'bg-emerald-50',
  },
};

export default function ActionCard({
  icon,
  label,
  description,
  color,
  onClick,
  id,
}: ActionCardProps) {
  const colors = COLOR_MAP[color];

  return (
    <button
      id={id}
      onClick={onClick}
      className={cn(
        'flex flex-col items-start gap-3 p-5 rounded-2xl bg-white',
        'border border-gray-100 text-left w-full',
        'shadow-sm hover:shadow-md transition-all duration-200',
        'hover:-translate-y-0.5 active:translate-y-0',
        'group'
      )}
    >
      {/* Ícono con fondo de color */}
      <div
        className={cn(
          'w-12 h-12 rounded-2xl flex items-center justify-center text-white',
          'transition-all duration-200',
          colors.bg,
          colors.hover,
          'shadow-lg',
          colors.shadow
        )}
      >
        {icon}
      </div>

      {/* Texto */}
      <div>
        <p className="font-semibold text-gray-900 text-sm leading-tight">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5 leading-snug">{description}</p>
      </div>
    </button>
  );
}
