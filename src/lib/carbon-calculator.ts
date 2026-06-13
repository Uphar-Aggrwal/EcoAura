import { QuestionnaireData } from '@/types';
import { INDIAN_AVERAGE_FOOTPRINT } from './constants';

export function calculateAnnualFootprint(data: QuestionnaireData): number {
  let total = 0;

  // 1. Transport
  const transportEmissions: Record<string, number> = {
    'car-daily': 0.25 * 52,
    'car-weekly': 0.08 * 52,
    'public-transit': 0.02 * 52,
    'cycling': 0.0,
    'walking': 0.0,
  };
  total += transportEmissions[data.transport] || 0;
  total += data.flights * 0.5;

  // 2. Diet
  const dietEmissions: Record<string, number> = {
    'omnivore-heavy': 3.3,
    'omnivore-light': 2.5,
    'pescatarian': 1.9,
    'vegetarian': 1.5,
    'vegan': 1.1,
  };
  total += dietEmissions[data.diet] || 2.5;

  // 3. Energy & Housing
  const energyEmissions: Record<string, number> = {
    'grid-heavy': 2.2,
    'grid-mixed': 1.2,
    'solar': 0.3,
  };
  const housingMultipliers: Record<string, number> = {
    'apartment': 0.8,
    'house-small': 1.0,
    'house-large': 1.5,
  };
  const baseEnergy = energyEmissions[data.energy] || 1.2;
  const housingMult = housingMultipliers[data.housing] || 1.0;
  total += baseEnergy * housingMult;

  // 4. Shopping & Goods
  const shoppingEmissions: Record<string, number> = {
    'fast-fashion': 1.5,
    'quality-durability': 0.8,
    'second-hand': 0.3,
  };
  const techEmissions: Record<string, number> = {
    'early-adopter': 1.2,
    'repair-reuse': 0.5,
    'minimalist': 0.2,
  };
  total += shoppingEmissions[data.shopping] || 0.8;
  total += techEmissions[data.techHabits] || 0.5;

  // 5. Lifestyle Overhead
  const lifestyleEmissions: Record<string, number> = {
    'homebody': 0.5,
    'social-butterfly': 1.0,
    'frequent-traveler': 1.5,
  };
  total += lifestyleEmissions[data.lifestyle] || 1.0;

  return Math.round(total * 10) / 10;
}

export function calculateBreakdown(data: QuestionnaireData, total: number) {
  const tTransport = 
    (data.transport === 'car-daily' ? 13 : data.transport === 'car-weekly' ? 4.16 : data.transport === 'public-transit' ? 1.04 : 0) + 
    data.flights * 0.5 + 
    (data.lifestyle === 'frequent-traveler' ? 0.5 : 0);

  const tFood = 
    (data.diet === 'omnivore-heavy' ? 3.3 : data.diet === 'omnivore-light' ? 2.5 : data.diet === 'pescatarian' ? 1.9 : data.diet === 'vegetarian' ? 1.5 : 1.1) +
    (data.lifestyle === 'social-butterfly' ? 0.3 : 0);

  // Everything else goes to energy/goods
  let tEnergy = total - tTransport - tFood;
  if (tEnergy < 0) tEnergy = 0;

  const transportPct = total > 0 ? Math.round((tTransport / total) * 100) : 33;
  const foodPct = total > 0 ? Math.round((tFood / total) * 100) : 33;
  const energyPct = 100 - transportPct - foodPct;

  return {
    percentages: { transport: transportPct, food: foodPct, energy: energyPct },
    tonnes: { transport: Math.round(tTransport * 10) / 10, food: Math.round(tFood * 10) / 10, energy: Math.round(tEnergy * 10) / 10 },
  };
}

export function calculatePercentOfAverage(footprint: number): number {
  return Math.round((footprint / INDIAN_AVERAGE_FOOTPRINT) * 100);
}
