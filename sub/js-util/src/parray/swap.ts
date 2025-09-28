/**
 * 주어진 배열에서 두 항목을 교체합니다.
 *
 * @param arr - 대상 배열
 * @param index1 - 교체할 항목1의 인덱스
 * @param index2 - 교체할 항목2의 인덱스
 * @returns 대상 배열을 리턴합니다
 */
export function swap<T>(arr: T[], index1: number, index2: number): T[] {
  return swap_(arr, index1, index2);
}

/**
 * 주어진 배열을 복제하여 두 항목을 교체합니다.
 *
 * @param arr - 대상 배열
 * @param index1 - 교체할 항목1의 인덱스
 * @param index2 - 교체할 항목2의 인덱스
 * @returns 복제된 배열을 리턴합니다
 */
export function $swap<T>(arr: ReadonlyArray<T>, index1: number, index2: number): T[] {
  return swap_([...arr], index1, index2);
}

function swap_<T>(arr: T[], index1: number, index2: number): T[] {
  if (index1 === index2) return arr;
  const tmp = arr[index1];
  arr[index1] = arr[index2];
  arr[index2] = tmp;
  return arr;
}

/**
 * 주어진 배열에서 두 항목의 인덱스를 찾아서 교체합니다.
 * 인덱스를 찾지 못하는 경우 null을 리턴합니다.
 *
 * @param arr - 대상 배열
 * @param item1 - 교체할 항목1
 * @param item2 - 교체할 항목2
 * @returns 정상적으로 교체한 경우 배열을 리턴합니다. 두 항목이 같은 경우에도 배열을 리턴합니다. 교체할 수 없는 경우에는 null을 리턴합니다.
 */
export function swapValue<T>(arr: T[], item1: T, item2: T): T[] | null {
  return swapValue_(arr, item1, item2);
}

export function $swapValue<T>(arr: ReadonlyArray<T>, item1: T, item2: T): T[] | null {
  return swapValue_([...arr], item1, item2);
}

function swapValue_<T>(arr: T[], item1: T, item2: T): T[] | null {
  if (item1 === item2) return arr;

  const index1 = arr.indexOf(item1);
  if (index1 < 0) {
    // throw new Error("item1 does not exists on array");
    return null;
  }
  const index2 = arr.indexOf(item2);
  if (index2 < 0) {
    // throw new Error("item2 does not exists on array");
    return null;
  }

  arr[index1] = item2;
  arr[index2] = item1;
  return arr;
}
