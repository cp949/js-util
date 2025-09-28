import type { ValueValidator } from '../types.js';
import { createTypeGuard } from '../utils.js';

/**
 * @category Type Guard
 * @example
 *
 * ```typescript
 * // true, typed as any[]
 * isArray(['xyz']);
 *
 * // true, typed as string[]
 * isArray<string>(['xyz'], { valueValidator: isString });
 * ```
 */
export function isArray(input: unknown): input is any[];
export function isArray<T>(input: unknown, options: ValueValidator): input is T[];
export function isArray<T>(input: unknown, options?: ValueValidator): input is T[] {
  return createTypeGuard<T[], ValueValidator | undefined>(
    (value) =>
      Array.isArray(value) && (!options?.valueValidator || value.every(options.valueValidator)),
  )(input);
}
