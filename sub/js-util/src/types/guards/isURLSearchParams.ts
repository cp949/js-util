import { createTypeGuard } from '../utils.js';

/**
 * Checks if the value is a URLSearchParams object.
 *
 * @category Type Guard
 * @example
 *
 * ```typescript
 * const params = new URLSearchParams('?name=john&age=30');
 *
 * if (isURLSearchParams(params)) {
 *   console.log(`Name: ${params.get('name')}`);
 * }
 * ```
 */
export function isURLSearchParams(input: unknown): input is URLSearchParams {
  return createTypeGuard<URLSearchParams>(
    (value) => typeof URLSearchParams !== 'undefined' && value instanceof URLSearchParams,
  )(input);
}
