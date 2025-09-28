/**
 * Check if a value is within two other values
 * @param value value to check
 * @param a first bounding value
 * @param b second bounding value
 */
export const within = (value: number, a: number, b: number): boolean => {
  return value >= Math.min(a, b) && value <= Math.max(a, b);
};
