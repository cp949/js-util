/**
 * 배열의 첫 번째 요소를 반환합니다.
 *
 * @param array 배열
 * @returns 배열의 첫 번째 요소. 배열이 비어 있으면 `undefined`를 반환합니다.
 */
export function firstOne<T>(array: ReadonlyArray<T>): T | undefined {
  return array[0]; // 첫 번째 요소를 바로 반환
}

/**
 * 배열의 처음 n개의 요소를 반환합니다.
 * 기본값은 1개입니다.
 * 배열의 길이가 n보다 작으면 배열의 모든 요소를 반환합니다.
 *
 * @param array 배열
 * @param n 반환할 요소의 개수 (기본값: 1)
 * @returns 처음 n개의 요소를 포함하는 배열. 배열의 길이가 n보다 작으면 배열의 모든 요소를 반환합니다.
 */
export function first<T>(array: ReadonlyArray<T>, n: number = 1): T[] {
  return array.slice(0, n); // 배열을 슬라이스하여 처음 n개의 요소만 반환
}
