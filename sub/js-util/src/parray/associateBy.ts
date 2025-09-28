type KeyType<T, K extends keyof T> = T[K] extends string | number ? T[K] : string | number;

/**
 * 주어진 배열을 특정 속성을 기준으로 객체로 변환하는 함수
 *
 * 배열의 각 요소에서 지정된 `key` 속성의 값을 기준으로 객체의 키를 생성하며,
 * 해당 키에 대해 하나의 값만 저장한다. 만약 같은 `key` 값을 가진 요소가 여러 개 있을 경우,
 * 마지막 요소의 값이 저장된다.
 *
 * @template T 변환할 배열의 요소 타입
 * @template K key가 될 속성의 타입 (T의 속성 중 하나)
 * @template TValue 저장할 값의 타입 (T의 속성 중 하나 또는 변환 함수의 반환 타입)
 *
 * @param array 변환할 배열
 * @param key 객체의 키로 사용할 속성
 * @param value (선택 사항) 저장할 값의 기준
 *   - `undefined`: 전체 객체를 저장 (기본값)
 *   - `keyof T`: 해당 속성의 값을 저장
 *   - `(item: T) => any`: 변환 함수의 반환값을 저장
 *
 * @returns `Record<KeyType<T, K>, V>` 형태의 객체 반환
 *   - `V`는 `value` 파라미터를 기준으로 결정됨
 *   - `value`가 없으면 `T`
 *   - `value`가 속성이면 `T[TValue]`
 *   - `value`가 함수면 `ReturnType<TValue>`
 *
 * @throws `Error` - `key` 값이 `string | number` 타입이 아닐 경우 에러 발생
 *
 * @example
 * ```ts
 * const data = [
 *   { id: 1, category: "fruit", name: "apple", price: 100 },
 *   { id: 2, category: "fruit", name: "banana", price: 200 },
 *   { id: 3, category: "vegetable", name: "carrot", price: 300 },
 * ];
 *
 * // 기본 사용 (객체 전체 저장)
 * const associated1 = associateBy(data, "id");
 * console.log(associated1);
 * // {
 * //   1: { id: 1, category: "fruit", name: "apple", price: 100 },
 * //   2: { id: 2, category: "fruit", name: "banana", price: 200 },
 * //   3: { id: 3, category: "vegetable", name: "carrot", price: 300 }
 * // }
 *
 * // 특정 속성 값만 저장
 * const associated2 = associateBy(data, "id", "name");
 * console.log(associated2);
 * // {
 * //   1: "apple",
 * //   2: "banana",
 * //   3: "carrot"
 * // }
 *
 * // 변환 함수를 적용하여 저장
 * const associated3 = associateBy(data, "id", (item) => `${item.name} (${item.price}원)`);
 * console.log(associated3);
 * // {
 * //   1: "apple (100원)",
 * //   2: "banana (200원)",
 * //   3: "carrot (300원)"
 * // }
 * ```
 */
export function associateBy<T, K extends keyof T>(
  array: ReadonlyArray<T>,
  key: K,
): Record<KeyType<T, K>, T>;

export function associateBy<T, K extends keyof T, V extends keyof T>(
  array: ReadonlyArray<T>,
  key: K,
  value: V,
): Record<KeyType<T, K>, T[V]>;

export function associateBy<T, K extends keyof T, R>(
  array: ReadonlyArray<T>,
  key: K,
  value: (item: T) => R,
): Record<KeyType<T, K>, R>;

export function associateBy<T, K extends keyof T>(
  array: ReadonlyArray<T>,
  key: K,
  value?: ((item: T) => any) | keyof T,
): Record<string | number, any> {
  return array.reduce(
    (accumulator, element) => {
      const groupKey = element[key] as string | number;

      const associatedValue =
        value === undefined
          ? element
          : typeof value === 'function'
            ? value(element)
            : element[value];

      // 기존 값이 있더라도 덮어씌움 (즉, 같은 key가 여러 개 있을 경우 마지막 값이 저장됨)
      accumulator[groupKey] = associatedValue;

      return accumulator;
    },
    {} as Record<string | number, any>,
  );
}
