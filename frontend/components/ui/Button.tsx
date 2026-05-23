'use client';

/**
 * Botón reutilizable con variantes de estilo y estados de carga.
 */
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
}

const VARIANT_CLASSES = {
  primary:
    'bg-zoom-blue text-white hover:bg-zoom-blue-dark active:bg-zoom-blue-dark shadow-sm',
  secondary:
    'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-200',
  danger:
    'bg-red-500 text-white hover:bg-red-600 active:bg-red-600',
  ghost:
    'bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-100',
};

const SIZE_CLASSES = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium',
        'transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
        'focus:outline-none focus:ring-2 focus:ring-zoom-blue/30',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
    </button>
  );
}
