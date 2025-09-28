import type { ValueValidator } from '../types.js';
import { createTypeGuard, toObjectString } from '../utils.js';
import { isObject } from './isObject.js';

/**
 * @category Type Guard
 * @example
 *
 * ```typescript
 * // true, value is typed as Set<any>
 * isSet(new Set(['xyz']));
 *
 * // true, value is typed as Set<string>
 * isSet<string>(new Set(['xyz']), { valueValidator: isString });
 * ```
 */
export function isSet(input: unknown): input is Set<any>;
export function isSet<T>(input: unknown, options: ValueValidator): input is Set<T>;
export function isSet<T>(input: unknown, options?: ValueValidator): input is Set<T> {
  return createTypeGuard<Set<T>, ValueValidator | undefined>(
    (value) =>
      isObject(value) &&
      (toObjectString(value) === '[object Set]' || value instanceof Set) &&
      (!options?.valueValidator || [...(value as Set<any>)].every(options.valueValidator)),
  )(input);
}
