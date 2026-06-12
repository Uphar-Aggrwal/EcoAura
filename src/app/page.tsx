'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 overflow-hidden relative">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 animate-gradient"
        style={{
          background: 'linear-gradient(135deg, #ecfdf5, #d1fae5, #a7f3d0, #cffafe, #ecfdf5)',
          backgroundSize: '400% 400%',
        }}
      />

      {/* Decorative floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-emerald-200/30 blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-cyan-200/20 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-emerald-100/20 blur-3xl" />

      <div className="text-center max-w-2xl relative z-10 animate-fadeUp">
        {/* Emoji hero */}
        <div className="text-7xl mb-6 animate-float">🌍</div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
          Know Your
          <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
            EcoAura
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-lg mx-auto">
          Understand your carbon footprint through a personalized identity. Then log daily actions to shift your story.
        </p>

        <button
          id="start-journey-btn"
          onClick={() => router.push('/questionnaire')}
          className="group relative bg-emerald-600 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-emerald-700 transition-all duration-300 shadow-xl shadow-emerald-600/25 hover:shadow-2xl hover:shadow-emerald-600/30 hover:scale-[1.03] active:scale-[0.98]"
        >
          <span className="relative z-10">Start Your Journey →</span>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>

        <div className="mt-12 flex flex-wrap gap-6 justify-center text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            AI-Powered Personas
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            Shareable Cards
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            Micro-Action Tracking
          </div>
        </div>
      </div>
    </div>
  );
}
