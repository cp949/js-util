/**
 * 값을 회전한다.
 * 이걸 왜 만들었나 모르겠다.
 * wrap()을 사용하면 될 것 같다.
 *
 * @param value - 현재 값
 * @param min - 최소값
 * @param max - 최대값
 * @returns
 * @deprecated use wrap()
 */
export function wrapRange(value: number, min: number, max: number): number {
  if (min === max) return min;
  let a = min;
  let b = max;
  if (a > b) {
    const c = a;
    a = b;
    b = c;
  }
  const range = b - a + 1; // inclusive
  return a + ((((value - a) % range) + range) % range);
}

/**
 * 배열의 범위내에 있는 인덱스 값으로 조정한다. 범위를 벗어난 인덱스인 경우 값을 회전한다
 * @param value - 현재값
 * @param array - 배열
 * @returns
 * @deprecated use wrapIndexArray()
 */
export function wrapRangeArray(value: number, array: { length: number }) {
  return wrapRange(value, 0, array.length - 1);
}
