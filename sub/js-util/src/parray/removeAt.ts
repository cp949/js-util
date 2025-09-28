/**
 * 배열에서 특정 인덱스의 요소를 삭제
 *
 * @param arr - 대상 배열
 * @param index - 삭제할 인덱스
 * @param howMany - 삭제할 항목의 수
 * @returns 전달된 배열
 */
export function removeAt<T>(arr: T[], index: number, howMany = 1): T[] {
  return removeAt_(arr, index, howMany);
}

/**
 * 배열을 복제하여 특정 인덱스의 요소를 삭제
 *
 * @param arr - 대상 배열
 * @param index - 삭제할 인덱스
 * @param howMany - 삭제할 항목의 수
 * @returns 복제된 배열
 */
export function $removeAt<T>(arr: ReadonlyArray<T>, index: number, howMany = 1): T[] {
  return removeAt_([...arr], index, howMany);
}

function removeAt_<T>(arr: T[], index: number, howMany = 1): T[] {
  if (howMany <= 0) return arr;
  arr.splice(index, howMany);
  return arr;
}
