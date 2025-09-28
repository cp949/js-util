import { createTypeGuard, toObjectString } from '../utils.js';
import { isObject } from './isObject.js';

/** @category Type Guard */
export const isSharedArrayBuffer = createTypeGuard<SharedArrayBuffer>(
  (value) =>
    isObject(value) &&
    (toObjectString(value) === '[object SharedArrayBuffer]' || value instanceof SharedArrayBuffer),
);
