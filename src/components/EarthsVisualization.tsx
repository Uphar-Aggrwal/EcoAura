'use client';

import React from 'react';

interface EarthsVisualizationProps {
  footprint: number;
}

export const EarthsVisualization: React.FC<EarthsVisualizationProps> = ({ footprint }) => {
  // Earth's biocapacity per capita ≈ 1.6 gha; average ecological footprint per tonne CO2 ≈ 0.5 gha
  // Simplified: Earths needed = footprint / global_sustainable_per_capita (approx 2.0 t CO2e)
  const earthsNeeded = Math.max(0.1, Math.round((footprint / 2.0) * 10) / 10);
  const fullEarths = Math.floor(earthsNeeded);
  const partialEarth = earthsNeeded - fullEarths;

  return (
    <div className="mt-6">
      <p className="text-sm text-slate-400 mb-3 font-medium">
        If everyone lived like you, we&apos;d need:
      </p>
      <div className="flex items-end gap-3 flex-wrap">
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(fullEarths, 8) }).map((_, i) => (
            <span
              key={i}
              className="text-3xl animate-float"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              🌍
            </span>
          ))}
          {partialEarth > 0 && (
            <span
              className="text-3xl animate-float"
              style={{
                opacity: Math.max(0.3, partialEarth),
                animationDelay: `${fullEarths * 0.15}s`,
              }}
            >
              🌍
            </span>
          )}
          {fullEarths > 8 && (
            <span className="text-sm text-slate-500 ml-1 self-center">+{fullEarths - 8} more</span>
          )}
        </div>
        <span
          className="text-3xl font-black bg-gradient-to-r from-amber-400 to-red-400 bg-clip-text text-transparent"
        >
          {earthsNeeded} Earths
        </span>
      </div>
    </div>
  );
};
