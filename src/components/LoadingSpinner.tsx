'use client';

import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-emerald-200" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-600 animate-spin" />
      </div>
      <p className="text-sm text-gray-500 animate-pulse">Generating your EcoAura...</p>
    </div>
  );
};
