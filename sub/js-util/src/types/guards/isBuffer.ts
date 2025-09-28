import { createTypeGuard } from '../utils.js';

/** @category Type Guard */
export const isBuffer = createTypeGuard<Buffer>(
  (value) => typeof Buffer !== 'undefined' && value instanceof Buffer,
);
