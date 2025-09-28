/**
 * Normalize a value within a range.
 * @param n the value to normalize
 * @param a range value 1
 * @param b range value 1
 */
export function normalizeValue(n: number, a: number, b: number): number {
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  return (n - min) / (max - min);
}
