<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# EcoAura Architecture Guidelines
- **Core Design**: Dark mode UI, glassmorphism, Next.js App Router, Tailwind CSS.
- **Components**: `PersonaCard.tsx` contains a 3D tilt effect and dual-column layout. Avoid altering the `<Tilt>` logic without checking `framer-motion` compatibility.
- **AI**: Gemini 2.5 Flash is strictly used in `/api/generate-persona`. Rate limiting and fallback personas must be preserved.
- **Vercel**: Deployed on Vercel. Ensure all environment variables are synced properly before major architecture changes.
