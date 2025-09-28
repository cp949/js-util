/**
 * 배열이 비어 있는지 체크하는 함수
 * @param arr 대상 배열
 * @returns 배열에 요소가 없거나 undefined인 경우 true를 리턴, 그렇지 않으면 false를 리턴
 */
export function isEmpty(arr: { length: number } | undefined | null): boolean {
  if (typeof arr === 'undefined' || arr === null) return true;
  return arr.length === 0;
}
