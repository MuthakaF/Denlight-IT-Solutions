import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-black border border-zinc-800 text-white px-4 py-3 rounded-xl shadow-2xl font-mono text-xs animate-in slide-in-from-bottom-4 duration-300">
      <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-white"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
