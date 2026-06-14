'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { QuestionnaireData } from '@/types';

interface FutureEchoModalProps {
  isOpen: boolean;
  onClose: () => void;
  footprint: number;
  shiftedData?: QuestionnaireData;
  shiftDecision?: string;
}

export const FutureEchoModal: React.FC<FutureEchoModalProps> = ({ isOpen, onClose, footprint, shiftedData, shiftDecision }) => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [tier, setTier] = useState<'utopia' | 'transition' | 'smog' | 'dystopia'>('transition');
  const [displayedText, setDisplayedText] = useState('');
  const [showGlitch, setShowGlitch] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setDisplayedText('');
      setMessage('');
      setLoading(true);
      return;
    }

    setShowGlitch(true);
    setTimeout(() => setShowGlitch(false), 800);

    const fetchEcho = async () => {
      try {
        const stored = sessionStorage.getItem('questionnaireData');
        const data: QuestionnaireData | null = stored ? JSON.parse(stored) : null;
        
        const dataToUse = shiftedData || data;

        if (!dataToUse) {
          throw new Error('No data found');
        }

        const res = await fetch('/api/echo-2050', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ footprint, data: dataToUse, shiftDecision }),
        });

        if (!res.ok) throw new Error('API Error');
        const result = await res.json();
        
        setTier(result.tier);
        setMessage(result.message);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setTier('transition');
        setMessage('Connection unstable. Signal lost.');
        setLoading(false);
      }
    };

    fetchEcho();
  }, [isOpen, footprint, shiftedData, shiftDecision]);

  // Typewriter effect
  useEffect(() => {
    if (loading || !message) return;
    
    let i = 0;
    setDisplayedText('');
    
    const interval = setInterval(() => {
      setDisplayedText(message.substring(0, i + 1));
      i++;
      if (i >= message.length) {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [message, loading]);

  if (!isOpen) return null;

  const bgImage = `/worlds/${tier}.png`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-hidden">
      
      {/* Background with Ken Burns effect */}
      <div className="absolute inset-0 z-0 animate-ken-burns">
        <Image 
          src={bgImage}
          alt={`Future ${tier} scenario`}
          fill
          priority
          className="object-cover"
        />
      </div>
      
      {/* Gradient Overlays for text readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0b0f19]/80 via-transparent to-[#0b0f19]/90" />
      <div className="absolute inset-0 z-0 bg-black/40" />

      {/* Glitch Overlay */}
      {showGlitch && (
        <div className="absolute inset-0 z-20 mix-blend-overlay animate-glitch-overlay opacity-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      )}

      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col h-full md:h-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
            <h2 className="text-red-500 font-mono text-sm tracking-widest uppercase font-bold drop-shadow-md">
              Incoming Transmission — Year 2050
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-white/50 hover:text-white bg-black/30 hover:bg-black/50 rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-md transition-all border border-white/10"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col justify-end">
          {loading ? (
            <div className="font-mono text-emerald-400 text-lg animate-pulse">
              Establishing connection across time...
              <div className="mt-4 h-1 w-24 bg-emerald-500/30 rounded overflow-hidden">
                <div className="h-full bg-emerald-500 w-1/2 animate-[shimmer_1s_infinite_linear]" />
              </div>
            </div>
          ) : (
            <div className="font-mono text-white/90 text-lg md:text-xl leading-relaxed whitespace-pre-wrap drop-shadow-lg p-6 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 shadow-2xl">
              <span className={tier === 'utopia' ? 'text-emerald-300' : tier === 'dystopia' ? 'text-orange-300' : 'text-cyan-300'}>
                {displayedText}
              </span>
              <span className="animate-pulse inline-block w-2.5 h-5 bg-white ml-1 align-middle" />
            </div>
          )}
        </div>
      </div>

      {/* Inline styles for custom animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ken-burns {
          0% { transform: scale(1.0); }
          100% { transform: scale(1.15); }
        }
        .animate-ken-burns {
          animation: ken-burns 30s ease-out forwards;
        }
        @keyframes glitch-overlay {
          0% { opacity: 0; background-position: 0 0; }
          20% { opacity: 1; background-position: -20px 20px; }
          40% { opacity: 0; background-position: 20px -20px; }
          60% { opacity: 1; background-position: -10px 10px; }
          80% { opacity: 0; background-position: 10px -10px; }
          100% { opacity: 1; background-position: 0 0; }
        }
        .animate-glitch-overlay {
          animation: glitch-overlay 0.5s ease-in-out forwards;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
      `}} />
    </div>
  );
};
