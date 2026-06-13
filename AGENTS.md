<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# EcoAura Architecture Guidelines
- **Core Design**: Dark mode UI, glassmorphism, Next.js App Router, Tailwind CSS.
- **Data Flow**: The app uses a 9-point psychographic data model (`QuestionnaireData`) to calculate emissions and generate AI responses.
- **Components**: `PersonaCard.tsx` contains a 3D tilt effect and dual-column layout. `FutureEchoModal.tsx` handles the cinematic 2050 transmission with a CSS Ken Burns effect on AI-generated backgrounds.
- **AI Integration**: 
  - Gemini 2.5 Flash is strictly used in `/api/generate-persona` and `/api/echo-2050`. 
  - `gemini-client.ts` houses the complex prompts that mandate hyper-personalized, motivation-driven responses. 
  - Rate limiting and fallback personas must be preserved.
- **Vercel**: Deployed on Vercel. Ensure all environment variables (`GEMINI_API_KEY`) are synced properly before major architecture changes.
