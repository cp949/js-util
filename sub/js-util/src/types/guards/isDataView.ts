import { createTypeGuard, toObjectString } from '../utils.js';
import { isObject } from './isObject.js';

/** @category Type Guard */
export const isDataView = createTypeGuard<DataView>(
  (value) =>
    isObject(value) && (toObjectString(value) === '[object DataView]' || value instanceof DataView),
);
