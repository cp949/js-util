/**
 * Makes the first letter of [str] lowercase.
 * Not locale aware.
 */
export function capitalize(str: string): string {
  return str.length > 0 ? str[0].toUpperCase() + str.slice(1) : '';
}
