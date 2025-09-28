import { createTypeGuard } from '../utils.js';
import { isObject } from './isObject.js';

/**
 * @remarks
 * Works with custom promises as well, e.g. AxiosPromise or Bluebird
 * @category Type Guard
 */
export function isPromise<T = unknown>(input: unknown): input is Promise<T> {
  return createTypeGuard<Promise<T>>(
    (value) =>
      value instanceof Promise ||
      (isObject(value) && typeof Reflect.get(value, 'then') === 'function'),
  )(input);
}
