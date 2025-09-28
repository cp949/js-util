/**
 * create random integer array
 * 2 <= randomIntInclusiveEnd(2, 5) <= 5
 *
 * @param min - min value
 * @param max - max value
 * @param exclusiveEnd - exclusive end
 */
export function randomInt(min: number, max: number, exclusiveEnd = false): number {
  let a = min;
  let b = max;
  if (a > b) {
    const c = a;
    a = b;
    b = c;
  }
  const range = exclusiveEnd ? b - a : b - a + 1; // 5 - 2 + 1 = 4
  return Math.floor(Math.random() * range) + a; // [0,1,2,3] + 2 = [2,3,4,5]
}
