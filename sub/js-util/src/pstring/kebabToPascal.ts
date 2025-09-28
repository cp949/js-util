import { capitalize } from './capitalize.js';

/**
 * Turns a kebab-case string into a PascalCase string.
 */
export function kebabToPascal(input: string): string {
  return input
    .split('-')
    .map((part) => capitalize(part))
    .join('');
}
