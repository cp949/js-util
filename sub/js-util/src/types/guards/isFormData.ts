import { createTypeGuard } from '../utils.js';

/**
 * Checks if the value is a FormData object.
 *
 * @category Type Guard
 * @example
 *
 * ```typescript
 * const formData = new FormData();
 * formData.append('username', 'john');
 *
 * if (isFormData(formData)) {
 *   console.log(`Username: ${formData.get('username')}`);
 * }
 * ```
 */
export function isFormData(input: unknown): input is FormData {
  return createTypeGuard<FormData>(
    (value) => typeof FormData !== 'undefined' && value instanceof FormData,
  )(input);
}
