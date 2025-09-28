import { createTypeGuard, toObjectString } from '../utils.js';
import { isObject } from './isObject.js';

/** @category Type Guard */
export const isArrayBuffer = createTypeGuard<ArrayBuffer>(
  (value) =>
    isObject(value) &&
    (toObjectString(value) === '[object ArrayBuffer]' || value instanceof ArrayBuffer),
);
