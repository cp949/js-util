import { createTypeGuard } from '../utils.js';
import { isString } from './isString.js';

/**
 * Checks if the value is a valid email string (basic validation).
 *
 * @category Type Guard
 * @example
 *
 * ```typescript
 * const userEmail = 'user@example.com';
 *
 * if (isEmail(userEmail)) {
 *   // TypeScript knows userEmail is a string with valid email format
 *   console.log(`Sending email to: ${userEmail}`);
 * }
 * ```
 */
export function isEmail(input: unknown): input is string {
  return createTypeGuard<string>((value) => {
    if (!isString(value)) return false;

    // Basic email regex - matches most common email formats
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  })(input);
}
