/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import { createTypeGuard, toObjectString } from '../utils.js';
import { isObject } from './isObject.js';

/**
 * @category Type Guard
 * @example
 *
 * ```typescript
 * // true
 * isStringObject(new String('xyz'));
 *
 * // false
 * isStringObject('xyz');
 * ```
 */
export const isStringObject = createTypeGuard<String>(
  (value) =>
    isObject(value) && (toObjectString(value) === '[object String]' || value instanceof String),
);
