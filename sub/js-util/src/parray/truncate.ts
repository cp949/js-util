/**
 * 배열의 크기가 지정된 maxSize보다 크면 maxSize로 자르는 함수
 *
 * @param arr - 대상 배열
 * @param maxSize - 최대 크기
 * @returns - 자른 배열
 */
export function truncate<T>(arr: T[], maxSize: number): T[] {
  if (arr.length > maxSize) {
    arr.length = maxSize; // 원본 배열의 길이만 변경
    return arr;
  }
  return arr;
}

/**
 * 배열의 크기가 지정된 maxSize보다 크면 maxSize로 자르는 함수
 * maxSize보다 작아도 복제본 배열을 리턴합니다.
 *
 * @param arr - 대상 배열
 * @param maxSize - 최대 크기
 * @returns - 자른 복제본 배열
 */
export function $truncate<T>(arr: ReadonlyArray<T>, maxSize: number): T[] {
  if (arr.length > maxSize) {
    return arr.slice(0, maxSize); // 새로운 배열 반환
  } else {
    return [...arr];
  }
}
