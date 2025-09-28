import { uncapitalize } from './uncapitalize.js';
import { pascalCase } from './pascalCase.js';

/**
 * Joins all [parts] and camelcases the result
 */
export function camelCase(...parts: string[]): string {
  // Filter out empty strings first
  const nonEmptyParts = parts.filter((part) => part.length > 0);

  if (nonEmptyParts.length === 0) {
    return '';
  }

  if (nonEmptyParts.length === 1) {
    return uncapitalize(nonEmptyParts[0].toLowerCase());
  }

  const [first, ...rest] = nonEmptyParts;
  return uncapitalize(first.toLowerCase()) + pascalCase(...rest);
}
