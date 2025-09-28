import { isDefined } from './isDefined.js';
import { isNotNull } from './isNotNull.js';

/**
 * @remarks
 * Tests false for undefined and null, true for all other values
 * @category Type Guard
 */
export function isNotNil<T>(input: T | undefined | null): input is NonNullable<T> {
  return isDefined(input) && isNotNull(input);
}
