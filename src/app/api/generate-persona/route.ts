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
        customActions: [
          { action: 'Share your zero-waste tips with the community.', saving: '-0.1 t' },
          { action: 'Start a neighborhood composting initiative.', saving: '-0.2 t' },
          { action: 'Advocate for local green policies.', saving: '-0.5 t' }
        ],
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

        const { buildPersonaPrompt } = await import('@/lib/gemini-client');
        const prompt = buildPersonaPrompt(clampedFootprint, percentOfAvg, data);

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
          customActions: personaData.customActions || [],
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
