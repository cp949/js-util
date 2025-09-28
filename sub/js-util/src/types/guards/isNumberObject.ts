/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import { createTypeGuard, toObjectString } from '../utils.js';
import { isObject } from './isObject.js';

/**
 * @category Type Guard
 * @example
 *
 * ```typescript
 * // true
 * isNumberObject(new Number(1));
 *
 * // false
 * isNumberObject(1);
 * ```
 */
export const isNumberObject = createTypeGuard<Number>(
  (value) =>
    isObject(value) && (toObjectString(value) === '[object Number]' || value instanceof Number),
);
