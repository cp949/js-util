import { describe, test, expect } from 'vitest';
import { insertAt, $insertAt } from '../../../src/parray/insertAt.js';

describe('parray - insertAt functions', () => {
  describe('insertAt (mutating)', () => {
    test('should insert items at specified index', () => {
      const arr = ['a', 'c', 'd'];
      const result = insertAt(arr, 1, ['b']);
      
      expect(result).toBe(arr); // same reference
      expect(result).toEqual(['a', 'b', 'c', 'd']);
    });

    test('should insert multiple items', () => {
      const arr = [1, 4];
      const result = insertAt(arr, 1, [2, 3]);
      
      expect(result).toEqual([1, 2, 3, 4]);
    });

    test('should handle empty items array', () => {
      const arr = [1, 2, 3];
      const original = [...arr];
      const result = insertAt(arr, 1, []);
      
      expect(result).toBe(arr);
      expect(result).toEqual(original);
    });

    test('should insert at beginning', () => {
      const arr = [2, 3];
      const result = insertAt(arr, 0, [1]);
      
      expect(result).toEqual([1, 2, 3]);
    });

    test('should insert at end', () => {
      const arr = [1, 2];
      const result = insertAt(arr, 2, [3]);
      
      expect(result).toEqual([1, 2, 3]);
    });

    test('should handle negative index', () => {
      const arr = ['a', 'b', 'c'];
      const result = insertAt(arr, -1, ['x']);
      
      expect(result).toEqual(['a', 'b', 'x', 'c']);
    });

    test('should handle out of bounds index', () => {
      const arr = [1, 2];
      const result = insertAt(arr, 10, [3]);
      
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe('$insertAt (non-mutating)', () => {
    test('should insert items without mutating original', () => {
      const arr = ['a', 'c', 'd'];
      const original = [...arr];
      const result = $insertAt(arr, 1, ['b']);
      
      expect(result).not.toBe(arr); // different reference
      expect(result).toEqual(['a', 'b', 'c', 'd']);
      expect(arr).toEqual(original); // original unchanged
    });

    test('should insert multiple items', () => {
      const arr = [1, 4];
      const original = [...arr];
      const result = $insertAt(arr, 1, [2, 3]);
      
      expect(result).toEqual([1, 2, 3, 4]);
      expect(arr).toEqual(original);
    });

    test('should handle empty items array', () => {
      const arr = [1, 2, 3];
      const result = $insertAt(arr, 1, []);
      
      expect(result).not.toBe(arr); // different reference even with empty insert
      expect(result).toEqual([1, 2, 3]);
    });

    test('should work with readonly arrays', () => {
      const arr: ReadonlyArray<number> = [1, 3];
      const items: ReadonlyArray<number> = [2];
      const result = $insertAt(arr, 1, items);
      
      expect(result).toEqual([1, 2, 3]);
    });

    test('should insert at beginning', () => {
      const arr = [2, 3];
      const result = $insertAt(arr, 0, [1]);
      
      expect(result).toEqual([1, 2, 3]);
    });

    test('should handle negative index', () => {
      const arr = ['a', 'b', 'c'];
      const result = $insertAt(arr, -1, ['x']);
      
      expect(result).toEqual(['a', 'b', 'x', 'c']);
    });

    test('should handle out of bounds index', () => {
      const arr = [1, 2];
      const result = $insertAt(arr, 10, [3]);
      
      expect(result).toEqual([1, 2, 3]);
    });

    test('should work with empty array', () => {
      const arr: ReadonlyArray<string> = [];
      const result = $insertAt(arr, 0, ['first']);
      
      expect(result).toEqual(['first']);
    });
  });
});