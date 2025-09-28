import { createTypeGuard, toObjectString } from '../utils.js';
import { isObject } from './isObject.js';

/** @category Type Guard */
export const isDate = createTypeGuard<Date>(
  (value) =>
    isObject(value) && (toObjectString(value) === '[object Date]' || value instanceof Date),
);
