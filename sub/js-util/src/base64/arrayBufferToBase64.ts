import { uint8ArrayToBase64 } from './uint8ArrayToBase64.js';

/**
 * Convert a ArrayBuffer to a base64 encoded string.
 * @param {ArrayBuffer} array - the array to convert.
 * @return {string} - the base64 encoded string.
 */
export function arrayBufferToBase64(array: ArrayBuffer): string {
  return uint8ArrayToBase64(new Uint8Array(array));
}
