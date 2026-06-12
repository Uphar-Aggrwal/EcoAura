import { calculateAnnualFootprint, calculatePercentOfAverage } from '../lib/carbon-calculator';

describe('calculateAnnualFootprint', () => {
  it('should calculate footprint for omnivore commuter', () => {
    const result = calculateAnnualFootprint({
      transport: 'car-daily',
      transportFreq: 100,
      diet: 'omnivore',
      energy: 'grid-mixed',
      shopping: 'high',
      flights: 3,
    });
    expect(result).toBeGreaterThan(8);
  });

  it('should calculate footprint for eco-conscious user', () => {
    const result = calculateAnnualFootprint({
      transport: 'cycling',
      transportFreq: 0,
      diet: 'vegan',
      energy: 'solar',
      shopping: 'low',
      flights: 0,
    });
    expect(result).toBeLessThan(2);
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
