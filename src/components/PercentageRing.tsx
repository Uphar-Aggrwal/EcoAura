'use client';

import React from 'react';

interface PercentageRingProps {
  percentage: number;
  color: string;
  footprintRatio: number;
}

export const PercentageRing: React.FC<PercentageRingProps> = ({ percentage, color, footprintRatio }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="110" height="110" viewBox="0 0 110 110" className="transform -rotate-90">
        <circle
          cx="55"
          cy="55"
          r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth="8"
          opacity="0.6"
        />
        <circle
          cx="55"
          cy="55"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <text
          x="55"
          y="60"
          textAnchor="middle"
          fontSize="18"
          fontWeight="bold"
          fill={color}
          className="transform rotate-90"
          style={{ transformOrigin: '55px 55px' }}
        >
          {footprintRatio.toFixed(1)}×
        </text>
      </svg>
      <p className="text-xs text-slate-500 text-center">
        vs Indian avg: 1.9 t CO₂e
      </p>
    </div>
  );
};
