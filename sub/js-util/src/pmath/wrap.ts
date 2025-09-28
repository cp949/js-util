/**
 * 주어진 숫자를 특정 범위 내에서 순환시킵니다.
 *
 * 예를 들어, 범위가 0~4일 때 5는 0으로, -1은 4로 순환됩니다.
 *
 * @param value - 순환시킬 숫자
 * @param min - 범위의 최소값
 * @param max - 범위의 최대값
 * @param inclusive - 최대값을 범위에 포함할지 여부 (기본값: true)
 * @returns 주어진 범위 내로 순환된 값
 *
 * @example
 * ```ts
 * wrap(5, 0, 4);        // 결과: 0
 * wrap(-1, 0, 4);       // 결과: 4
 * wrap(7, 1, 3);        // 결과: 2
 * wrap(3, 1, 3);        // 결과: 3
 * wrap(3, 1, 3, false); // 결과: 1 (3은 포함하지 않음)
 * ```
 */
export function wrap(value: number, min: number, max: number, inclusive = true): number {
  // min과 max가 같다면 항상 해당 값을 반환
  if (min === max) return min;

  let a = min;
  let b = max;

  // 범위가 잘못 지정된 경우(min > max), 서로 값을 바꿔줌
  if (a > b) {
    const c = a;
    a = b;
    b = c;
  }

  // 포함 여부에 따라 범위 크기를 결정
  const range = inclusive ? b - a + 1 : b - a;

  // 모듈러 연산으로 값을 순환시킴
  return a + ((((value - a) % range) + range) % range);
}

/**
 * 배열의 길이에 맞춰 인덱스를 순환시킵니다.
 *
 * 음수 인덱스나 배열의 길이를 초과하는 인덱스를 유효한 범위(0 이상 배열 길이 - 1 이하)로 순환시킵니다.
 *
 * @param index - 순환시킬 인덱스
 * @param array - 길이를 가진 배열 또는 배열 유사 객체
 * @returns 배열 길이에 맞춰 순환된 인덱스
 *
 * @example
 * ```ts
 * wrapIndexArray(5, { length: 4 });   // 결과: 1
 * wrapIndexArray(-1, { length: 4 });  // 결과: 3
 * wrapIndexArray(0, { length: 4 });   // 결과: 0
 * wrapIndexArray(3, { length: 4 });   // 결과: 3
 * ```
 */
export function wrapIndexArray(index: number, array: { length: number }): number {
  return wrap(index, 0, array.length - 1);
}
