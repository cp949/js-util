import { createTypeGuard } from '../utils.js';

/**
 * @category Type Guard
 * @example
 *
 * ```typescript
 * // true
 * isString('xyz');
 *
 * // false
 * isString(new String('xyz'));
 * ```
 */
export const isString = createTypeGuard<string>((value) => typeof value === 'string');
