import { QuestionnaireData } from '@/types';
import { INDIAN_AVERAGE_FOOTPRINT } from './constants';

export function calculateAnnualFootprint(data: QuestionnaireData): number {
  let total = 0;

  const transportEmissions: Record<string, number> = {
    'car-daily': 0.25 * 52,
    'car-weekly': 0.08 * 52,
    'public-transit': 0.02 * 52,
    'cycling': 0.0,
    'walking': 0.0,
  };
  total += transportEmissions[data.transport] || 0;

  total += data.flights * 0.5;

  const dietEmissions: Record<string, number> = {
    'omnivore': 2.5,
    'pescatarian': 1.9,
    'vegetarian': 1.5,
    'vegan': 1.1,
  };
  total += dietEmissions[data.diet] || 2.5;

  const energyEmissions: Record<string, number> = {
    'grid-heavy': 2.2,
    'grid-mixed': 1.2,
    'solar': 0.3,
  };
  total += energyEmissions[data.energy] || 1.2;

  const shoppingEmissions: Record<string, number> = {
    'high': 1.5,
    'medium': 0.8,
    'low': 0.3,
  };
  total += shoppingEmissions[data.shopping] || 0.8;

  return Math.round(total * 10) / 10;
}

export function calculateBreakdown(data: QuestionnaireData, total: number) {
  const transportEmissions: Record<string, number> = {
    'car-daily': 0.25 * 52,
    'car-weekly': 0.08 * 52,
    'public-transit': 0.02 * 52,
    'cycling': 0.0,
    'walking': 0.0,
  };
  const dietEmissions: Record<string, number> = {
    'omnivore': 2.5,
    'pescatarian': 1.9,
    'vegetarian': 1.5,
    'vegan': 1.1,
  };
  const energyEmissions: Record<string, number> = {
    'grid-heavy': 2.2,
    'grid-mixed': 1.2,
    'solar': 0.3,
  };

  const tTransport = (transportEmissions[data.transport] || 0) + data.flights * 0.5;
  const tFood = dietEmissions[data.diet] || 2.5;
  const tEnergy = energyEmissions[data.energy] || 1.2;

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
