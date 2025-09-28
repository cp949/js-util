import type { ValueValidator } from '../types.js';
import { createTypeGuard } from '../utils.js';
import { isArray } from './isArray.js';

/**
 * Checks if the value is a non-empty array.
 * 
 * @category Type Guard
 * @example
 *
 * ```typescript
 * const items = ['a', 'b', 'c'];
 * 
 * if (isNonEmptyArray(items)) {
 *   // TypeScript knows items.length > 0
 *   console.log(`First item: ${items[0]}`);
 * }
 * 
 * // With value validator
 * if (isNonEmptyArray<string>(items, { valueValidator: isString })) {
 *   // TypeScript knows items is string[] with length > 0
 * }
 * ```
 */
export function isNonEmptyArray(input: unknown): input is [unknown, ...unknown[]];
export function isNonEmptyArray<T>(
  input: unknown, 
  options: ValueValidator
): input is [T, ...T[]];
export function isNonEmptyArray<T>(
  input: unknown, 
  options?: ValueValidator
): input is [T, ...T[]] {
  return createTypeGuard<[T, ...T[]], ValueValidator | undefined>(
    (value) => 
      isArray(value, options as any) && value.length > 0
  )(input);
}