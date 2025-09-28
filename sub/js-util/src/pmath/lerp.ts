/**
 * Calculate linear interpolation between 2 values.
 * @param a start value
 * @param b end value
 * @param t an interpolation value, usually between 0 to 1
 */
export function lerp(a: number, b: number, t: number): number {
  return (1 - t) * a + t * b;
}
