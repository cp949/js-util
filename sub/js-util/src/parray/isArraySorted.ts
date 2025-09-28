// copy from https://github.com/sindresorhus/is-array-sorted/blob/main/index.js

interface Options<T> {
  /**
	Same as [`Array#sort(comparator)`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Description).
	*/
  comparator: (left: T, right: T) => number;
}

type CompareFn<T> = (a: T, b: T) => boolean;

/**
 * 배열이 정렬되어 있는지 여부
 * @param array
 * @param comparator
 * @returns 정렬되어 있으면 true를 리턴
 * @example
 * isArraySorted([1, 2, 3]); // true
 * isArraySorted([1, 3, 2]); // false
 * isArraySorted(['a', 'b', 'c']); // false
 */
export function isArraySorted<T>(
  array: ReadonlyArray<T>,
  comparator?: (left: T, right: T) => number,
): boolean {
  // NaN이나 null/undefined가 있으면 정렬되지 않은 것으로 판단
  for (const item of array) {
    if (item !== item || item === null || item === undefined) {
      // NaN check: NaN !== NaN
      return false;
    }
  }

  const compare: CompareFn<T> = comparator
    ? (left, right) => comparator(left, right) > 0
    : (left, right) => left > right;

  for (let i = 0; i < array.length - 1; i++) {
    if (compare(array[i], array[i + 1])) {
      return false;
    }
  }

  return true;
}
