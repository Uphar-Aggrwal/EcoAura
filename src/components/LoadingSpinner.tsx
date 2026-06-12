'use client';

import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 animate-fadeUp">
      {/* Animated Earth with pulsing ring */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-[40px] animate-pulse-glow" />
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-spin" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-2 rounded-full border-2 border-cyan-500/20 animate-spin" style={{ animationDuration: '5s', animationDirection: 'reverse' }} />
          <div className="absolute inset-4 rounded-full border-2 border-teal-500/30 animate-spin" style={{ animationDuration: '7s' }} />
          <span className="text-5xl animate-float z-10">🌍</span>
        </div>
      </div>

      {/* Branded text */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Crafting Your EcoAura
        </h2>
        <p className="text-sm text-slate-400 max-w-xs font-light leading-relaxed">
          Our AI is analyzing your lifestyle data to build your unique carbon identity...
        </p>
      </div>

      {/* Animated progress dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-emerald-500"
            style={{
              animation: 'pulse-glow 1.4s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
