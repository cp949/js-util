/**
 * 두 객체를 얕게 비교하여 동일한지 판단하는 함수.
 *
 * 이 함수는 객체의 참조 값 또는 기본 속성 값이 동일한지 확인합니다.
 * 객체의 중첩된 속성은 비교하지 않습니다.
 *
 * @param a - 비교할 첫 번째 객체.
 * @param b - 비교할 두 번째 객체.
 * @returns 두 객체가 얕게 동일하면 `true`, 그렇지 않으면 `false`.
 *
 * @example
 * ```ts
 * shallowEq({ a: 1, b: 2 }, { a: 1, b: 2 }); // true
 * shallowEq({ a: 1 }, { a: 1, b: 2 }); // false
 * shallowEq({ a: 1 }, { a: 2 }); // false
 * ```
 */
export function shallowEq(a: any, b: any) {
  // 두 객체가 동일한 참조를 가리키는 경우
  if (a === b) {
    return true;
  }

  // 하나라도 객체가 아닌 경우
  if (!(a instanceof Object) || !(b instanceof Object)) {
    return false;
  }

  // 첫 번째 객체의 키 목록을 가져옴
  const keys = Object.keys(a);
  const { length } = keys;

  // 두 객체의 키 개수가 다르면 다름
  if (length !== Object.keys(b).length) {
    return false;
  }

  // 첫 번째 객체의 모든 키를 순회하며 비교
  for (let i = 0; i < length; i += 1) {
    const key = keys[i];

    // 두 번째 객체에 키가 존재하지 않으면 다름
    if (!(key in b)) {
      return false;
    }

    // 두 객체의 값이 다르면 다름
    if (a[key] !== b[key]) {
      return false;
    }
  }

  // 모든 조건을 통과하면 두 객체는 얕게 동일
  return true;
}
