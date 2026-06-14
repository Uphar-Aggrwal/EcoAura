import { calculateAnnualFootprint, calculatePercentOfAverage } from './carbon-calculator';
import { QuestionnaireData } from '@/types';

describe('Carbon Calculator', () => {
  const mockData: QuestionnaireData = {
    housing: 'house-large',
    transport: 'car-daily',
    flights: 2,
    diet: 'omnivore-heavy',
    energy: 'grid-heavy',
    shopping: 'fast-fashion',
    techHabits: 'early-adopter',
    lifestyle: 'frequent-traveler',
    motivation: 'environment'
  };

  it('calculates the correct annual footprint for a high emitter', () => {
    const footprint = calculateAnnualFootprint(mockData);
    expect(typeof footprint).toBe('number');
    expect(footprint).toBeGreaterThan(15);
  });

  it('calculates the correct percentage relative to the Indian average', () => {
    const percentage = calculatePercentOfAverage(1.9); // Indian average is 1.9
    expect(percentage).toBe(100);
  });
});
