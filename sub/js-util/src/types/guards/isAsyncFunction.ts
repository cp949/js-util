import { createTypeGuard, toObjectString } from '../utils.js';

export type AsyncFunction<T = unknown> = (...args: any[]) => Promise<T>;

/**
 * @remarks
 * This guard works only in ES2018 and above
 * @category Type Guard
 */
export function isAsyncFunction<T = unknown>(input: unknown): input is AsyncFunction<T> {
  return createTypeGuard<AsyncFunction<T>>(
    (value) => typeof value === 'function' && toObjectString(value) === '[object AsyncFunction]',
  )(input);
}
