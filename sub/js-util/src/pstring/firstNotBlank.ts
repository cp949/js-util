import { trim } from './trim.js';

export function firstNotBlank(...strArr: (string | undefined | null)[]): string | undefined {
  if (typeof strArr === 'undefined') return undefined;
  if (strArr === null || strArr.length === 0) return undefined;
  const item = strArr.find((it) => it && trim(it).length > 0);
  return item ? item : undefined;
}
