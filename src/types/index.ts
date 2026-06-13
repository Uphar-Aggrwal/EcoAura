export interface QuestionnaireData {
  // Core emissions
  housing: 'apartment' | 'house-small' | 'house-large';
  transport: 'car-daily' | 'car-weekly' | 'public-transit' | 'cycling' | 'walking';
  flights: number;
  diet: 'omnivore-heavy' | 'omnivore-light' | 'pescatarian' | 'vegetarian' | 'vegan';
  energy: 'grid-heavy' | 'grid-mixed' | 'solar';
  
  // Psychographics
  shopping: 'fast-fashion' | 'quality-durability' | 'second-hand';
  techHabits: 'early-adopter' | 'repair-reuse' | 'minimalist';
  lifestyle: 'homebody' | 'frequent-traveler' | 'social-butterfly';
  motivation: 'cost' | 'convenience' | 'environment' | 'health';
}

export interface Persona {
  name: string;
  tagline: string;
  icon: string;
  ringColor: string;
  gradientFrom: string;
  gradientTo: string;
  emotionalLine: string;
  footprintTotalTCo2: number;
  footprintPercentOfAvg: number;
  breakdown: {
    transport: number;
    food: number;
    energy: number;
  };
  breakdownTCo2: {
    transport: number;
    food: number;
    energy: number;
  };
  source: 'gemini' | 'fallback' | 'calculated' | 'mock';
  customActions: { action: string; saving: string }[];
}

export interface Action {
  id: string;
  text: string;
  estimatedSavings: number;
  completed: boolean;
}
