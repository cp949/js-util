/**
 * A wrapper around Number#toFixed, which contrary to native method returns number, not string.
 */
export function toFixed(value: number | string, fractionDigits: number): number {
  if (typeof value === 'number') {
    return +value.toFixed(fractionDigits);
  }
  return +Number(value).toFixed(fractionDigits);
}
