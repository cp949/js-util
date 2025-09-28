import { createTypeGuard } from '../utils.js';

/**
 * Checks if the value is a Blob object.
 *
 * @category Type Guard
 * @example
 *
 * ```typescript
 * const blob = new Blob(['hello world'], { type: 'text/plain' });
 *
 * if (isBlob(blob)) {
 *   console.log(`Blob type: ${blob.type}, size: ${blob.size}`);
 * }
 * ```
 */
export function isBlob(input: unknown): input is Blob {
  return createTypeGuard<Blob>((value) => typeof Blob !== 'undefined' && value instanceof Blob)(
    input,
  );
}
