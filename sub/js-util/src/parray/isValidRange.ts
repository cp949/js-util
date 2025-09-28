/**
 * 배열의 인덱스가 유효한지 체크합니다.
 * @param arr - 대상 배열
 * @param startIndex - 시작 인덱스
 * @param endIndex - 마지막 인덱스
 * @returns 인덱스 범위가 유효한 경우 true, 그렇지 않은 경우 false를 리턴합니다.
 */
export function isValidRange(
  arr: { length: number },
  startIndex: number,
  endIndex: number,
): boolean {
  return (
    startIndex < 0 || startIndex > arr.length || startIndex >= endIndex || endIndex > arr.length
  );
}
