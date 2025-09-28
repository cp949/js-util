import { base64ToUint8Array } from './base64ToUint8Array.js';

export function base64ToArrayBuffer(base64String: string): ArrayBuffer {
  const uint8Arr = base64ToUint8Array(base64String);
  return uint8Arr.buffer as ArrayBuffer;
}
