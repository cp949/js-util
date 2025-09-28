/**
 * Combines multiple arrays into a single array using a specified function.
 *
 * @param arrays - Arrays to combine.
 * @param iteratee - Function used to combine elements.
 * @returns An array containing the result of applying the iteratee function to the elements of the input arrays.
 *
 * @example
```js
const arrays = [[1, 2], [10, 20], [100, 200]];
const result = zipWith(arrays, (a, b, c) => a + b + c); // [111, 222]
console.log(result);
```
 */
export function zipWith<T extends any[], U>(
  arrays: { [K in keyof T]: readonly T[K][] },
  iteratee: (...args: T) => U,
): U[];
export function zipWith<T, U>(
  arrays: readonly (readonly T[])[],
  iteratee: (...args: T[]) => U,
): U[];
export function zipWith<T extends any[], U>(
  arrays: { [K in keyof T]: readonly T[K][] } | readonly (readonly any[])[],
  iteratee: (...args: any[]) => U,
): U[] {
  const maxLength = Math.max(...arrays.map((arr) => arr.length));
  const result: U[] = [];

  for (let i = 0; i < maxLength; i++) {
    const args = arrays.map((arr) => arr[i]);
    result.push(iteratee(...args));
  }

  return result;
}
