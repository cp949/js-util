/**
 * 배열의 지정된 인덱스에 새로운 항목을 삽입하여 기존 배열을 변경합니다.
 *
 * @param arr 배열
 * @param index 삽입을 시작할 인덱스
 * @param items 삽입할 항목들
 * @returns 기존 배열을 변경한 후 반환
 */
export function replaceAt<T>(arr: T[], index: number, items: T[]): T[] {
  if (index < 0 || index > arr.length) {
    throw new Error('Index is out of bounds.');
  }

  if (items.length > 0) {
    arr.splice(index, items.length, ...items); // 기존 배열을 변경
  }

  return arr;
}

/**
 * 배열의 지정된 인덱스에 새로운 항목을 삽입하여 새로운 배열을 반환합니다.
 *
 * @param arr 배열
 * @param index 삽입을 시작할 인덱스
 * @param items 삽입할 항목들
 * @returns 새로운 배열을 반환
 */
export function $replaceAt<T>(arr: ReadonlyArray<T>, index: number, items: T[]): T[] {
  if (index < 0 || index > arr.length) {
    throw new Error('Index is out of bounds.');
  }

  const newArray = [...arr]; // 배열을 복사하여 불변성 유지

  if (items.length > 0) {
    newArray.splice(index, items.length, ...items); // 복사된 배열을 변경
  }

  return newArray;
}
