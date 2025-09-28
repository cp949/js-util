/**
 * Makes the first letter of [str] uppercase.
 * Not locale aware.
 */
export function uncapitalize(str: string): string {
  return str.length > 0 ? str[0].toLowerCase() + str.slice(1) : '';
}
