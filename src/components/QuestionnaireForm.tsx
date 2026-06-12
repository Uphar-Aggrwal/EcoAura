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
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{title}</h2>
      <div className="space-y-3">
        {type === 'number' ? (
          <div className="space-y-4">
            <input
              type="number"
              min="0"
              max="50"
              value={currentValue}
              onChange={(e) => onSelect(parseInt(e.target.value) || 0)}
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-center text-3xl font-bold text-gray-800 outline-none transition-all bg-white/70 backdrop-blur-sm"
              aria-label={title}
            />
            <p className="text-center text-sm text-gray-400">flights per year</p>
          </div>
        ) : (
          options?.map((option) => (
            <button
              key={option.value}
              onClick={() => onSelect(option.value)}
              className={`w-full px-5 py-4 rounded-2xl text-left font-medium transition-all duration-200 ${
                currentValue === option.value
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-[1.02]'
                  : 'bg-white/70 backdrop-blur-sm text-gray-800 border-2 border-gray-200 hover:border-emerald-400 hover:bg-white'
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
