import { createTypeGuard, toObjectString } from '../utils.js';
import { isObject } from './isObject.js';

/** @category Type Guard */
export function isWeakSet<T extends object = any>(input: unknown): input is WeakSet<T> {
  return createTypeGuard<WeakSet<T>>(
    (value) =>
      value instanceof WeakSet || (isObject(value) && toObjectString(value) === '[object WeakSet]'),
  )(input);
}
