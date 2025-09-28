import { trim } from './trim.js';

export function trimToUndefined(str: string | undefined | null): string | undefined {
  const text = trim(str);
  return text.length == 0 ? undefined : text;
}

export function trimToUndef(str: string | undefined | null): string | undefined {
  const text = trim(str);
  return text.length == 0 ? undefined : text;
}
