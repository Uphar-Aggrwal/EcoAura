'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuestionnaireData } from '@/types';
import { QuestionnaireStep } from '@/components/QuestionnaireForm';
import { ToastNotification } from '@/components/ToastNotification';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const STEPS = [
  {
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
    title: '🍽️ What\'s your diet?',
    key: 'diet' as const,
    options: [
      { value: 'omnivore', label: '🥩 Omnivore — I eat everything' },
      { value: 'pescatarian', label: '🐟 Pescatarian — Fish, no meat' },
      { value: 'vegetarian', label: '🥬 Vegetarian — No meat or fish' },
      { value: 'vegan', label: '🌱 Vegan — Plant-based only' },
    ],
  },
  {
    title: '⚡ Your electricity source?',
    key: 'energy' as const,
    options: [
      { value: 'grid-heavy', label: '🏭 Grid (coal-heavy)' },
      { value: 'grid-mixed', label: '⚡ Grid (mixed sources)' },
      { value: 'solar', label: '☀️ Solar / Renewable' },
    ],
  },
  {
    title: '🛍️ How much do you shop?',
    key: 'shopping' as const,
    options: [
      { value: 'high', label: '🛍️ High — Frequent online orders & fashion' },
      { value: 'medium', label: '📦 Medium — Regular essentials' },
      { value: 'low', label: '♻️ Low — Minimal, mostly secondhand' },
    ],
  },
  {
    title: '✈️ Flights per year?',
    key: 'flights' as const,
    type: 'number' as const,
  },
];

export default function QuestionnairePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [data, setData] = useState<QuestionnaireData>({
    transport: 'public-transit',
    transportFreq: 50,
    diet: 'omnivore',
    energy: 'grid-mixed',
    shopping: 'medium',
    flights: 2,
  });

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
          const errData = await res.json().catch(() => ({}));
          setToast({ text: errData.error || 'Failed to generate persona.', type: 'error' });
          setLoading(false);
          return;
        }

        const persona = await res.json();
        sessionStorage.setItem('persona', JSON.stringify(persona));
        router.push('/persona-card');
      } catch (error) {
        console.error('Submission error:', error);
        setToast({ text: 'Network error. Please try again.', type: 'error' });
        setLoading(false);
      }
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const currentStep = STEPS[step];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-cyan-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated background */}
      <div
        className="absolute inset-0 animate-gradient"
        style={{
          background: 'linear-gradient(135deg, #eff6ff, #ecfdf5, #f0fdfa, #ecfdf5)',
          backgroundSize: '400% 400%',
        }}
      />

      <div className="max-w-md w-full relative z-10">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-gray-400 font-medium">Step {step + 1} of {STEPS.length}</span>
            <span className="text-xs text-gray-400 font-medium">{Math.round(((step + 1) / STEPS.length) * 100)}%</span>
          </div>
          <div className="flex gap-1.5">
            {STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  idx <= step ? 'bg-emerald-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Question Card */}
        <div className="glass rounded-3xl p-8 mb-6 shadow-xl">
          <QuestionnaireStep
            title={currentStep.title}
            options={'options' in currentStep ? currentStep.options : undefined}
            type={'type' in currentStep ? currentStep.type : undefined}
            currentValue={data[currentStep.key as keyof QuestionnaireData] as string | number}
            onSelect={(value) => setData({ ...data, [currentStep.key]: value })}
          />
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={handleBack}
              className="flex-1 bg-white/80 backdrop-blur-sm text-gray-700 px-6 py-4 rounded-2xl font-semibold hover:bg-white transition-all border-2 border-gray-200"
            >
              ← Back
            </button>
          )}
          <button
            id={step === STEPS.length - 1 ? 'see-persona-btn' : 'next-step-btn'}
            onClick={handleNext}
            className="flex-1 bg-emerald-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/25 hover:shadow-xl"
          >
            {step === STEPS.length - 1 ? '✨ See Your Persona' : 'Next →'}
          </button>
        </div>
      </div>

      {toast && <ToastNotification message={toast.text} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
