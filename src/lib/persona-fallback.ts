export interface FallbackPersonaBase {
  name: string;
  tagline: string;
  icon: string;
  ringColor: string;
  gradientFrom: string;
  gradientTo: string;
  emotionalLine: string;
  source: 'fallback';
}

export const FALLBACK_PERSONAS: Array<{ max: number; persona: FallbackPersonaBase }> = [
  {
    max: 2.0,
    persona: {
      name: 'Carbon Minimalist',
      tagline: 'Your wings carry you gently.',
      icon: '🌿',
      ringColor: '#66BB6A',
      gradientFrom: '#E8F5E9',
      gradientTo: '#B2DFDB',
      emotionalLine: "Your footprint is already lighter than 95% of the world. Let's keep it that way.",
      source: 'fallback',
    },
  },
  {
    max: 4.0,
    persona: {
      name: 'Conscious Commuter',
      tagline: 'You choose the slower path.',
      icon: '🚲',
      ringColor: '#FFA726',
      gradientFrom: '#FFF3E0',
      gradientTo: '#FFE0B2',
      emotionalLine: 'Your daily choices keep emissions down. One train ride beats 10 car trips.',
      source: 'fallback',
    },
  },
  {
    max: 7.0,
    persona: {
      name: 'Weekend Omnivore',
      tagline: 'You enjoy life, mostly locally.',
      icon: '🍔',
      ringColor: '#FFA726',
      gradientFrom: '#FFF3E0',
      gradientTo: '#FFE0B2',
      emotionalLine: 'Your meals and occasional flights put you near the global average. Small shifts make a big difference.',
      source: 'fallback',
    },
  },
  {
    max: 10.0,
    persona: {
      name: 'Sky Rider',
      tagline: 'Your wings take you far.',
      icon: '✈️',
      ringColor: '#EF5350',
      gradientFrom: '#ECEFF1',
      gradientTo: '#CFD8DC',
      emotionalLine: "Flying twice a month puts you in the top 3% of Indian emitters. But your story isn't fixed.",
      source: 'fallback',
    },
  },
  {
    max: 15.0,
    persona: {
      name: 'Jet Set Emitter',
      tagline: 'You live without limits.',
      icon: '🛩️',
      ringColor: '#D32F2F',
      gradientFrom: '#FFEBEE',
      gradientTo: '#EF9A9A',
      emotionalLine: "Your annual carbon budget is nearly equivalent to an entire country's per-capita. The fastest wins start here.",
      source: 'fallback',
    },
  },
  {
    max: 17.0,
    persona: {
      name: 'Grid Guardian',
      tagline: 'Power flows through your choices.',
      icon: '⚡',
      ringColor: '#D32F2F',
      gradientFrom: '#FBE9E7',
      gradientTo: '#FFCCBC',
      emotionalLine: 'Your energy consumption is the biggest lever. A solar switch alone could cut 40% of your footprint.',
      source: 'fallback',
    },
  },
  {
    max: 19.0,
    persona: {
      name: 'Highway Voyager',
      tagline: 'The road stretches endlessly ahead.',
      icon: '🛣️',
      ringColor: '#C62828',
      gradientFrom: '#FCE4EC',
      gradientTo: '#F8BBD0',
      emotionalLine: "Your transport alone exceeds most people's total footprint. Every shared ride is a step back to balance.",
      source: 'fallback',
    },
  },
  {
    max: 21.0,
    persona: {
      name: 'Urban Titan',
      tagline: 'Cities rise and fall with you.',
      icon: '🏙️',
      ringColor: '#B71C1C',
      gradientFrom: '#EFEBE9',
      gradientTo: '#D7CCC8',
      emotionalLine: 'Your lifestyle powers a carbon engine 10x the Indian average. Three changes could rewrite your story.',
      source: 'fallback',
    },
  },
  {
    max: 23.0,
    persona: {
      name: 'Cloud Cruiser',
      tagline: 'The atmosphere knows your name.',
      icon: '☁️',
      ringColor: '#B71C1C',
      gradientFrom: '#E8EAF6',
      gradientTo: '#C5CAE9',
      emotionalLine: 'At this level, every action counts double. Start with the biggest wins first.',
      source: 'fallback',
    },
  },
  {
    max: 25.0,
    persona: {
      name: 'Carbon Colossus',
      tagline: 'Your shadow stretches across continents.',
      icon: '🌋',
      ringColor: '#880E4F',
      gradientFrom: '#F3E5F5',
      gradientTo: '#CE93D8',
      emotionalLine: 'You are in the top 1% of global emitters. But even colossal ships can change course.',
      source: 'fallback',
    },
  },
];

export function getFallbackPersona(footprint: number): FallbackPersonaBase {
  const match = FALLBACK_PERSONAS.find(p => footprint <= p.max) ?? FALLBACK_PERSONAS[FALLBACK_PERSONAS.length - 1];
  return match.persona;
}
