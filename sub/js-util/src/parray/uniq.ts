/**
 * 주어진 배열에서 중복된 항목을 제거합니다.
 * 원본 배열을 직접 수정합니다.
 *
 * @param arr 중복을 제거할 배열
 * @returns 중복이 제거된 동일한 배열 참조
 *
 * @example
 * const items = [1, 2, 2, 3];
 * uniq(items); // [1, 2, 3]
 * console.log(items); // [1, 2, 3]
 */
export function uniq<T>(arr: T[]): T[] {
  const seen = new Set<T>();
  let i = 0;
  while (i < arr.length) {
    if (seen.has(arr[i])) {
      arr.splice(i, 1);
    } else {
      seen.add(arr[i]);
      i++;
    }
  }
  return arr;
}

/**
 * 주어진 배열에서 중복된 항목을 제거합니다.
 * 원본 배열은 유지되고, 새로운 배열을 반환합니다.
 *
 * @param arr 중복을 제거할 배열
 * @returns 중복이 제거된 새 배열
 *
 * @example
 * const items = [1, 2, 2, 3];
 * $uniq(items); // [1, 2, 3]
 * console.log(items); // [1, 2, 2, 3]
 */
export function $uniq<T>(arr: ReadonlyArray<T>): T[] {
  return Array.from(new Set(arr));
}
