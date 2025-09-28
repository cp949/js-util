import { createTypeGuard, toObjectString } from '../utils.js';
import { isObject } from './isObject.js';

/** @category Type Guard */
export function isWeakMap<K extends object = any, V = unknown>(
  input: unknown,
): input is WeakMap<K, V> {
  return createTypeGuard<WeakMap<K, V>>(
    (value) =>
      value instanceof WeakMap || (isObject(value) && toObjectString(value) === '[object WeakMap]'),
  )(input);
}
