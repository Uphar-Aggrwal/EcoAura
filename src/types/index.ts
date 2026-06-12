export interface QuestionnaireData {
  transport: 'car-daily' | 'car-weekly' | 'public-transit' | 'cycling' | 'walking';
  transportFreq: number;
  diet: 'omnivore' | 'pescatarian' | 'vegetarian' | 'vegan';
  energy: 'grid-heavy' | 'grid-mixed' | 'solar';
  shopping: 'high' | 'medium' | 'low';
  flights: number;
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
}

export interface Action {
  id: string;
  text: string;
  estimatedSavings: number;
  completed: boolean;
}
