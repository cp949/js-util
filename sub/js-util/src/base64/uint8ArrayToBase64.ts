import { encode } from './encode.js';
/**
 * Convert a Uint8Array to a base64 encoded string.
 * @param {Uint8Array} array - the array to convert.
 * @return {string} - the base64 encoded string.
 */
export function uint8ArrayToBase64(array: Uint8Array): string {
  const raw = array.reduce((data, byte: number) => {
    return data + String.fromCharCode(byte);
  }, '');

  return encode(raw);
}
