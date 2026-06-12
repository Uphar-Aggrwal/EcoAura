'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Persona } from '@/types';
import { PercentageRing } from './PercentageRing';
import { PersonaIcon } from './PersonaIcon';
import { ToastNotification } from './ToastNotification';

interface PersonaCardProps {
  persona: Persona;
}

const MICRO_ACTIONS = [
  { action: 'Replace one flight with a train trip this month.', saving: '-0.4 t' },
  { action: 'Go meat-free 3 days a week.', saving: '-0.2 t' },
  { action: 'Switch your electricity plan to green.', saving: '-0.5 t' },
];

export const PersonaCard: React.FC<PersonaCardProps> = ({ persona }) => {
  const [showCopyFallback, setShowCopyFallback] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [checkedActions, setCheckedActions] = useState<boolean[]>(new Array(MICRO_ACTIONS.length).fill(false));
  const cardRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((text: string, type: 'success' | 'error') => {
    setToastMessage({ text, type });
  }, []);

  const handleDownload = async () => {
    try {
      const cardElement = cardRef.current;
      if (!cardElement) throw new Error('Card element not found');

      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: null,
      });

      const link = document.createElement('a');
      link.download = `${persona.name.replace(/\s+/g, '-').toLowerCase()}-carbon-persona.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      showToast('Carbon card downloaded! Share it on LinkedIn.', 'success');
    } catch (error) {
      console.error('Download failed:', error);
      setShowCopyFallback(true);
      showToast('PNG download unavailable. Use "Copy link" instead.', 'error');
    }
  };

  const handleShareLink = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: `My Carbon Persona: ${persona.name}`,
          text: `I'm a ${persona.name} with a ${persona.footprintTotalTCo2} t CO₂e annual footprint. What's yours?`,
          url: window.location.href,
        });
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Link copied! Paste it on LinkedIn.', 'success');
      }
    } catch (error) {
      console.error('Share failed:', error);
      showToast('Failed to share. Please try again.', 'error');
    }
  };

  const toggleAction = (idx: number) => {
    setCheckedActions(prev => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  return (
    <>
      <div
        className="min-h-screen flex flex-col items-center justify-center p-4 pb-32"
        style={{
          background: `linear-gradient(135deg, ${persona.gradientFrom} 0%, ${persona.gradientTo} 50%, ${persona.gradientFrom}88 100%)`,
        }}
      >
        {/* Main Card */}
        <div
          ref={cardRef}
          className="w-full max-w-sm rounded-3xl p-8 animate-fadeUp"
          style={{
            background: 'rgba(255, 255, 255, 0.72)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255,255,255,0.5) inset',
          }}
        >
          {/* Source badge */}
          <div className="flex justify-end mb-2">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
              persona.source === 'gemini'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-500'
            }`}>
              {persona.source === 'gemini' ? '✨ AI Generated' : '🔄 Fallback'}
            </span>
          </div>

          {/* Icon & Name */}
          <div className="text-center mb-6">
            <PersonaIcon emoji={persona.icon} color={persona.ringColor} />
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">
              {persona.name}
            </h1>
            <p className="text-sm text-gray-500 italic">{persona.tagline}</p>
          </div>

          {/* Annual Footprint Headliner */}
          <div className="text-center mb-6">
            <div className="flex items-baseline justify-center gap-1 mb-4">
              <span
                className="text-5xl font-black tabular-nums"
                style={{ color: persona.ringColor }}
              >
                {persona.footprintTotalTCo2}
              </span>
              <span className="text-lg text-gray-500 font-medium">t CO₂e / year</span>
            </div>
            <PercentageRing
              percentage={Math.min(100, (persona.footprintPercentOfAvg / 500) * 100)}
              color={persona.ringColor}
              footprintRatio={persona.footprintPercentOfAvg / 100}
            />
          </div>

          {/* Emotional Insight */}
          <div
            className="mb-6 px-4 py-3 rounded-xl"
            style={{
              borderLeft: `4px solid ${persona.ringColor}`,
              background: `${persona.ringColor}08`,
            }}
          >
            <p className="text-sm text-gray-700 font-medium leading-relaxed">
              {persona.emotionalLine}
            </p>
          </div>

          {/* Breakdown Bars */}
          <div className="mb-8 space-y-3">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Footprint Breakdown</h3>
            {[
              { label: '🚗 Transport', pct: persona.breakdown.transport, color: '#EF5350', tonnes: persona.breakdownTCo2.transport },
              { label: '🍽️ Food', pct: persona.breakdown.food, color: '#FFA726', tonnes: persona.breakdownTCo2.food },
              { label: '⚡ Energy', pct: persona.breakdown.energy, color: '#66BB6A', tonnes: persona.breakdownTCo2.energy },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>{item.label}</span>
                  <span className="tabular-nums">{item.pct}% · {item.tonnes.toFixed(1)}t</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.max(2, item.pct)}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Micro-Action Ladder */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              3 shifts to change your story
            </h3>
            <div className="space-y-2">
              {MICRO_ACTIONS.map((item, idx) => (
                <label
                  key={idx}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/60 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={checkedActions[idx]}
                    onChange={() => toggleAction(idx)}
                    className="w-4 h-4 mt-0.5 accent-emerald-600 rounded"
                    aria-label={item.action}
                  />
                  <div className="flex-1">
                    <p className={`text-sm text-gray-800 ${checkedActions[idx] ? 'line-through opacity-50' : ''}`}>
                      {item.action}
                    </p>
                    <span className="text-[11px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full inline-block mt-1 font-medium">
                      {item.saving} CO₂e
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 p-4 flex gap-3 justify-center bg-gradient-to-t from-white/80 to-transparent backdrop-blur-sm z-40">
          <button
            onClick={handleDownload}
            id="download-card-btn"
            className="bg-white text-gray-800 px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 border border-gray-200"
          >
            📥 Download Card
          </button>
          <button
            onClick={handleShareLink}
            id="share-btn"
            className="text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
            style={{ backgroundColor: persona.ringColor }}
          >
            {showCopyFallback ? '🔗 Copy Link' : '📢 Share'}
          </button>
        </div>
      </div>

      {toastMessage && (
        <ToastNotification
          message={toastMessage.text}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}
    </>
  );
};
