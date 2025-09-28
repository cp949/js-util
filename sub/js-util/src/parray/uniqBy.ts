/**
 * 주어진 배열에서 특정 키 또는 기준 함수에 따라 중복된 항목을 제거합니다.
 * 원본 배열을 직접 수정합니다.
 *
 * @param arr 중복을 제거할 배열
 * @param iteratee 비교에 사용할 키(string) 또는 기준 함수
 * @returns 중복이 제거된 동일한 배열 참조
 *
 * @example
 * uniqBy(users, 'id');
 * uniqBy(users, user => user.id);
 */
export function uniqBy<T>(arr: T[], iteratee: ((item: T) => any) | keyof T): T[] {
  const getKey = typeof iteratee === 'function' ? iteratee : (item: T) => item[iteratee];

  const seen = new Set<any>();
  let i = 0;
  while (i < arr.length) {
    const key = getKey(arr[i]);
    if (seen.has(key)) {
      arr.splice(i, 1);
    } else {
      seen.add(key);
      i++;
    }
  }
  return arr;
}

/**
 * 주어진 배열에서 특정 키 또는 기준 함수에 따라 중복된 항목을 제거합니다.
 * 원본 배열은 유지되고, 새로운 배열을 반환합니다.
 *
 * @param arr 중복을 제거할 배열
 * @param iteratee 비교에 사용할 키(string) 또는 기준 함수
 * @returns 중복이 제거된 새 배열
 *
 * @example
 * $uniqBy(users, 'id');
 * $uniqBy(users, user => user.id);
 */
export function $uniqBy<T>(arr: ReadonlyArray<T>, iteratee: ((item: T) => any) | keyof T): T[] {
  const getKey = typeof iteratee === 'function' ? iteratee : (item: T) => item[iteratee];

  const seen = new Set<any>();
  return arr.filter((item) => {
    const key = getKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
