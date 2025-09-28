/**
 * 배열에 요소가 존재하는지 체크하는 함수
 * @param arr 대상 배열
 * @returns 배열에 요소가 존재하면 true를 리턴, 요소가 없거나 undefined인 경우 false를 리턴
 */
export function isNotEmpty(arr: { length: number } | null | undefined): boolean {
  if (typeof arr === 'undefined' || arr === null) return false;
  return arr.length > 0;
}
