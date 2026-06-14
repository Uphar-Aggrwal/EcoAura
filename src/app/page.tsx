'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 overflow-hidden relative bg-[#0b0f19]">
      {/* Dark mode animated mesh background */}
      <div
        className="absolute inset-0 opacity-40 animate-gradient"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0b0f19 100%)',
        }}
      />

      {/* Decorative neon glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[100px] animate-float" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-emerald-900/20 blur-[150px]" />

      <div className="text-center max-w-3xl relative z-10 animate-fadeUp">
        {/* Glowing Emoji hero */}
        <div className="text-8xl mb-8 animate-float drop-shadow-[0_0_30px_rgba(16,185,129,0.5)]">🌍</div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
          Discover Your
          <span className="block mt-2 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
            EcoAura
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-slate-300 mb-4 leading-relaxed max-w-2xl mx-auto font-light">
          A deep psychographic AI assessment that transforms your lifestyle, habits, and motivations into a striking carbon identity.
        </p>
        
        <p className="text-sm md:text-base text-slate-500 mb-12 max-w-xl mx-auto">
          Powered by Gemini 2.5 Flash · Hyper-personalized insights · A cinematic transmission from your future self in 2050
        </p>

        <button
          id="start-journey-btn"
          onClick={() => router.push('/questionnaire')}
          aria-label="Begin EcoAura Assessment"
          className="group relative inline-flex items-center justify-center px-10 py-5 rounded-full text-lg font-bold text-white transition-all duration-300 transform hover:scale-[1.05] active:scale-95"
        >
          {/* Button Glow Effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 blur-md opacity-70 group-hover:opacity-100 group-hover:blur-xl transition-all duration-300 animate-pulse-glow" />
          
          {/* Button Background */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-600 to-cyan-600 border border-white/20" />
          
          <span className="relative z-10 flex items-center gap-3">
            Begin Assessment 
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </button>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-400 font-medium">
          <div className="glass px-6 py-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-white/5 transition-colors">
            <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            Deep Psychographic Quiz
          </div>
          <div className="glass px-6 py-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-white/5 transition-colors">
            <span className="w-3 h-3 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.8)]" />
            Hyper-Personalized AI Insights
          </div>
          <div className="glass px-6 py-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-white/5 transition-colors">
            <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
            Echoes from 2050
          </div>
        </div>
      </div>
    </div>
  );
}
