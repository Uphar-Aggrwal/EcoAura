'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Persona, QuestionnaireData } from '@/types';
import { calculateAnnualFootprint } from '@/lib/carbon-calculator';
import { PercentageRing } from './PercentageRing';
import { PersonaIcon } from './PersonaIcon';
import { ToastNotification } from './ToastNotification';
import dynamic from 'next/dynamic';

const FutureEchoModal = dynamic(() => import('./FutureEchoModal').then(mod => mod.FutureEchoModal), { ssr: false });
const EarthsVisualization = dynamic(() => import('./EarthsVisualization').then(mod => mod.EarthsVisualization), { ssr: false });
const AnimatedCounter = dynamic(() => import('./AnimatedCounter').then(mod => mod.AnimatedCounter), { ssr: false });
const QRCodeSVG = dynamic(() => import('qrcode.react').then(mod => mod.QRCodeSVG), { ssr: false });

interface PersonaCardProps {
  persona: Persona;
}

interface ShiftOption {
  label: string;
  decision: string;
  applyShift: (data: QuestionnaireData) => QuestionnaireData;
}

export const PersonaCard: React.FC<PersonaCardProps> = ({ persona }) => {
  const router = useRouter();
  const [showCopyFallback, setShowCopyFallback] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isEchoOpen, setIsEchoOpen] = useState(false);
  
  // Echo Shift Simulator State
  const [shiftOptions, setShiftOptions] = React.useState<ShiftOption[]>([]);
  const [shiftedData, setShiftedData] = React.useState<QuestionnaireData | undefined>();
  const [shiftDecision, setShiftDecision] = React.useState<string | undefined>();
  const [activeFootprint, setActiveFootprint] = React.useState<number>(persona.footprintTotalTCo2);

  React.useEffect(() => {
    const stored = sessionStorage.getItem('questionnaireData');
    if (stored) {
      try {
        const data: QuestionnaireData = JSON.parse(stored);
        const options: ShiftOption[] = [];
        
        if (data.transport === 'car-daily' || data.transport === 'car-weekly') {
          options.push({
            label: "What if I took public transit?",
            decision: "I switched from driving to public transit.",
            applyShift: (d) => ({ ...d, transport: 'public-transit' })
          });
        }
        if (data.diet === 'omnivore-heavy' || data.diet === 'omnivore-light') {
          options.push({
            label: "What if I went vegetarian?",
            decision: "I adopted a vegetarian diet.",
            applyShift: (d) => ({ ...d, diet: 'vegetarian' })
          });
        }
        if (data.energy === 'grid-heavy' || data.energy === 'grid-mixed') {
          options.push({
            label: "What if I switched to solar?",
            decision: "I installed solar panels and switched to renewable energy.",
            applyShift: (d) => ({ ...d, energy: 'solar' })
          });
        }
        if (data.flights > 0) {
          options.push({
            label: "What if I stopped flying?",
            decision: "I eliminated air travel completely.",
            applyShift: (d) => ({ ...d, flights: 0 })
          });
        }
        
        if (options.length < 3 && data.shopping !== 'second-hand') {
          options.push({
            label: "What if I only bought second-hand?",
            decision: "I stopped buying fast fashion and switched entirely to second-hand goods.",
            applyShift: (d) => ({ ...d, shopping: 'second-hand' })
          });
        }
        
        setShiftOptions(options.slice(0, 3));
      } catch (e) {
        console.error("Failed to parse data for shift options", e);
      }
    }
  }, []);

  const handleEchoShift = (option: ShiftOption | null) => {
    if (!option) {
      setShiftedData(undefined);
      setShiftDecision(undefined);
      setActiveFootprint(persona.footprintTotalTCo2);
      setIsEchoOpen(true);
      return;
    }
    
    const stored = sessionStorage.getItem('questionnaireData');
    if (stored) {
      const data: QuestionnaireData = JSON.parse(stored);
      const newData = option.applyShift(data);
      setShiftedData(newData);
      setShiftDecision(option.decision);
      setActiveFootprint(calculateAnnualFootprint(newData));
      setIsEchoOpen(true);
    }
  };
  
  // Custom Actions handling (fallback to empty if somehow undefined)
  const actionsList = persona.customActions || [];
  const [pledgedActions, setPledgedActions] = useState<boolean[]>(new Array(actionsList.length).fill(false));
  
  const cardRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((text: string, type: 'success' | 'error') => {
    setToastMessage({ text, type });
  }, []);

  const handleDownload = async () => {
    try {
      const cardElement = cardRef.current;
      if (!cardElement) throw new Error('Card element not found');

      const html2canvas = (await import('html2canvas')).default;
      
      // Temporarily remove 3D transform before snapshot for flat capture
      if (tiltRef.current) {
        tiltRef.current.style.transform = 'none';
      }

      const canvas = await html2canvas(cardElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#0b0f19', // enforce dark background on export
      });

      const link = document.createElement('a');
      link.download = `${persona.name.replace(/\s+/g, '-').toLowerCase()}-ecoaura.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      showToast('EcoAura downloaded! Share it everywhere.', 'success');
    } catch (error) {
      console.error('Download failed:', error);
      setShowCopyFallback(true);
      showToast('PNG download unavailable. Use "Copy link" instead.', 'error');
    }
  };

  const handleShareLink = async () => {
    const url = typeof window !== 'undefined' ? window.location.origin : '';
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: `My EcoAura: ${persona.name}`,
          text: `I generated my carbon identity: ${persona.name} (${persona.footprintTotalTCo2} t CO₂e). Discover yours!`,
          url: url,
        });
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        showToast('Link copied! Paste it on LinkedIn.', 'success');
      }
    } catch (error) {
      console.error('Share failed:', error);
      showToast('Failed to share. Please try again.', 'error');
    }
  };

  const handlePledge = async (idx: number, e: React.MouseEvent) => {
    if (pledgedActions[idx]) return; // already pledged
    
    // Confetti effect originating from the button click
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    
    const confetti = (await import('canvas-confetti')).default;
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x, y },
      colors: ['#34d399', '#2dd4bf', '#22d3ee', '#ffffff'],
      disableForReducedMotion: true
    });

    setPledgedActions(prev => {
      const next = [...prev];
      next[idx] = true;
      return next;
    });
    showToast('Pledge committed! 🌱', 'success');
  };

  // 3D Tilt Effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltRef.current) return;
    const rect = tiltRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10; // max 10 deg
    const rotateY = ((x - centerX) / centerX) * 10;
    
    tiltRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (!tiltRef.current) return;
    tiltRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ecoaura.app';

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-12 pb-32 bg-[#0b0f19] text-white">
        
        {/* Background Ambient Glow matching persona */}
        <div 
          className="fixed inset-0 opacity-20 blur-[150px] pointer-events-none"
          style={{ background: `radial-gradient(circle at center, ${persona.ringColor}, transparent 70%)` }}
        />

        {/* Desktop Container (2 columns) or Mobile (1 column) */}
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 z-10 animate-fadeUp">
          
          {/* LEFT COLUMN: The Exportable "Trading Card" */}
          <div className="md:col-span-5 lg:col-span-4 flex justify-center perspective-[1000px]">
            <div 
              className="w-full max-w-sm tilt-card"
              ref={tiltRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div
                ref={cardRef}
                className="relative rounded-3xl p-8 overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
                  boxShadow: `0 25px 50px -12px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1) inset, 0 0 40px ${persona.ringColor}20`,
                }}
              >
                {/* Internal Glow on Card */}
                <div 
                  className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-30" 
                  style={{ background: `linear-gradient(90deg, transparent, ${persona.ringColor}, transparent)` }}
                />

                <div className="flex justify-between items-start mb-6">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider uppercase ${
                    persona.source === 'gemini'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-700/50 text-slate-400 border border-slate-600'
                  }`}>
                    {persona.source === 'gemini' ? '✨ AI Gen' : '🔄 Fallback'}
                  </span>
                  <div className="opacity-40">
                    <span className="text-xs font-mono tracking-widest text-slate-400">ECO.AURA</span>
                  </div>
                </div>

                <div className="text-center mb-8 tilt-content">
                  <div className="inline-block p-4 rounded-full bg-slate-800/50 shadow-inner mb-4 border border-slate-700">
                    <PersonaIcon emoji={persona.icon} color={persona.ringColor} />
                  </div>
                  <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight drop-shadow-md">
                    {persona.name}
                  </h1>
                  <p className="text-sm text-slate-400 italic font-light">{persona.tagline}</p>
                </div>

                <div className="text-center mb-10 tilt-content">
                  <div className="flex items-baseline justify-center gap-1 mb-6">
                    <AnimatedCounter target={persona.footprintTotalTCo2} color={persona.ringColor} />
                    <span className="text-lg text-slate-500 font-medium">t CO₂e / yr</span>
                  </div>
                  <PercentageRing
                    percentage={Math.min(100, (persona.footprintPercentOfAvg / 500) * 100)}
                    color={persona.ringColor}
                    footprintRatio={persona.footprintPercentOfAvg / 100}
                  />
                </div>

                {/* QR Code section for export */}
                <div className="mt-8 pt-6 border-t border-slate-700/50 flex items-center justify-between tilt-content">
                  <div className="text-left">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mb-1">Scan to discover</p>
                    <p className="text-xs text-white font-medium">your own EcoAura</p>
                  </div>
                  <div className="bg-white p-1.5 rounded-lg shadow-md">
                    <QRCodeSVG value={shareUrl} size={48} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Details & Pledges */}
          <div className="md:col-span-7 lg:col-span-8 space-y-8">
            
            {/* Context Box */}
            <div className="glass-card rounded-3xl p-6 md:p-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">🧠</span> AI Analysis
              </h2>
              <div 
                className="px-4 py-3 rounded-xl mb-6"
                style={{ borderLeft: `4px solid ${persona.ringColor}`, background: `${persona.ringColor}10` }}
              >
                <p className="text-slate-300 font-medium leading-relaxed text-lg">
                  "{persona.emotionalLine}"
                </p>
              </div>

              {/* Earths Visualization */}
              <EarthsVisualization footprint={persona.footprintTotalTCo2} />

              {/* Global Context Slider */}
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Global Context</h3>
                <div className="relative h-12 w-full">
                  <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 w-full opacity-60" />
                  </div>
                  
                  {/* Markers */}
                  <div className="absolute top-0 w-full h-full pointer-events-none">
                    {/* Indian Avg */}
                    <div className="absolute top-1/2 -translate-y-1/2 h-4 w-1 bg-emerald-400" style={{ left: '10%' }} />
                    <span className="absolute top-full mt-1 text-[10px] text-slate-400 -translate-x-1/2 whitespace-nowrap" style={{ left: '10%' }}>IN Avg (1.9t)</span>
                    
                    {/* Global Avg */}
                    <div className="absolute top-1/2 -translate-y-1/2 h-4 w-1 bg-amber-400" style={{ left: '30%' }} />
                    <span className="absolute top-full mt-1 text-[10px] text-slate-400 -translate-x-1/2 whitespace-nowrap" style={{ left: '30%' }}>Global (4.7t)</span>
                    
                    {/* US Avg */}
                    <div className="absolute top-1/2 -translate-y-1/2 h-4 w-1 bg-red-400" style={{ left: '85%' }} />
                    <span className="absolute top-full mt-1 text-[10px] text-slate-400 -translate-x-1/2 whitespace-nowrap" style={{ left: '85%' }}>US Avg (15t)</span>
                    
                    {/* User Marker */}
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 h-6 w-1 rounded-full shadow-[0_0_10px_currentColor] z-10 transition-all duration-1000 ease-out" 
                      style={{ left: `${Math.min(95, Math.max(5, (persona.footprintTotalTCo2 / 18) * 100))}%`, backgroundColor: persona.ringColor, color: persona.ringColor }}
                    />
                    <span 
                      className="absolute bottom-full mb-1 text-xs font-bold -translate-x-1/2 whitespace-nowrap" 
                      style={{ left: `${Math.min(95, Math.max(5, (persona.footprintTotalTCo2 / 18) * 100))}%`, color: persona.ringColor }}
                    >
                      YOU
                    </span>
                  </div>
                </div>
              </div>

              {/* Echo from 2050 Trigger */}
              <div className="mt-8 pt-8 border-t border-slate-700/50 text-center">
                <button
                  onClick={() => handleEchoShift(null)}
                  aria-label="View Transmission From 2050"
                  className="group relative inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-95 bg-black border border-slate-700 overflow-hidden shadow-[0_0_20px_rgba(239,68,68,0.15)] hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:border-red-500/50"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center gap-3 font-mono tracking-wide">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                    INCOMING TRANSMISSION FROM 2050
                  </span>
                </button>
              </div>

              {/* Echo Shift Simulator */}
              {shiftOptions.length > 0 && (
                <div className="mt-8 pt-8 border-t border-slate-700/50">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 text-center">
                    Echo Shift Simulator
                  </h3>
                  <p className="text-xs text-slate-500 text-center mb-6 max-w-sm mx-auto leading-relaxed">
                    How does a single decision reshape your future? Select a hypothetical choice to recalculate your footprint and regenerate your 2050 timeline.
                  </p>
                  <div className="flex flex-col gap-3 max-w-md mx-auto">
                    {shiftOptions.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleEchoShift(opt)}
                        aria-label={`Simulate: ${opt.label}`}
                        className="group flex items-center justify-between px-5 py-3 rounded-xl bg-slate-800/40 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 transition-all text-left"
                      >
                        <span className="text-sm font-medium text-slate-300 group-hover:text-cyan-300 transition-colors">
                          {opt.label}
                        </span>
                        <span className="text-cyan-500/50 group-hover:text-cyan-400 font-mono text-lg transition-colors">
                          →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Breakdown Bars */}
            <div className="glass-card rounded-3xl p-6 md:p-8">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Footprint Breakdown</h3>
              <div className="space-y-5">
                {[
                  { label: '🚗 Transport', pct: persona.breakdown.transport, color: '#38bdf8', tonnes: persona.breakdownTCo2.transport },
                  { label: '🍽️ Food', pct: persona.breakdown.food, color: '#fbbf24', tonnes: persona.breakdownTCo2.food },
                  { label: '⚡ Energy', pct: persona.breakdown.energy, color: '#34d399', tonnes: persona.breakdownTCo2.energy },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm text-slate-300 mb-2 font-medium">
                      <span>{item.label}</span>
                      <span className="tabular-nums opacity-80">{item.pct}% · {item.tonnes.toFixed(1)}t</span>
                    </div>
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out relative"
                        style={{ width: `${Math.max(2, item.pct)}%`, backgroundColor: item.color }}
                      >
                        <div className="absolute inset-0 bg-white/20 w-full h-full opacity-0 hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Micro-Action Commitment Pledge */}
            <div className="glass-card rounded-3xl p-6 md:p-8 border border-emerald-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] pointer-events-none" />
              <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-6">
                Your AI-Tailored Action Plan
              </h3>
              
              {actionsList.length === 0 ? (
                <p className="text-slate-400 text-sm">No actions generated for this persona.</p>
              ) : (
                <div className="space-y-4 relative z-10">
                  {actionsList.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                        pledgedActions[idx] 
                          ? 'bg-emerald-500/10 border-emerald-500/30' 
                          : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex-1">
                        <p className={`text-base font-medium ${pledgedActions[idx] ? 'text-emerald-300 line-through opacity-70' : 'text-slate-200'}`}>
                          {item.action}
                        </p>
                        <span className="text-[11px] bg-slate-900 text-slate-400 px-2 py-1 rounded-full inline-block mt-2 font-mono border border-slate-700">
                          Expected savings: {item.saving} CO₂e
                        </span>
                      </div>
                      
                      <button
                        onClick={(e) => handlePledge(idx, e)}
                        disabled={pledgedActions[idx]}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${
                          pledgedActions[idx]
                            ? 'bg-emerald-500/20 text-emerald-500 cursor-default shadow-none border border-emerald-500/20'
                            : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:scale-105 hover:shadow-emerald-500/30 active:scale-95'
                        }`}
                      >
                        {pledgedActions[idx] ? 'Pledged ✓' : 'Pledge'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Retake Quiz */}
            <div className="flex justify-center">
              <button
                onClick={() => { sessionStorage.removeItem('persona'); router.push('/questionnaire'); }}
                className="text-slate-400 hover:text-white text-sm font-medium py-3 px-6 rounded-xl border border-slate-700 hover:border-slate-500 transition-all hover:bg-slate-800/50"
              >
                ↻ Retake Quiz
              </button>
            </div>

          </div>
        </div>

        {/* Floating Action Buttons Mobile */}
        <div className="fixed bottom-0 left-0 right-0 p-4 flex gap-3 justify-center bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/80 to-transparent backdrop-blur-md z-40 md:hidden">
          <button
            onClick={handleDownload}
            className="bg-slate-800 text-white border border-slate-600 px-6 py-3 rounded-2xl font-semibold shadow-xl hover:bg-slate-700 active:scale-95 transition-all"
          >
            📥 Download
          </button>
          <button
            onClick={handleShareLink}
            className="text-white px-6 py-3 rounded-2xl font-semibold shadow-xl active:scale-95 transition-all"
            style={{ backgroundColor: persona.ringColor, boxShadow: `0 10px 20px ${persona.ringColor}40` }}
          >
            {showCopyFallback ? '🔗 Copy Link' : '📢 Share'}
          </button>
        </div>
        
        {/* Desktop floating buttons (top right) */}
        <div className="hidden md:flex fixed top-8 right-8 gap-4 z-50">
          <button
            onClick={handleDownload}
            className="bg-slate-800/80 backdrop-blur-md border border-slate-600 text-slate-300 hover:text-white px-5 py-2.5 rounded-xl font-medium shadow-lg hover:bg-slate-700 transition-all hover:scale-105 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Save Card
          </button>
          <button
            onClick={handleShareLink}
            className="text-white px-5 py-2.5 rounded-xl font-medium shadow-lg transition-all hover:scale-105 flex items-center gap-2"
            style={{ backgroundColor: persona.ringColor, boxShadow: `0 0 20px ${persona.ringColor}50` }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            {showCopyFallback ? 'Copy' : 'Share'}
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

      <FutureEchoModal 
        isOpen={isEchoOpen} 
        onClose={() => setIsEchoOpen(false)} 
        footprint={activeFootprint} 
        shiftedData={shiftedData}
        shiftDecision={shiftDecision}
      />
    </>
  );
};
