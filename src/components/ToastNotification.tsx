'use client';

import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export const ToastNotification: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-2xl text-white font-medium animate-slideIn backdrop-blur-sm ${
        type === 'success'
          ? 'bg-emerald-500/90 border border-emerald-400/30'
          : 'bg-red-500/90 border border-red-400/30'
      }`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center gap-2">
        <span>{type === 'success' ? '✓' : '✕'}</span>
        <span>{message}</span>
      </div>
    </div>
  );
};
