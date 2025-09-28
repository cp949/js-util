import { createTypeGuard } from '../utils.js';

/**
 * Checks if the value is a URL object.
 * 
 * @category Type Guard
 * @example
 *
 * ```typescript
 * const url = new URL('https://example.com/path?query=value');
 * 
 * if (isURL(url)) {
 *   console.log(`Protocol: ${url.protocol}, hostname: ${url.hostname}`);
 * }
 * ```
 */
export function isURL(input: unknown): input is URL {
  return createTypeGuard<URL>(
    (value) => 
      typeof URL !== 'undefined' && 
      value instanceof URL
  )(input);
}