/**
 * 배열에서 조건에 맞는 첫 번째 요소를 찾아 업데이트한 원본 배열을 반환합니다.
 *
 * @param array 배열
 * @param match 요소를 찾기 위한 조건을 정의하는 함수
 * @param updateFn 조건에 맞는 요소를 업데이트하는 함수
 * @returns 업데이트된 원본 배열을 반환합니다. 조건에 맞는 요소가 없으면 `null`을 반환합니다.
 */
export function replace<T>(
  array: T[],
  match: (item: T) => boolean,
  updateFn: (item: T, index: number) => T,
): T[] | null {
  const index = array.findIndex(match);
  if (index < 0) return null;
  array[index] = updateFn(array[index], index);
  return array;
}

/**
 * 배열에서 조건에 맞는 첫 번째 요소를 찾아 업데이트한 새 배열을 반환합니다.
 *
 * @param array 배열
 * @param match 요소를 찾기 위한 조건을 정의하는 함수
 * @param updateFn 조건에 맞는 요소를 업데이트하는 함수
 * @returns 업데이트된 배열을 반환합니다. 조건에 맞는 요소가 없으면 `null`을 반환합니다.
 */
export function $replace<T>(
  array: ReadonlyArray<T>,
  match: (item: T) => boolean,
  updateFn: (item: T, index: number) => T,
): T[] | null {
  const index = array.findIndex(match);
  if (index < 0) return null;
  const newArray = [...array];
  newArray[index] = updateFn(array[index], index);
  return newArray;
}
