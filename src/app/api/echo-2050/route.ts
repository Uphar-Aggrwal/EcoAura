import { NextRequest, NextResponse } from 'next/server';
import { QuestionnaireData } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { footprint, data, shiftDecision } = body as { footprint: number; data: QuestionnaireData; shiftDecision?: string };

    if (typeof footprint !== 'number' || !data) {
      return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 });
    }

    let tier: 'utopia' | 'transition' | 'smog' | 'dystopia' = 'transition';
    if (footprint < 3) tier = 'utopia';
    else if (footprint < 6) tier = 'transition';
    else if (footprint < 12) tier = 'smog';
    else tier = 'dystopia';

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return NextResponse.json({
        message: `Transmission connected. The year is 2050. Your choices in 2026 shaped this world. Based on your footprint of ${footprint} tonnes, we are currently experiencing a ${tier} scenario. Keep making conscious choices. End transmission.`,
        tier
      });
    }

    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    let prompt = '';
    
    if (shiftDecision) {
      prompt = `You are the user's future self, transmitting a message back in time from the year 2050.
The user made a hypothetical decision in 2026: "${shiftDecision}". 
Because of that specific decision, their carbon footprint dropped to ${footprint} tonnes CO2/year.

Based on this new footprint, the world in 2050 shifted to a ${tier.toUpperCase()} scenario:
- UTOPIA (<3t): Thriving green tech, clean air, gratitude for early action.
- TRANSITION (3-6t): A world struggling but adapting. Warnings about the climate shifts they barely avoided.
- SMOG (6-12t): Harsh conditions, thick pollution, water rationing, regret.
- DYSTOPIA (>12t): Climate collapse, flooded coastal cities, extreme heat waves, desperation.

INSTRUCTIONS:
1. Write a deeply personal, cinematic, 3-paragraph letter from their 2050 self.
2. Explicitly thank them for making the decision to "${shiftDecision}" in 2026, and describe exactly how that one choice rippled through time to change their future.
3. Use a tone appropriate for the ${tier.toUpperCase()} scenario (e.g., if it's still Smog, say "it's still hard, but that choice saved us from the worst").
4. Do NOT output markdown, JSON, or any preamble. Just output the raw text of the letter.
5. Max length: 150 words. Make it punchy and visceral.`;
    } else {
      prompt = `You are the user's future self, transmitting a message back in time from the year 2050.
The user's current carbon footprint in 2026 is ${footprint} tonnes CO2/year.

The user's 2026 psychographic data is:
${JSON.stringify(data)}

Based on their footprint, the world in 2050 is a ${tier.toUpperCase()} scenario:
- UTOPIA (<3t): Thriving green tech, clean air, gratitude for early action.
- TRANSITION (3-6t): A world struggling but adapting. Warnings about the climate shifts they barely avoided.
- SMOG (6-12t): Harsh conditions, thick pollution, water rationing, regret.
- DYSTOPIA (>12t): Climate collapse, flooded coastal cities, extreme heat waves, desperation.

INSTRUCTIONS:
1. Write a deeply personal, cinematic, 3-paragraph letter from their 2050 self.
2. Directly reference their specific 2026 habits (e.g., their motivation: ${data.motivation}, lifestyle: ${data.lifestyle}, housing: ${data.housing}, shopping: ${data.shopping}, tech habits: ${data.techHabits}).
3. Use a tone appropriate for the scenario (grateful, urgent, or desperate).
4. Do NOT output markdown, JSON, or any preamble. Just output the raw text of the letter.
5. Max length: 150 words. Make it punchy and visceral.`;
    }

    const result = await model.generateContent(prompt);
    const message = result.response.text().trim();

    return NextResponse.json({ message, tier });
  } catch (error: unknown) {
    console.error('Echo 2050 API error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Failed to establish connection to 2050.' },
      { status: 500 }
    );
  }
}
