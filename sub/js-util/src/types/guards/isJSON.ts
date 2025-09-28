import { createTypeGuard } from '../utils.js';
import { isString } from './isString.js';

/**
 * Checks if the value is a valid JSON string.
 * 
 * @category Type Guard
 * @example
 *
 * ```typescript
 * const jsonString = '{"name": "John", "age": 30}';
 * 
 * if (isJSON(jsonString)) {
 *   const parsed = JSON.parse(jsonString);
 *   console.log(`Name: ${parsed.name}`);
 * }
 * ```
 */
export function isJSON(input: unknown): input is string {
  return createTypeGuard<string>(
    (value) => {
      if (!isString(value)) return false;
      
      try {
        JSON.parse(value);
        return true;
      } catch {
        return false;
      }
    }
  )(input);
}