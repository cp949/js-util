import { createTypeGuard, toObjectString } from '../utils.js';
import { isObject } from './isObject.js';

/**
 * @category Type Guard
 * @example
 *
 * ```typescript
 * // true
 * isRegExp(new RegExp('somePattern'));
 *
 * // true
 * isRegExp(/somePattern/);
 * ```
 */
export const isRegExp = createTypeGuard<RegExp>(
  (value) =>
    isObject(value) && (toObjectString(value) === '[object RegExp]' || value instanceof RegExp),
);
