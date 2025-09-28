/**
 * 주어진 범위에서 랜덤한 정수를 반환합니다.
 *
 * @param min 최소값 (포함)
 * @param max 최대값 (배제)
 * @returns min 이상 max 미만의 랜덤한 정수
 */
function randomIntExclusiveEnd(min: number, max: number): number {
  const range = max - min;
  return Math.floor(Math.random() * range) + min;
}

/**
 * 주어진 배열에서 랜덤하게 하나의 요소를 선택하여 반환합니다.
 * 배열이 비어 있는 경우 예외를 발생합니다
 *
 * @param array 랜덤하게 선택할 배열
 * @returns 배열에서 랜덤하게 선택된 요소
 * @throws Error 배열이 비어 있을 경우 "invalid array" 오류를 발생시킴
 */
export function randomChoice<T>(array: ReadonlyArray<T>): T {
  if (array.length <= 0) {
    throw new Error('invalid array');
  }
  if (array.length === 1) return array[0];

  const idx = randomIntExclusiveEnd(0, array.length);
  return array[idx];
}
