/**
 * Turns a kebab-case string into a constant case string.
 */
export function kebabToConstant(input: string): string {
  return input
    .split('-')
    .map((part) => part.toUpperCase())
    .join('_');
}
