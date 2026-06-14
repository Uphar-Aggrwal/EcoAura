import { sanitizeInput, validateQuestionnaireData, clampFootprint } from '../lib/validators';

describe('validators', () => {
  describe('sanitizeInput', () => {
    it('should strip HTML tags from input strings', () => {
      expect(sanitizeInput('<script>alert("hack")</script>hello')).toBe('alert("hack")hello');
      expect(sanitizeInput('<div>test</div>')).toBe('test');
    });
  });

  describe('validateQuestionnaireData', () => {
    it('should validate complete questionnaire data', () => {
      const valid = {
        housing: 'apartment',
        transport: 'walking',
        flights: 0,
        diet: 'vegan',
        energy: 'solar',
        shopping: 'second-hand',
        techHabits: 'minimalist',
        lifestyle: 'homebody',
        motivation: 'environment'
      };
      expect(validateQuestionnaireData(valid)).toBe(true);
    });

    it('should reject incomplete questionnaire data', () => {
      const invalid = {
        transport: 'walking',
        flights: 0,
      };
      expect(validateQuestionnaireData(invalid)).toBe(false);
    });
  });

  describe('clampFootprint', () => {
    it('should clamp footprint between min and max bounds', () => {
      expect(clampFootprint(0.2)).toBe(0.8);
      expect(clampFootprint(30.0)).toBe(25.0);
      expect(clampFootprint(5.5)).toBe(5.5);
    });
  });
});
