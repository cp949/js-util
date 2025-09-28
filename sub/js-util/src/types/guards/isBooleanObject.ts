/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import { createTypeGuard, toObjectString } from '../utils.js';
import { isObject } from './isObject.js';

/**
 * @category Type Guard
 * @example
 *
 * ```typescript
 * // true
 * isBooleanObject(new Boolean(true));
 *
 * // false
 * isBooleanObject(true);
 * ```
 */
export const isBooleanObject = createTypeGuard<Boolean>(
  (value) =>
    isObject(value) && (toObjectString(value) === '[object Boolean]' || value instanceof Boolean),
);
