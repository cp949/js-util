// https://github.com/MrPropre/base64-u8array-arraybuffer/blob/master/src/index.js
/**
 * Convert a base64 encoded string to a Uint8Array.
 * @param base64String - a base64 encoded string.
 * @return a decoded Uint8Array.
 */
export function base64ToUint8Array(base64String: string): Uint8Array {
  const rawStr = atob(base64String);
  const len = rawStr.length;
  const array = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    array[i] = rawStr.charCodeAt(i);
  }
  return array;
}
