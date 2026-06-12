'use client';

import React from 'react';

interface PersonaIconProps {
  emoji: string;
  color: string;
}

export const PersonaIcon: React.FC<PersonaIconProps> = ({ emoji, color }) => {
  return (
    <div
      className="w-28 h-28 rounded-full flex items-center justify-center text-5xl mx-auto mb-4 shadow-lg animate-float"
      style={{
        background: `linear-gradient(135deg, ${color}33, ${color}66)`,
        border: `3px solid ${color}44`,
      }}
      aria-label="Persona icon"
      role="img"
    >
      {emoji}
    </div>
  );
};
