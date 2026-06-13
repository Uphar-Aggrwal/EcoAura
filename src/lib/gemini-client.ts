import { GoogleGenerativeAI } from '@google/generative-ai';

let geminiInstance: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  if (!geminiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    geminiInstance = new GoogleGenerativeAI(apiKey);
  }
  return geminiInstance;
}

export function buildPersonaPrompt(footprint: number, percentOfAvg: number, data: Record<string, unknown>): string {
  return `You are an advanced carbon footprint persona generator. You create deeply personal, psychologically resonant personas based on granular lifestyle and behavioral data.

== USER PROFILE ==
Annual carbon footprint: ${footprint} tonnes CO₂e/year.
That's ${(percentOfAvg / 100).toFixed(1)}x the average Indian's footprint (1.9 t CO₂e/year).

Full questionnaire data: ${JSON.stringify(data)}.

Key fields to analyze:
- housing: Their living situation (apartment, small house, large house)
- transport: How they commute daily
- flights: Number of flights per year
- diet: Their eating habits
- energy: Their electricity source
- shopping: Their consumption philosophy (fast fashion vs quality vs second-hand)
- techHabits: How they handle tech devices (early adopter vs repair vs minimalist)
- lifestyle: Their social pattern (homebody vs traveler vs social butterfly)
- motivation: What drives their decisions (cost, convenience, environment, health)

== OUTPUT FORMAT ==
Generate a JSON response with EXACTLY this structure and no additional text:
{
  "name": "string (2-3 words, creative persona name)",
  "tagline": "string (one line, max 8 words, poetic and deeply personal)",
  "emotionalLine": "string (2-3 sentences, max 40 words, making the impact visceral without judgment)",
  "icon": "string (single emoji)",
  "customActions": [
    { "action": "string (ultra-specific actionable step referencing their exact habits)", "saving": "string (e.g., '-0.5 t')" },
    { "action": "string (ultra-specific actionable step referencing their exact habits)", "saving": "string (e.g., '-0.3 t')" },
    { "action": "string (ultra-specific actionable step referencing their exact habits)", "saving": "string (e.g., '-1.0 t')" }
  ]
}

== STRICT CONSTRAINTS ==
Tier logic for name/tagline:
- Low (<3t) = positive, celebratory, nature-inspired
- Medium (3-8t) = pragmatic, transitional, awakening
- High (>8t) = urgent, visceral, dramatic

CRITICAL — HYPER-PERSONALIZATION RULES:
1. If motivation is "cost", frame EVERY suggestion in terms of money saved. Example: "You're burning ₹15,000/year on fast fashion that ends in landfills. Switch to quality basics and pocket the savings."
2. If motivation is "convenience", frame suggestions as easy swaps, not sacrifices. Example: "Switch your daily commute app to a carpool option — same door-to-door, half the emissions."
3. If motivation is "environment", use ecological impact framing. Example: "Your tech upgrades generate 12kg of e-waste yearly — that's poisoning groundwater in Dharavi."
4. If motivation is "health", tie suggestions to personal wellbeing. Example: "Cycling to work 3 days a week cuts 0.8t CO₂ AND adds 5 years to your life expectancy."

CRITICAL — CONTEXT-AWARE LOGIC:
- If flights = 0, NEVER suggest taking fewer flights or switching to trains for travel.
- If diet is vegan or vegetarian, NEVER suggest eating less meat.
- If shopping is "second-hand", NEVER suggest buying second-hand — they already do.
- If techHabits is "minimalist", NEVER suggest reducing tech usage.
- If transport is "walking" or "cycling", NEVER suggest switching transport modes.
- customActions MUST target only their actual high-emission areas.

Tone: Never preachy. Never generic. Always deeply personal and specific to THIS user's exact profile.`;
}
