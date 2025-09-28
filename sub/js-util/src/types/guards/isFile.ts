import { createTypeGuard } from '../utils.js';

/**
 * Checks if the value is a File object.
 * 
 * @category Type Guard
 * @example
 *
 * ```typescript
 * const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
 * const file = fileInput.files?.[0];
 * 
 * if (isFile(file)) {
 *   console.log(`File name: ${file.name}, size: ${file.size}`);
 * }
 * ```
 */
export function isFile(input: unknown): input is File {
  return createTypeGuard<File>(
    (value) => 
      typeof File !== 'undefined' && 
      value instanceof File
  )(input);
}