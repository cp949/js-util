/**
 * 배열에 요소를 삽입한다.
 *
 * @param arr - 대상 배열
 * @param index - 삽입할 인덱스
 * @param items - 삽입할 요소들
 * @returns 전달된 배열
 */
export function insertAt<T>(arr: T[], index: number, items: T[]): T[] {
  if (items.length === 0) {
    return arr;
  }

  // Handle negative index
  if (index < 0) {
    index = Math.max(0, arr.length + index);
  }

  // Handle out of bounds index
  if (index > arr.length) {
    index = arr.length;
  }

  arr.splice(index, 0, ...items);
  return arr;
}

/**
 * 배열을 복제한 후 요소를 삽입한다.
 *
 * @param arr - 대상 배열
 * @param index - 삽입할 인덱스
 * @param items - 삽입할 요소들
 * @returns 복제된 배열
 */
export function $insertAt<T>(arr: ReadonlyArray<T>, index: number, items: ReadonlyArray<T>): T[] {
  const array = [...arr];

  // Handle negative index
  if (index < 0) {
    index = Math.max(0, arr.length + index);
  }

  // Handle out of bounds index
  if (index > arr.length) {
    index = arr.length;
  }

  array.splice(index, 0, ...items);
  return array;
}
