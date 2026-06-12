export interface FallbackPersonaBase {
  name: string;
  tagline: string;
  icon: string;
  ringColor: string;
  gradientFrom: string;
  gradientTo: string;
  emotionalLine: string;
  source: 'fallback';
  customActions: { action: string; saving: string }[];
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
      customActions: [
        { action: 'Start a small herb garden at home.', saving: '-0.1 t' },
        { action: 'Advocate for green energy in your community.', saving: '-0.2 t' },
        { action: 'Opt for zero-waste packaging for a month.', saving: '-0.1 t' }
      ]
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
      customActions: [
        { action: 'Switch to a green energy grid plan.', saving: '-0.5 t' },
        { action: 'Go meat-free 2 days a week.', saving: '-0.3 t' },
        { action: 'Start composting organic waste.', saving: '-0.1 t' }
      ]
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
      customActions: [
        { action: 'Commit to local, plant-based meals on weekends.', saving: '-0.4 t' },
        { action: 'Take public transit twice a week instead of driving.', saving: '-0.6 t' },
        { action: 'Use a smart thermostat to optimize energy.', saving: '-0.2 t' }
      ]
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
      emotionalLine: "Flying frequently puts you in the top 3% of Indian emitters. But your story isn't fixed.",
      source: 'fallback',
      customActions: [
        { action: 'Replace one domestic flight with a train journey.', saving: '-0.5 t' },
        { action: 'Offset your flights via verified carbon projects.', saving: '-1.0 t' },
        { action: 'Opt for direct flights rather than layovers.', saving: '-0.3 t' }
      ]
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
      customActions: [
        { action: 'Cut air travel by 20% this year.', saving: '-1.5 t' },
        { action: 'Adopt a pescatarian or vegetarian diet.', saving: '-0.8 t' },
        { action: 'Invest in solar panels for your home.', saving: '-2.0 t' }
      ]
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
      customActions: [
        { action: 'Switch entirely to a solar or green energy provider.', saving: '-2.5 t' },
        { action: 'Upgrade all home appliances to energy-efficient models.', saving: '-0.8 t' },
        { action: 'Carpool or use public transit for daily commutes.', saving: '-1.2 t' }
      ]
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
      customActions: [
        { action: 'Switch to an Electric Vehicle (EV) or hybrid.', saving: '-3.0 t' },
        { action: 'Work from home 2 additional days a week.', saving: '-1.0 t' },
        { action: 'Combine shopping and errand trips into one.', saving: '-0.4 t' }
      ]
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
      customActions: [
        { action: 'Reduce shopping consumption by buying second-hand.', saving: '-1.2 t' },
        { action: 'Commit to 3 meatless days every week.', saving: '-0.7 t' },
        { action: 'Offset your entire remaining footprint annually.', saving: '-5.0 t' }
      ]
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
      customActions: [
        { action: 'Replace all short-haul flights with digital meetings.', saving: '-4.0 t' },
        { action: 'Switch your home to 100% renewable energy.', saving: '-3.5 t' },
        { action: 'Transition to a low-impact plant-based diet.', saving: '-1.5 t' }
      ]
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
      customActions: [
        { action: 'Perform a comprehensive energy audit of your home.', saving: '-2.0 t' },
        { action: 'Dramatically reduce all non-essential air travel.', saving: '-5.0 t' },
        { action: 'Divest your financial portfolio from fossil fuels.', saving: '-10.0 t' }
      ]
    },
  },
];

export function getFallbackPersona(footprint: number): FallbackPersonaBase {
  const match = FALLBACK_PERSONAS.find(p => footprint <= p.max) ?? FALLBACK_PERSONAS[FALLBACK_PERSONAS.length - 1];
  return match.persona;
}
