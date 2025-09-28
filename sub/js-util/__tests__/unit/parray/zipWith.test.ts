import { describe, test, expect } from 'vitest';
import { zipWith } from '../../../src/parray/zipWith.js';

describe('parray - zipWith function', () => {
  test('should combine arrays with addition function', () => {
    const arrays = [
      [1, 2],
      [10, 20],
      [100, 200],
    ];
    const result = zipWith(arrays, (a, b, c) => a + b + c);

    expect(result).toEqual([111, 222]);
  });

  test('should combine arrays with multiplication function', () => {
    const arrays = [
      [2, 3],
      [4, 5],
    ];
    const result = zipWith(arrays, (a, b) => a * b);

    expect(result).toEqual([8, 15]);
  });

  test('should handle arrays of different lengths', () => {
    const arrays = [[1, 2, 3], [10, 20], [100]];
    const result = zipWith(arrays, (a, b, c) => (a || 0) + (b || 0) + (c || 0));

    expect(result).toEqual([111, 22, 3]);
  });

  test('should handle empty arrays', () => {
    const arrays: number[][] = [[], []];
    const result = zipWith(arrays, (a, b) => a + b);

    expect(result).toEqual([]);
  });

  test('should handle single array', () => {
    const arrays = [[1, 2, 3]];
    const result = zipWith(arrays, (a) => a * 2);

    expect(result).toEqual([2, 4, 6]);
  });

  test('should handle string concatenation', () => {
    const arrays = [
      ['Hello', 'Good'],
      [' ', ' '],
      ['World', 'Day'],
    ];
    const result = zipWith(arrays, (a, b, c) => a + b + c);

    expect(result).toEqual(['Hello World', 'Good Day']);
  });

  test('should handle complex objects', () => {
    const arrays = [
      [{ id: 1 }, { id: 2 }],
      [{ name: 'John' }, { name: 'Jane' }],
    ];
    const result = zipWith(arrays, (obj1, obj2) => ({ ...obj1, ...obj2 }));

    expect(result).toEqual([
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ]);
  });

  test('should handle boolean operations', () => {
    const arrays = [
      [true, false, true],
      [false, true, true],
    ];
    const result = zipWith(arrays, (a, b) => a && b);

    expect(result).toEqual([false, false, true]);
  });

  test('should handle array with undefined values', () => {
    const arrays = [
      [1, undefined, 3],
      [2, 4, undefined],
    ];
    const result = zipWith(arrays, (a, b) => [a, b]);

    expect(result).toEqual([
      [1, 2],
      [undefined, 4],
      [3, undefined],
    ]);
  });

  test('should work with readonly arrays', () => {
    const arrays: readonly (readonly number[])[] = [
      [1, 2],
      [3, 4],
    ] as const;
    const result = zipWith(arrays, (a, b) => a + b);

    expect(result).toEqual([4, 6]);
  });

  test('should handle no arrays input', () => {
    const arrays: never[] = [];
    const result = zipWith(arrays, () => 'should not be called');

    expect(result).toEqual([]);
  });
});
