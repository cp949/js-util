import { createTypeGuard } from '../utils.js';

/**
 * Checks if the value is an ImageData object.
 * 
 * @category Type Guard
 * @example
 *
 * ```typescript
 * const canvas = document.createElement('canvas');
 * const ctx = canvas.getContext('2d');
 * const imageData = ctx?.getImageData(0, 0, 100, 100);
 * 
 * if (isImageData(imageData)) {
 *   // TypeScript knows imageData is ImageData
 *   console.log(`Image dimensions: ${imageData.width}x${imageData.height}`);
 * }
 * ```
 */
export function isImageData(input: unknown): input is ImageData {
  return createTypeGuard<ImageData>(
    (value) => 
      typeof ImageData !== 'undefined' && 
      value instanceof ImageData
  )(input);
}