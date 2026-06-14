# EcoAura Awareness Platform

## AI-Powered Personal Carbon Footprint Tracking for PromptWars Challenge 3

### Problem Statement

Users lack emotional, personalized understanding of their carbon footprint. Simple dashboards don't drive behavior change. This app bridges that gap by generating a custom "EcoAura" that makes the impact visceral and shareable.

## 🔥 The "Killer Features"

1. **Deep Psychographic Carbon Identity**: Instead of a generic 5-question calculator, EcoAura uses a 10-point psychographic assessment (measuring motivations, tech habits, shopping philosophy) to create a highly distinct, 100% unique persona for every user.
2. **Echoes from 2050 (Interactive Narrative)**: Users receive a cinematic, emotionally resonant "Transmission from 2050". The AI adopts the persona of the user's future self. Based on their footprint, the UI dynamically changes background visuals (Utopia, Transition, Smog, Dystopia) using a Ken Burns effect while the narrative streams via a typewriter effect.
3. **Echo Shift Simulator (Decision-Point Nudge)**: Users can select a hypothetical decision (e.g. "What if I took public transit?") which dynamically recalculates their footprint and seamlessly regenerates the 2050 transmission, proving how a single choice shifts their timeline.
4. **Hyper-Personalized Action Pledges**: Generic advice is banned. If a user's motivation is "Cost Savings", the AI calculates financial waste. If their motivation is "Convenience", the AI suggests frictionless swaps.
5. **Cinematic UI/UX**: Step-by-step fluid onboarding, 3D tilt-responsive shareable cards, Confetti pledges, and dark-mode glassmorphic aesthetics.

## 🏗️ Architecture & Stack

- **Frontend:** Next.js 14 (App Router), React 18, TailwindCSS
- **Backend:** Next.js API Routes, TypeScript
- **AI:** Gemini 2.5 Flash API (with hard fallback persona pool for resilience)
- **Deployment:** Vercel Hobby free tier

### Key Features

- ✅ **Premium Dark Mode UI:** Glassmorphism, neon glows, and ambient mesh backgrounds.
- ✅ **Interactive 3D Card:** Mouse-driven 3D tilt effect on the desktop persona card.
- ✅ **Micro-Action Pledges:** Dynamic AI-generated actions with confetti commitment buttons.
- ✅ **Rich Visualizations:** "X Earths" icons and Global Context Slider comparing to regional averages.
- ✅ **Social Virality Loop:** Built-in QR code generator and rich OpenGraph meta tags.
- ✅ **PWA Ready:** Installable as a Progressive Web App on mobile devices.
- ✅ No hardcoded mock data (AI-generated personas or fallback pool)
- ✅ Graceful error handling on Gemini rate limits (fallback persona pool)
- ✅ Rate-limiting on `/api/generate-persona` (10 reqs/min per IP)

### Getting Started

```bash
# Clone the repo
git clone <your-repo-url>
cd ecoaura

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your GEMINI_API_KEY to .env.local

# Run development server
npm run dev

# Run tests
npm run test          # Jest unit tests
npm run test:e2e      # Playwright E2E tests

# Build for production
npm run build
npm start
```

### Environment Variables

| Variable             | Required | Description                        |
| -------------------- | -------- | ---------------------------------- |
| `GEMINI_API_KEY`     | Optional | Gemini 2.5 Flash API key           |
| `NEXT_PUBLIC_APP_URL`| Optional | Base URL for the app               |
| `SUPABASE_URL`       | Optional | Supabase project URL (future use)  |
| `SUPABASE_ANON_KEY`  | Optional | Supabase anon key (future use)     |

> If `GEMINI_API_KEY` is not set, the app gracefully falls back to a hardcoded 10-persona pool.

### Project Structure

```
src/
├── app/
│   ├── layout.tsx                 # Global layout, fonts, meta
│   ├── page.tsx                   # Landing page
│   ├── error.tsx                  # Error boundary
│   ├── questionnaire/page.tsx     # Multi-step form
│   ├── persona-card/page.tsx      # Persona card display
│   └── api/
│       ├── generate-persona/route.ts  # Gemini integration + fallback
│       └── health/route.ts            # Deployment verification
├── components/
│   ├── PersonaCard.tsx            # Main shareable card
│   ├── QuestionnaireForm.tsx      # Form step component
│   ├── PercentageRing.tsx         # SVG ring visualization
│   ├── PersonaIcon.tsx            # Emoji avatar
│   ├── ToastNotification.tsx      # UX feedback toasts
│   └── LoadingSpinner.tsx         # Loading indicator
├── lib/
│   ├── carbon-calculator.ts       # Pure footprint calculations
│   ├── persona-fallback.ts        # 10-persona fallback pool
│   ├── gemini-client.ts           # Gemini API wrapper
│   ├── validators.ts              # Input sanitization
│   └── constants.ts               # App constants
├── types/
│   └── index.ts                   # TypeScript interfaces
└── __tests__/
    ├── carbon-calculator.test.ts  # Jest unit tests
    ├── validators.test.ts         # Jest unit tests
    ├── persona-fallback.test.ts   # Jest unit tests
    └── e2e/
        └── full-flow.spec.ts      # Playwright E2E test
```

### Deployment

1. Connect your GitHub repo to Vercel.
2. Add environment variables in Vercel dashboard: `GEMINI_API_KEY`, `NEXT_PUBLIC_APP_URL`.
3. Deploy.

### License

MIT
