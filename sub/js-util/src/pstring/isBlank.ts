import { trim } from './trim.js';

export function isBlank(str: string | undefined | null): str is undefined | null {
  return trim(str).length === 0;
}
