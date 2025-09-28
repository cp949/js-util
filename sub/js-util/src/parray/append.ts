type UniqOption<T> = boolean | ((item: T) => any);

/**
 * 배열 뒤에 요소를 추가합니다.
 * `uniq` 옵션을 사용하면 중복된 항목을 제거하며 추가할 수 있습니다.
 *
 * @param arr - 대상 배열
 * @param items - 뒤에 추가할 요소들
 * @param uniq - 중복 제거 옵션
 *   - `false` (기본값): 중복 허용
 *   - `true`: 값 자체를 기준으로 중복 제거
 *   - `(item) => key`: 지정한 함수의 반환값으로 중복 판단
 * @returns 원본 배열 (수정됨)
 *
 * @example
 * append([1, 2], [2, 3]);        // [1, 2, 2, 3]
 * append([1, 2], [2, 3], true);  // [1, 2, 3]
 * append([{id:1}], [{id:2}, {id:1}], x => x.id); // [{id:1}, {id:2}]
 */
export function append<T>(arr: T[], items: ReadonlyArray<T>, uniq: UniqOption<T> = false): T[] {
  if (items.length === 0) return arr;

  if (uniq === false) {
    // 중복 허용: 그냥 뒤에 삽입
    arr.push(...items);
  } else if (uniq === true) {
    // 값 자체 기준으로 중복 제거
    const seen = new Set<T>(arr);
    for (const item of items) {
      if (!seen.has(item)) {
        arr.push(item);
        seen.add(item);
      }
    }
  } else {
    // 함수 기준으로 중복 제거
    const getKey = uniq;
    const seen = new Set<any>(arr.map(getKey));
    for (const item of items) {
      const key = getKey(item);
      if (!seen.has(key)) {
        arr.push(item);
        seen.add(key);
      }
    }
  }

  return arr;
}

/**
 * 배열을 복제한 후 뒤에 요소를 추가합니다.
 * `uniq` 옵션을 사용하면 중복된 항목을 제거하며 추가할 수 있습니다.
 *
 * @param arr - 대상 배열
 * @param items - 뒤에 추가할 요소들
 * @param uniq - 중복 제거 옵션
 *   - `false` (기본값): 중복 허용
 *   - `true`: 값 자체를 기준으로 중복 제거
 *   - `(item) => key`: 지정한 함수의 반환값으로 중복 판단
 * @returns 복제된 새 배열
 *
 * @example
 * $append([1, 2], [2, 3]);        // [1, 2, 2, 3]
 * $append([1, 2], [2, 3], true);  // [1, 2, 3]
 * $append([{id:1}], [{id:2}, {id:1}], x => x.id); // [{id:1}, {id:2}]
 */
export function $append<T>(
  arr: ReadonlyArray<T>,
  items: ReadonlyArray<T>,
  uniq: UniqOption<T> = false,
): T[] {
  const array = [...arr];
  return append(array, items, uniq); // 내부에서 append 재사용
}
