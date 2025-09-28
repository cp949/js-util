import type { TypedGeneratorFunction } from '../types.js';
import { createTypeGuard, toObjectString } from '../utils.js';

/** @category Type Guard */
export function isGeneratorFunction<Y = unknown, R = unknown, N = unknown>(
  input: unknown,
): input is TypedGeneratorFunction<Y, R, N> {
  return createTypeGuard<TypedGeneratorFunction<Y, R, N>>(
    (value) =>
      typeof value === 'function' && toObjectString(value) === '[object GeneratorFunction]',
  )(input);
}
