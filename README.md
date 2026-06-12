# EcoAura Awareness Platform

## AI-Powered Personal Carbon Footprint Tracking for PromptWars Challenge 3

### Problem Statement

Users lack emotional, personalized understanding of their carbon footprint. Simple dashboards don't drive behavior change. This app bridges that gap by generating a custom "EcoAura" that makes the impact visceral and shareable.

### Solution

1. **Questionnaire:** Collect lifestyle data (transport, diet, energy, shopping, flights).
2. **AI Persona Generation:** Gemini 2.5 Flash generates a personalized name, tagline, and emotional insight.
3. **Shareable Card:** A Spotify Wrapped-style card showing footprint, visual breakdown, and micro-action ladder.
4. **Action Tracking:** Users log daily actions to shift their persona over time.

### Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TailwindCSS
- **Backend:** Next.js API Routes, TypeScript
- **AI:** Gemini 2.5 Flash API (with hard fallback persona pool for resilience)
- **Deployment:** Vercel Hobby free tier
- **Testing:** Jest + Playwright

### Key Features

- ✅ No hardcoded mock data (AI-generated personas or fallback pool)
- ✅ All API keys in `.env.local`, never in source
- ✅ Graceful error handling on Gemini rate limits (fallback persona pool)
- ✅ `html2canvas` fallback if PNG download fails (copy link instead)
- ✅ Rate-limiting on `/api/generate-persona` (10 reqs/min per IP)
- ✅ Full Jest + Playwright test coverage
- ✅ Mobile-first, responsive design
- ✅ Semantic HTML with proper alt text and ARIA labels
- ✅ Error boundary for graceful crash recovery

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
