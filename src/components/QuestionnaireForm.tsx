'use client';

import React from 'react';

interface StepOption {
  value: string;
  label: string;
}

interface QuestionnaireStepProps {
  title: string;
  options?: StepOption[];
  type?: 'number';
  currentValue: string | number;
  onSelect: (value: string | number) => void;
}

export const QuestionnaireStep: React.FC<QuestionnaireStepProps> = ({
  title,
  options,
  type,
  currentValue,
  onSelect,
}) => {
  return (
    <div className="animate-fadeUp">
      <h2 className="text-2xl font-bold text-slate-100 mb-6 text-center">{title}</h2>
      <div className="space-y-3">
        {type === 'number' ? (
          <div className="space-y-4">
            <input
              type="number"
              min="0"
              max="50"
              value={currentValue}
              onChange={(e) => onSelect(parseInt(e.target.value) || 0)}
              className="w-full px-5 py-4 border-2 border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-center text-3xl font-bold text-white outline-none transition-all bg-slate-800/70 backdrop-blur-md"
              aria-label={title}
            />
            <p className="text-center text-sm text-slate-400">flights per year</p>
          </div>
        ) : (
          options?.map((option) => (
            <button
              key={option.value}
              onClick={() => onSelect(option.value)}
              className={`w-full px-5 py-4 rounded-2xl text-left font-medium transition-all duration-200 border-2 ${
                currentValue === option.value
                  ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white border-transparent shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-[1.02]'
                  : 'bg-slate-800/70 backdrop-blur-md text-slate-300 border-slate-700 hover:border-emerald-500 hover:bg-slate-700/80'
              }`}
            >
              {option.label}
            </button>
          ))
        )}
      </div>
    </div>
  );
};
