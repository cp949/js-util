import { createTypeGuard } from '../utils.js';
import { isObject } from './isObject.js';
import { isString } from './isString.js';

/**
 * @remarks
 * This guard tests for Symbol.iterator, which defines the Iterable protocol.
 * See:
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols}
 * @category Type Guard
 */
export function isIterable<T = unknown>(input: unknown): input is Iterable<T> {
  return createTypeGuard<Iterable<T>>(
    (value) =>
      (isObject(value) && typeof Reflect.get(value, Symbol.iterator) === 'function') ||
      isString(value),
  )(input);
}
