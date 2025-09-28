import { capitalize } from './capitalize.js';

/**
 * Capitalizes and joins all [parts].
 */
export function pascalCase(...parts: string[]): string {
  return parts.map((part) => capitalize(part.toLowerCase())).join('');
}
