'use client';

/**
 * Barra de navegación superior estilo Zoom.
 * Contiene el logo, búsqueda y el avatar del usuario.
 */
import { Search, Settings, Bell, ChevronDown } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center px-4 z-20">
      {/* Logo */}
      <div className="flex items-center gap-2 w-[220px]">
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-md bg-zoom-blue flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
              <path d="M4 6C4 4.9 4.9 4 6 4h8c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V6zm12 1.5l4-2.5v10l-4-2.5V7.5z" />
            </svg>
          </div>
          <span className="font-bold text-lg text-gray-900 tracking-tight">zeus</span>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="flex-1 max-w-md mx-auto">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-gray-100 rounded-lg border-0 
                       focus:outline-none focus:ring-2 focus:ring-zoom-blue/30 focus:bg-white
                       transition-all duration-200 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2 ml-auto">
        <button
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 
                     transition-colors duration-150"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>
        <button
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 
                     transition-colors duration-150"
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>

        {/* Avatar del usuario */}
        <button className="flex items-center gap-2 ml-1 pl-2 pr-3 py-1.5 rounded-lg 
                           hover:bg-gray-100 transition-colors duration-150 group">
          <div className="w-8 h-8 rounded-full bg-zoom-blue flex items-center justify-center 
                          text-white text-sm font-semibold">
            Z
          </div>
          <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600" />
        </button>
      </div>
    </header>
  );
}
