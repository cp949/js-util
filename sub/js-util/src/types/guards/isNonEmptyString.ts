import { createTypeGuard } from '../utils.js';
import { isString } from './isString.js';

/**
 * Checks if the value is a non-empty string.
 *
 * @category Type Guard
 * @example
 *
 * ```typescript
 * const userInput = getUserInput();
 *
 * if (isNonEmptyString(userInput)) {
 *   // TypeScript knows userInput is string with length > 0
 *   console.log(`First character: ${userInput[0]}`);
 * }
 * ```
 */
export function isNonEmptyString(input: unknown): input is string {
  return createTypeGuard<string>((value) => isString(value) && value.length > 0)(input);
}
