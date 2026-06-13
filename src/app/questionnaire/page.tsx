'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuestionnaireData } from '@/types';
import { ToastNotification } from '@/components/ToastNotification';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const STEPS = [
  // PHASE 1: Lifestyle
  {
    phase: 'Your Lifestyle',
    title: '🏢 Where do you live?',
    key: 'housing' as const,
    options: [
      { value: 'apartment', label: '🏢 Apartment' },
      { value: 'house-small', label: '🏡 Small House' },
      { value: 'house-large', label: '🏰 Large House' },
    ],
  },
  {
    phase: 'Your Lifestyle',
    title: '🚗 How do you commute?',
    key: 'transport' as const,
    options: [
      { value: 'car-daily', label: '🚗 Car (daily driver)' },
      { value: 'car-weekly', label: '🚙 Car (weekends only)' },
      { value: 'public-transit', label: '🚌 Public Transit' },
      { value: 'cycling', label: '🚴 Cycling' },
      { value: 'walking', label: '🚶 Walking' },
    ],
  },
  {
    phase: 'Your Lifestyle',
    title: '✈️ Flights per year?',
    key: 'flights' as const,
    type: 'number' as const,
  },
  {
    phase: 'Your Lifestyle',
    title: '🍽️ What\'s your diet?',
    key: 'diet' as const,
    options: [
      { value: 'omnivore-heavy', label: '🥩 Heavy Meat Eater' },
      { value: 'omnivore-light', label: '🍖 Light Meat Eater' },
      { value: 'pescatarian', label: '🐟 Pescatarian' },
      { value: 'vegetarian', label: '🥬 Vegetarian' },
      { value: 'vegan', label: '🌱 Vegan' },
    ],
  },
  {
    phase: 'Your Lifestyle',
    title: '⚡ Your electricity source?',
    key: 'energy' as const,
    options: [
      { value: 'grid-heavy', label: '🏭 Grid (coal-heavy)' },
      { value: 'grid-mixed', label: '⚡ Grid (mixed)' },
      { value: 'solar', label: '☀️ Solar / Renewable' },
    ],
  },
  
  // PHASE 2: Habits
  {
    phase: 'Your Habits',
    title: '🛍️ Shopping philosophy?',
    key: 'shopping' as const,
    options: [
      { value: 'fast-fashion', label: '👗 Fast Fashion' },
      { value: 'quality-durability', label: '🧥 Quality & Durability' },
      { value: 'second-hand', label: '♻️ Second-hand & Thrift' },
    ],
  },
  {
    phase: 'Your Habits',
    title: '💻 Tech habits?',
    key: 'techHabits' as const,
    options: [
      { value: 'early-adopter', label: '📱 Early Adopter (yearly upgrades)' },
      { value: 'repair-reuse', label: '🔧 Repair & Reuse' },
      { value: 'minimalist', label: '🧘 Digital Minimalist' },
    ],
  },

  // PHASE 3: Psychology
  {
    phase: 'Your Psychology',
    title: '🌟 Social lifestyle?',
    key: 'lifestyle' as const,
    options: [
      { value: 'homebody', label: '🏠 Homebody' },
      { value: 'frequent-traveler', label: '✈️ Frequent Traveler' },
      { value: 'social-butterfly', label: '🎉 Social Butterfly' },
    ],
  },
  {
    phase: 'Your Psychology',
    title: '🎯 Core Motivation?',
    key: 'motivation' as const,
    options: [
      { value: 'cost', label: '💰 Cost Savings' },
      { value: 'convenience', label: '⚡ Convenience' },
      { value: 'environment', label: '🌍 Environmental Impact' },
      { value: 'health', label: '💪 Health & Wellness' },
    ],
  },
];

export default function QuestionnairePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [phaseTransition, setPhaseTransition] = useState<string | null>('Your Lifestyle');
  
  const [data, setData] = useState<QuestionnaireData>({
    housing: 'apartment',
    transport: 'public-transit',
    flights: 2,
    diet: 'omnivore-light',
    energy: 'grid-mixed',
    shopping: 'quality-durability',
    techHabits: 'repair-reuse',
    lifestyle: 'homebody',
    motivation: 'cost'
  });

  // Handle phase transitions
  const handleNext = async () => {
    if (step === STEPS.length - 1) {
      setLoading(true);
      try {
        const res = await fetch('/api/generate-persona', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data }),
        });

        if (!res.ok) {
          throw new Error('Failed to generate persona.');
        }

        const persona = await res.json();
        sessionStorage.setItem('persona', JSON.stringify(persona));
        sessionStorage.setItem('questionnaireData', JSON.stringify(data));
        router.push('/persona-card');
      } catch (error) {
        console.error('Submission error:', error);
        setToast({ text: 'Failed to process. Please try again.', type: 'error' });
        setLoading(false);
      }
    } else {
      const nextStep = step + 1;
      const currentPhase = STEPS[step].phase;
      const nextPhase = STEPS[nextStep].phase;
      
      if (currentPhase !== nextPhase) {
        setPhaseTransition(nextPhase);
        setTimeout(() => {
          setPhaseTransition(null);
          setStep(nextStep);
        }, 1200);
      } else {
        setStep(nextStep);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  // Initially clear transition
  if (step === 0 && phaseTransition === 'Your Lifestyle') {
    setTimeout(() => setPhaseTransition(null), 1200);
  }

  const currentStep = STEPS[step];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0f19]">
        <LoadingSpinner />
      </div>
    );
  }

  if (phaseTransition) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0f19] text-center px-4">
        <div className="animate-fadeUp">
          <h2 className="text-sm font-mono text-emerald-400 tracking-widest uppercase mb-4">Entering Phase</h2>
          <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            {phaseTransition}
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden bg-[#0b0f19]">
      {/* Animated background */}
      <div
        className="absolute inset-0 opacity-40 animate-gradient"
        style={{ background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0b0f19 100%)' }}
      />
      <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] rounded-full bg-emerald-500/10 blur-[80px] animate-float" />
      <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-[80px] animate-float" style={{ animationDelay: '2s' }} />

      <div className="max-w-md w-full relative z-10 animate-fadeUp">
        {/* Progress */}
        <div className="mb-8 text-center">
          <h3 className="text-xs text-emerald-400 font-mono tracking-widest uppercase mb-4">{currentStep.phase}</h3>
          <div className="flex gap-1.5 mb-2">
            {STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  idx <= step ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Question Card */}
        <div className="glass-card rounded-3xl p-8 mb-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-slate-100 mb-6 text-center">{currentStep.title}</h2>
          <div className="space-y-3">
            {'type' in currentStep && currentStep.type === 'number' ? (
              <div className="space-y-4">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={data.flights}
                  onChange={(e) => setData({ ...data, flights: parseInt(e.target.value) || 0 })}
                  className="w-full px-5 py-4 border-2 border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-center text-3xl font-bold text-white outline-none transition-all bg-slate-800/70 backdrop-blur-md"
                />
                <p className="text-center text-sm text-slate-400">Round trips</p>
              </div>
            ) : (
              currentStep.options?.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setData({ ...data, [currentStep.key]: option.value })}
                  className={`w-full px-5 py-4 rounded-2xl text-left font-medium transition-all duration-200 border-2 ${
                    data[currentStep.key as keyof QuestionnaireData] === option.value
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

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={handleBack}
              className="flex-1 bg-slate-800/60 backdrop-blur-md text-slate-300 px-6 py-4 rounded-2xl font-semibold hover:bg-slate-700 transition-all border border-slate-600"
            >
              ← Back
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-6 py-4 rounded-2xl font-bold hover:from-emerald-500 hover:to-cyan-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
          >
            {step === STEPS.length - 1 ? '✨ Generate Profile' : 'Next →'}
          </button>
        </div>
      </div>

      {toast && <ToastNotification message={toast.text} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
