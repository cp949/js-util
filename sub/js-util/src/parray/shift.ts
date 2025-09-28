/**
 * 배열을 왼쪽으로 회전시킵니다.
 * 앞에서 요소를 제거하고 뒤에 추가하는 작업을 `count` 횟수만큼 반복합니다.
 * 원본 배열이 직접 수정됩니다.
 *
 * @param array - 회전할 배열
 * @param count - 왼쪽으로 회전할 횟수 (기본값: 1)
 * @returns 회전된 배열 (원본 배열이 변경됨)
 *
 * @example
 * shiftRotateLeft([1, 2, 3, 4], 1); // [2, 3, 4, 1]
 */
export function shiftRotateLeft<T>(array: T[], count = 1): T[] {
  for (let i = 0; i < count; i++) {
    const elem = array.shift() as T;
    array.push(elem);
  }
  return array;
}

/**
 * 배열을 왼쪽으로 회전시키되, 원본을 변경하지 않고 새로운 배열을 반환합니다.
 *
 * @param array - 회전할 읽기 전용 배열
 * @param count - 왼쪽으로 회전할 횟수 (기본값: 1)
 * @returns 회전된 새로운 배열
 *
 * @example
 * $shiftRotateLeft([1, 2, 3, 4], 1); // [2, 3, 4, 1]
 */
export function $shiftRotateLeft<T>(array: ReadonlyArray<T>, count = 1): T[] {
  return shiftRotateLeft([...array], count);
}

/**
 * 배열을 오른쪽으로 회전시킵니다.
 * 뒤에서 요소를 제거하고 앞에 추가하는 작업을 `count` 횟수만큼 반복합니다.
 * 원본 배열이 직접 수정됩니다.
 *
 * @param array - 회전할 배열
 * @param count - 오른쪽으로 회전할 횟수 (기본값: 1)
 * @returns 회전된 배열 (원본 배열이 변경됨)
 *
 * @example
 * shiftRotateRight([1, 2, 3, 4], 1); // [4, 1, 2, 3]
 */
export function shiftRotateRight<T>(array: T[], count = 1): T[] {
  for (let i = 0; i < count; i++) {
    const elem = array.pop() as T;
    array.unshift(elem);
  }
  return array;
}

/**
 * 배열을 오른쪽으로 회전시키되, 원본을 변경하지 않고 새로운 배열을 반환합니다.
 *
 * @param array - 회전할 읽기 전용 배열
 * @param count - 오른쪽으로 회전할 횟수 (기본값: 1)
 * @returns 회전된 새로운 배열
 *
 * @example
 * $shiftRotateRight([1, 2, 3, 4], 1); // [4, 1, 2, 3]
 */
export function $shiftRotateRight<T>(array: ReadonlyArray<T>, count = 1): T[] {
  return shiftRotateRight([...array], count);
}
