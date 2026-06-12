import { getFallbackPersona } from '../lib/persona-fallback';

describe('getFallbackPersona', () => {
  it('should map low footprint to Carbon Minimalist', () => {
    const persona = getFallbackPersona(1.5);
    expect(persona.name).toBe('Carbon Minimalist');
  });

  it('should map high footprint to Sky Rider', () => {
    const persona = getFallbackPersona(9.0);
    expect(persona.name).toBe('Sky Rider');
  });

  it('should map ultra-high footprint to Carbon Colossus', () => {
    const persona = getFallbackPersona(25.0);
    expect(persona.name).toBe('Carbon Colossus');
  });
});
