import { isUnion } from '../utils.js';
import { isArrayBuffer } from './isArrayBuffer.js';
import { isSharedArrayBuffer } from './isSharedArrayBuffer.js';

/** @category Type Guard */
export const isAnyArrayBuffer = isUnion<ArrayBuffer | SharedArrayBuffer>(
  isArrayBuffer,
  isSharedArrayBuffer,
);
