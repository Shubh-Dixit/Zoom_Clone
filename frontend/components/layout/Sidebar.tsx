'use client';

/**
 * Barra lateral de navegación estilo Zoom.
 * Muestra los iconos y etiquetas de las secciones principales.
 */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Clock,
  Video,
  Calendar,
  MessageSquare,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/meetings', icon: Clock, label: 'Meetings' },
  { href: '/contacts', icon: Users, label: 'Contacts' },
  { href: '/chat', icon: MessageSquare, label: 'Chat' },
  { href: '/whiteboard', icon: Video, label: 'Whiteboard' },
  { href: '/schedule', icon: Calendar, label: 'Schedule' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-[56px] bottom-0 w-[220px] bg-white border-r border-gray-200 flex flex-col z-10">
      <nav className="flex-1 py-3">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all duration-150',
                'hover:bg-blue-50 hover:text-zoom-blue group',
                isActive
                  ? 'text-zoom-blue bg-blue-50 border-r-2 border-zoom-blue'
                  : 'text-gray-600'
              )}
            >
              <Icon
                size={20}
                className={cn(
                  'transition-colors duration-150',
                  isActive ? 'text-zoom-blue' : 'text-gray-400 group-hover:text-zoom-blue'
                )}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Versión en la parte inferior */}
      <div className="px-5 py-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">ZoomCall v2.0</p>
      </div>
    </aside>
  );
}
