'use client';

import React from 'react';

interface StepOption {
  value: string;
  label: string;
  emoji: string;
}

interface QuestionnaireStepProps {
  title: string;
  subtitle?: string;
  options?: StepOption[];
  type?: 'number';
  currentValue: string | number;
  onSelect: (value: string | number) => void;
}

export const QuestionnaireStep: React.FC<QuestionnaireStepProps> = ({
  title,
  subtitle,
  options,
  type,
  currentValue,
  onSelect,
}) => {
  return (
    <div className="animate-fadeUp">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2 text-center leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-slate-400 text-center mb-6">{subtitle}</p>
      )}
      {!subtitle && <div className="mb-6" />}

      <div className="space-y-3">
        {type === 'number' ? (
          <div className="space-y-6">
            {/* Large number display */}
            <div className="flex items-center justify-center">
              <div className="relative">
                <div
                  className={`absolute -inset-3 rounded-full blur-xl transition-all duration-500 ${
                    (currentValue as number) > 10
                      ? 'bg-red-500/20'
                      : (currentValue as number) > 4
                        ? 'bg-amber-500/15'
                        : 'bg-emerald-500/15'
                  }`}
                />
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={currentValue}
                  onChange={(e) => onSelect(Math.min(50, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="relative w-32 h-32 rounded-full border-2 border-slate-700 focus:border-emerald-500 bg-slate-800/70 backdrop-blur-md text-center text-5xl font-bold text-white outline-none transition-all focus:ring-2 focus:ring-emerald-500/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  aria-label={title}
                />
              </div>
            </div>

            {/* Slider */}
            <div className="px-2">
              <input
                type="range"
                min="0"
                max="50"
                value={currentValue}
                onChange={(e) => onSelect(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r
                  [&::-webkit-slider-thumb]:from-emerald-400 [&::-webkit-slider-thumb]:to-cyan-400
                  [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(16,185,129,0.5)] [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:transition-shadow [&::-webkit-slider-thumb]:hover:shadow-[0_0_20px_rgba(16,185,129,0.7)]"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>0</span>
                <span className="text-slate-400 font-medium">flights per year</span>
                <span>50</span>
              </div>
            </div>

            {/* Context hint */}
            <p className={`text-center text-xs font-medium transition-all duration-300 ${
              (currentValue as number) === 0
                ? 'text-emerald-400'
                : (currentValue as number) <= 2
                  ? 'text-emerald-300'
                  : (currentValue as number) <= 6
                    ? 'text-amber-400'
                    : 'text-red-400'
            }`}>
              {(currentValue as number) === 0
                ? '✨ Zero flights — amazing!'
                : (currentValue as number) <= 2
                  ? '🌿 Below average — nice!'
                  : (currentValue as number) <= 6
                    ? '✈️ About average'
                    : `🔥 ${currentValue} flights is quite a lot!`}
            </p>
          </div>
        ) : (
          options?.map((option) => {
            const isSelected = currentValue === option.value;
            return (
              <button
                key={option.value}
                onClick={() => onSelect(option.value)}
                className={`group w-full px-5 py-4 rounded-2xl text-left font-medium transition-all duration-200 border-2 flex items-center gap-4 ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 text-white border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.2)] scale-[1.02]'
                    : 'bg-slate-800/70 backdrop-blur-md text-slate-300 border-slate-700/60 hover:border-emerald-500/40 hover:bg-slate-700/80 hover:scale-[1.01]'
                }`}
              >
                <span
                  className={`text-2xl flex-shrink-0 transition-transform duration-200 ${
                    isSelected ? 'scale-110' : 'group-hover:scale-110'
                  }`}
                >
                  {option.emoji}
                </span>
                <span className="flex-1">{option.label}</span>
                {isSelected && (
                  <span className="text-emerald-400 text-lg flex-shrink-0">✓</span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
