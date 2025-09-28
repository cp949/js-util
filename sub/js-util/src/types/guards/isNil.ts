import { isUnion } from '../utils.js';
import { isNull } from './isNull.js';
import { isUndefined } from './isUndefined.js';

/**
 * @remarks
 * Tests true for undefined and null, false for all other falsy values
 * @category Type Guard
 */
export const isNil = isUnion<null | undefined>(isNull, isUndefined);
