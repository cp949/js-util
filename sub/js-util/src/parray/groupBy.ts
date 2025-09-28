type KeyType<T, K extends keyof T> = T[K] extends string | number ? T[K] : string | number;

/**
 * 배열의 요소를 지정된 키를 기준으로 그룹화하는 함수입니다.
 *
 * @template T - 배열 요소의 타입
 * @template K - 그룹화 기준이 되는 키의 타입 (T의 키 중 하나)
 *
 * @param array - 그룹화할 배열
 * @param key - 그룹화 기준이 되는 키
 * @returns 그룹화된 객체를 반환합니다. 키는 문자열 또는 숫자이며, 값은 원본 객체 배열입니다.
 *
 * @example
 * ```typescript
 * const data = [
 *   { category: "fruit", name: "apple", price: 100 },
 *   { category: "fruit", name: "banana", price: 200 },
 *   { category: "vegetable", name: "carrot", price: 300 }
 * ];
 *
 * // category로 그룹화
 * const result = groupBy(data, "category");
 * // {
 * //   "fruit": [
 * //     { category: "fruit", name: "apple", price: 100 },
 * //     { category: "fruit", name: "banana", price: 200 }
 * //   ],
 * //   "vegetable": [
 * //     { category: "vegetable", name: "carrot", price: 300 }
 * //   ]
 * // }
 * ```
 */
export function groupBy<T, K extends keyof T>(
  array: ReadonlyArray<T>,
  key: K,
): Record<KeyType<T, K>, T[]>;

/**
 * 배열의 요소를 지정된 키를 기준으로 그룹화하고, 각 요소의 특정 속성만 선택하는 함수입니다.
 *
 * @template T - 배열 요소의 타입
 * @template K - 그룹화 기준이 되는 키의 타입 (T의 키 중 하나)
 * @template V - 선택할 값의 속성 키 타입 (T의 키 중 하나)
 *
 * @param array - 그룹화할 배열
 * @param key - 그룹화 기준이 되는 키
 * @param value - 선택할 값의 속성 키
 * @returns 그룹화된 객체를 반환합니다. 키는 문자열 또는 숫자이며, 값은 선택된 속성값의 배열입니다.
 *
 * @example
 * ```typescript
 * const data = [
 *   { category: "fruit", name: "apple", price: 100 },
 *   { category: "fruit", name: "banana", price: 200 },
 *   { category: "vegetable", name: "carrot", price: 300 }
 * ];
 *
 * // category로 그룹화하고 price만 선택
 * const result = groupBy(data, "category", "price");
 * // {
 * //   "fruit": [100, 200],
 * //   "vegetable": [300]
 * // }
 * ```
 */
export function groupBy<T, K extends keyof T, V extends keyof T>(
  array: ReadonlyArray<T>,
  key: K,
  value: V,
): Record<KeyType<T, K>, T[V][]>;

/**
 * 배열의 요소를 지정된 키를 기준으로 그룹화하고, 각 요소를 변환하는 함수입니다.
 *
 * @template T - 배열 요소의 타입
 * @template K - 그룹화 기준이 되는 키의 타입 (T의 키 중 하나)
 * @template R - 변환 함수의 반환값 타입
 *
 * @param array - 그룹화할 배열
 * @param key - 그룹화 기준이 되는 키
 * @param value - 요소를 변환하는 함수
 * @returns 그룹화된 객체를 반환합니다. 키는 문자열 또는 숫자이며, 값은 변환된 값의 배열입니다.
 *
 * @example
 * ```typescript
 * const data = [
 *   { category: "fruit", name: "apple", price: 100 },
 *   { category: "fruit", name: "banana", price: 200 },
 *   { category: "vegetable", name: "carrot", price: 300 }
 * ];
 *
 * // category로 그룹화하고 name을 대문자로 변환
 * const result = groupBy(data, "category", item => item.name.toUpperCase());
 * // {
 * //   "fruit": ["APPLE", "BANANA"],
 * //   "vegetable": ["CARROT"]
 * // }
 * ```
 */
export function groupBy<T, K extends keyof T, R>(
  array: ReadonlyArray<T>,
  key: K,
  value: (item: T) => R,
): Record<KeyType<T, K>, R[]>;

export function groupBy<T, K extends keyof T>(
  array: ReadonlyArray<T>,
  key: K,
  value?: ((item: T) => any) | keyof T,
): Record<string | number, any[]> {
  return array.reduce(
    (accumulator, element) => {
      const groupKey = element[key] as string | number;

      const groupedValue =
        value === undefined
          ? element
          : typeof value === 'function'
            ? value(element)
            : element[value];

      if (!accumulator[groupKey]) {
        accumulator[groupKey] = [];
      }

      accumulator[groupKey].push(groupedValue);

      return accumulator;
    },
    {} as Record<string | number, any[]>,
  );
}
