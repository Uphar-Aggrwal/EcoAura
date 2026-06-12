import { NextRequest, NextResponse } from 'next/server';
import { calculateAnnualFootprint, calculateBreakdown, calculatePercentOfAverage } from '@/lib/carbon-calculator';
import { getFallbackPersona } from '@/lib/persona-fallback';
import { validateQuestionnaireData, clampFootprint } from '@/lib/validators';
import { Persona, QuestionnaireData } from '@/types';

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { tokens: number; lastReset: number }>();
const RATE_LIMIT_TOKENS = 10;
const RATE_LIMIT_WINDOW = 60000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = rateLimitMap.get(ip);

  if (!bucket || now - bucket.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { tokens: RATE_LIMIT_TOKENS - 1, lastReset: now });
    return false;
  }

  if (bucket.tokens > 0) {
    bucket.tokens--;
    return false;
  }

  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in a minute.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { data } = body;

    if (!validateQuestionnaireData(data)) {
      return NextResponse.json({ error: 'Invalid questionnaire data.' }, { status: 400 });
    }

    const typedData = data as QuestionnaireData;
    const footprint = calculateAnnualFootprint(typedData);
    const clampedFootprint = clampFootprint(footprint);
    const percentOfAvg = calculatePercentOfAverage(clampedFootprint);
    const breakdown = calculateBreakdown(typedData, clampedFootprint);

    // Ultra-low footprint shortcut
    if (clampedFootprint <= 0.8) {
      const persona: Persona = {
        name: 'Carbon Minimalist',
        tagline: "You're already living gently.",
        icon: '🌿',
        ringColor: '#66BB6A',
        gradientFrom: '#E8F5E9',
        gradientTo: '#B2DFDB',
        emotionalLine: "Your footprint is so light that you're in the global top 5%. Keep going.",
        footprintTotalTCo2: clampedFootprint,
        footprintPercentOfAvg: percentOfAvg,
        breakdown: breakdown.percentages,
        breakdownTCo2: breakdown.tonnes,
        source: 'calculated',
      };
      return NextResponse.json(persona);
    }

    // Try Gemini API
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (geminiApiKey) {
      try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `You are a carbon footprint persona generator. Based on this user's data, generate a short, emotionally resonant persona.

User's annual carbon footprint: ${clampedFootprint} tonnes CO₂e per year.
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

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON found in Gemini response');

        const personaData = JSON.parse(jsonMatch[0]);

        let ringColor = '#FFA726';
        let gradientFrom = '#FFF3E0';
        let gradientTo = '#FFE0B2';
        if (clampedFootprint < 3) {
          ringColor = '#66BB6A';
          gradientFrom = '#E8F5E9';
          gradientTo = '#B2DFDB';
        } else if (clampedFootprint > 8) {
          ringColor = '#EF5350';
          gradientFrom = '#ECEFF1';
          gradientTo = '#CFD8DC';
        }

        const persona: Persona = {
          name: personaData.name || 'Carbon Persona',
          tagline: personaData.tagline || 'On a journey to awareness.',
          icon: personaData.icon || '🌍',
          ringColor,
          gradientFrom,
          gradientTo,
          emotionalLine: personaData.emotionalLine || `Your footprint is ${(percentOfAvg / 100).toFixed(1)}x the average. Let's change that.`,
          footprintTotalTCo2: clampedFootprint,
          footprintPercentOfAvg: percentOfAvg,
          breakdown: breakdown.percentages,
          breakdownTCo2: breakdown.tonnes,
          source: 'gemini',
        };

        return NextResponse.json(persona);
      } catch (geminiError: unknown) {
        console.error('Gemini API error:', geminiError instanceof Error ? geminiError.message : 'Unknown error');
        // Fall through to fallback
      }
    }

    // Fallback persona pool
    const fallbackBase = getFallbackPersona(clampedFootprint);
    const fallbackPersona: Persona = {
      ...fallbackBase,
      footprintTotalTCo2: clampedFootprint,
      footprintPercentOfAvg: percentOfAvg,
      breakdown: breakdown.percentages,
      breakdownTCo2: breakdown.tonnes,
    };

    return NextResponse.json(fallbackPersona);
  } catch (error: unknown) {
    console.error('API error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Failed to generate persona. Please try again.' },
      { status: 500 }
    );
  }
}
