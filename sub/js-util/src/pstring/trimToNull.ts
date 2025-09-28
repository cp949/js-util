import { trim } from './trim.js';

export function trimToNull(str: string | undefined | null): string | null {
  const text = trim(str);
  return text.length == 0 ? null : text;
}
