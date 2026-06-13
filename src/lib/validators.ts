export function sanitizeInput(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

export function validateQuestionnaireData(data: unknown): boolean {
  const required = ['housing', 'transport', 'diet', 'energy', 'shopping', 'flights', 'techHabits', 'lifestyle', 'motivation'];
  if (typeof data !== 'object' || !data) return false;
  const obj = data as Record<string, unknown>;
  return required.every(key => key in obj);
}

export function clampFootprint(value: number, min = 0.8, max = 25.0): number {
  return Math.max(min, Math.min(max, value));
}
