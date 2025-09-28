/**
 * 배열의 길이를 리턴
 * @param arr 대상 배열
 * @returns 배열의 길이를 리턴, undefined이거나 null이면 0
 */
export function size(arr: { length: number } | undefined | null): number {
  if (typeof arr === 'undefined' || arr === null) return 0;
  return arr.length;
}
