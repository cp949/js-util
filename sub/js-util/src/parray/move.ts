/**
 * 배열의 항목을 이동합니다.
 *
 * @param arr - 대상 배열
 * @param fromIndex - 이동할 항목의 인덱스
 * @param toIndex - 목적지 위치 인덱스
 * @returns 대상 배열을 리턴합니다
 */
export function move<T>(arr: T[], fromIndex: number, toIndex: number): T[] {
  return move_(arr, fromIndex, toIndex);
}

/**
 * 배열을 복제한 후, 항목을 이동합니다.
 *
 * @param arr - 대상 배열
 * @param fromIndex - 이동할 항목의 인덱스
 * @param toIndex - 목적지 위치 인덱스
 * @returns 복제된 배열을 리턴합니다
 */
export function $move<T>(arr: ReadonlyArray<T>, fromIndex: number, toIndex: number): T[] {
  return move_([...arr], fromIndex, toIndex);
}

function move_<T>(arr: T[], fromIndex: number, toIndex: number): T[] {
  if (arr.length === 0) return arr;
  const startIndex = fromIndex < 0 ? arr.length + fromIndex : fromIndex;
  if (startIndex === toIndex) return arr;
  if (startIndex >= 0 && startIndex < arr.length) {
    const [removed] = arr.splice(startIndex, 1);
    arr.splice(toIndex, 0, removed);
  }
  return arr;
}
