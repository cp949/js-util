import { wrapIndexArray } from '../pmath/wrap.js';

export function at<T>(array: ArrayLike<T>, index: number, wrap = false): T {
  const idx = wrap ? wrapIndexArray(index, array) : index;
  return array[idx];
}
