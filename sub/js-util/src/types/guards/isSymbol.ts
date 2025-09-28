import { createTypeGuard } from '../utils.js';

/** @category Type Guard */
export const isSymbol = createTypeGuard<symbol>((value) => typeof value === 'symbol');
