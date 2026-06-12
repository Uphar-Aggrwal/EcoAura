export const INDIAN_AVERAGE_FOOTPRINT = 1.9;
export const MIN_FOOTPRINT = 0.8;
export const MAX_FOOTPRINT = 25.0;

export const COLORS = {
  lowEmission: { ring: '#66BB6A', gradient: ['#E8F5E9', '#B2DFDB'] },
  mediumEmission: { ring: '#FFA726', gradient: ['#FFF3E0', '#FFE0B2'] },
  highEmission: { ring: '#EF5350', gradient: ['#ECEFF1', '#CFD8DC'] },
};

export const BREAKPOINTS = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
};

export const TONE_MULTIPLIERS: Record<string, number> = {
  'car-daily': 2.8,
  'car-weekly': 0.9,
  'public-transit': 0.2,
  'cycling': 0.01,
  'walking': 0.0,
  'omnivore': 2.5,
  'pescatarian': 1.9,
  'vegetarian': 1.5,
  'vegan': 1.1,
  'grid-heavy': 2.2,
  'grid-mixed': 1.2,
  'solar': 0.3,
  'high-shopping': 1.5,
  'medium-shopping': 0.8,
  'low-shopping': 0.3,
};
