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
  return `You are a carbon footprint persona generator. Based on this user's data, generate a short, emotionally resonant persona.

User's annual carbon footprint: ${footprint} tonnes CO₂e per year.
That's ${(percentOfAvg / 100).toFixed(1)}x the average Indian's footprint (1.9 t CO₂e/year).

Questionnaire data: ${JSON.stringify(data)}.

Generate a JSON response with EXACTLY this structure and no additional text:
{
  "name": "string (2-3 words, e.g., 'Sky Rider', 'Metro Maven')",
  "tagline": "string (one line, max 8 words, poetic and personal)",
  "emotionalLine": "string (2 sentences, max 30 words, making the impact visceral without judgment)",
  "icon": "string (single emoji that represents the persona)"
}

Constraints:
- No placeholders or incomplete data.
- The persona name and tagline should match the footprint tier: low (<3t) = positive/light, medium (3-8t) = pragmatic, high (>8t) = awakening.
- Tone is never preachy or judgmental. Always respectful.`;
}
