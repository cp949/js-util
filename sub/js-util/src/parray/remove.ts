type PredicateFn<T> = (item: T, index: number) => boolean;

/**
 * 배열에서 특정 항목을 제거합니다.
 *
 * @param arr - 대상 배열
 * @param value - 제거할 항목 또는 predicate 함수
 * @returns 전달된 배열
 */
export function remove<T>(arr: T[], value: T | PredicateFn<T>): T[] {
  return remove_(arr, value);
}

/**
 * 배열을 복제하여 특정 항목을 제거합니다.
 *
 * @param arr - 대상 배열
 * @param value - 제거할 항목 또는 predicate 함수
 * @returns 배열의 복제본
 */
export function $remove<T>(arr: ReadonlyArray<T>, value: T | PredicateFn<T>): T[] {
  return remove_([...arr], value);
}

function remove_<T>(array: T[], value: T | PredicateFn<T>): T[] {
  if (typeof value === 'function') {
    const idx = array.findIndex(value as (element: T) => boolean);
    if (idx >= 0) {
      array.splice(idx, 1);
      return array; // remove successfully
    }
  } else {
    const idx = array.indexOf(value);
    if (idx >= 0) {
      array.splice(idx, 1);
      return array; // remove successfully
    }
  }

  return array; // remove failed, not exist
}
