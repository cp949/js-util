import { createTypeGuard } from '../utils.js';

/** @category Type Guard */
export const isNull = createTypeGuard<null>((value) => value === null);
