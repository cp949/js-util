import { createTypeGuard } from '../utils.js';

/** @category Type Guard */
export const isUndefined = createTypeGuard<undefined>((value) => value === undefined);
