export function firstNotNullish<T>(...arr: (T | undefined | null)[]): T | undefined {
  if (typeof arr === 'undefined') return undefined;
  if (arr === null || arr.length === 0) return undefined;
  const result = arr.find((it) => it !== null && it !== undefined);
  return result === null ? undefined : result;
}
