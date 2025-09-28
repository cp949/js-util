import { queryParam } from './queryParam.js';

export function queryParamAsNumber(
  value: string | string[] | null | undefined,
  defaultValue: number,
): number {
  const v = queryParam(value);
  if (typeof v === 'undefined' || v.length === 0) {
    return defaultValue;
  }
  const num = Number(v);
  return isNaN(num) ? defaultValue : num;
}
