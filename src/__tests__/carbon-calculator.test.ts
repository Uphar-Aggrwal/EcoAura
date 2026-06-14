import { calculateAnnualFootprint, calculatePercentOfAverage } from '../lib/carbon-calculator';

describe('calculateAnnualFootprint', () => {
  it('should calculate footprint for omnivore commuter', () => {
    const result = calculateAnnualFootprint({
      housing: 'house-large',
      transport: 'car-daily',
      diet: 'omnivore-heavy',
      energy: 'grid-heavy',
      shopping: 'fast-fashion',
      flights: 3,
      techHabits: 'early-adopter',
      lifestyle: 'frequent-traveler',
      motivation: 'convenience'
    });
    expect(result).toBeGreaterThan(8);
  });

  it('should calculate footprint for eco-conscious user', () => {
    const result = calculateAnnualFootprint({
      housing: 'apartment',
      transport: 'cycling',
      diet: 'vegan',
      energy: 'solar',
      shopping: 'second-hand',
      flights: 0,
      techHabits: 'minimalist',
      lifestyle: 'homebody',
      motivation: 'environment'
    });
    // Expected footprint calculation: 
    // Transport: 0 + 0 = 0
    // Diet: 1.1
    // Energy & Housing: 0.3 * 0.8 = 0.24
    // Shopping & Tech: 0.3 + 0.2 = 0.5
    // Lifestyle: 0.5
    // Total = 0 + 1.1 + 0.24 + 0.5 + 0.5 = 2.34
    expect(result).toBeLessThan(3.0);
  });
});

describe('calculatePercentOfAverage', () => {
  it('should return 100 for Indian average', () => {
    expect(calculatePercentOfAverage(1.9)).toBe(100);
  });

  it('should return 526 for 10 t CO₂e', () => {
    expect(calculatePercentOfAverage(10)).toBe(526);
  });
});
