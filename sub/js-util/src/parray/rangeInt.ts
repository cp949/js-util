/**
 * @deprecated use arrayOf()
 * Create an integer array
 * Value after decimal point is truncated.
 * @param count
 */
export function rangeInt(count: number): number[] {
  count = Math.round(count);

  if (count === 0) {
    return [];
  }

  const keys = Array(count).keys();
  return Array.from(keys).map((x) => x);
}
