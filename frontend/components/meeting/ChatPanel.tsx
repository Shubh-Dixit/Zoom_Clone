'use client';

/**
 * Panel de chat lateral de la sala de reuniones.
 * Muestra los mensajes y permite enviar nuevos usando Enter.
 */
import { useState, useRef, useEffect } from 'react';
import { Send, X } from 'lucide-react';
import type { ChatMessage } from '@/types';

interface ChatPanelProps {
  messages: ChatMessage[];
  currentUser: string;
  onSend: (text: string) => void;
  onClose: () => void;
}

export default function ChatPanel({ messages, currentUser, onSend, onClose }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    onSend(text);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-72 bg-zinc-900 border-l border-zinc-800 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <h3 className="text-white font-semibold text-sm">In-Meeting Chat</h3>
        <button
          onClick={onClose}
          className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 
                     transition-colors duration-150"
        >
          <X size={16} />
        </button>
      </div>

      {/* Lista de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.length === 0 && (
          <p className="text-zinc-500 text-xs text-center mt-4">
            No messages yet. Say hi!
          </p>
        )}
        {messages.map((msg, idx) => {
          const isOwn = msg.user === currentUser;
          return (
            <div
              key={idx}
              className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}
            >
              {!isOwn && (
                <span className="text-xs text-zinc-400 mb-1">
                  {msg.user} → Everyone
                </span>
              )}
              <div
                className={`max-w-[90%] px-3 py-2 rounded-2xl text-sm leading-snug
                  ${isOwn
                    ? 'bg-zoom-blue text-white rounded-br-sm'
                    : 'bg-zinc-800 text-zinc-100 rounded-bl-sm'
                  }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de mensaje */}
      <div className="px-3 py-3 border-t border-zinc-800">
        <div className="flex items-end gap-2 bg-zinc-800 rounded-xl px-3 py-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message..."
            rows={1}
            className="flex-1 bg-transparent text-zinc-100 text-sm resize-none 
                       placeholder:text-zinc-500 focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-1.5 rounded-lg bg-zoom-blue text-white disabled:opacity-40 
                       disabled:cursor-not-allowed hover:bg-zoom-blue-dark 
                       transition-colors duration-150 flex-shrink-0"
          >
            <Send size={14} />
          </button>
        </div>
        <p className="text-xs text-zinc-600 mt-1.5 text-center">Press Enter to send</p>
      </div>
    </div>
  );
}
