import { describe, test, expect } from 'vitest';
import { uniqBy, $uniqBy } from '../../../src/parray/uniqBy.js';

describe('parray - uniqBy functions', () => {
  describe('uniqBy (mutating)', () => {
    test('should remove duplicates by key property', () => {
      const users = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 1, name: 'Johnny' },
        { id: 3, name: 'Bob' }
      ];
      
      const result = uniqBy(users, 'id');
      
      expect(result).toHaveLength(3);
      expect(result).toEqual([
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'Bob' }
      ]);
      expect(result).toBe(users); // 동일한 배열 참조
    });

    test('should remove duplicates by function', () => {
      const users = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 1, name: 'Johnny' },
        { id: 3, name: 'Bob' }
      ];
      
      const result = uniqBy(users, user => user.id);
      
      expect(result).toHaveLength(3);
      expect(result).toEqual([
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'Bob' }
      ]);
      expect(result).toBe(users); // 동일한 배열 참조
    });

    test('should handle primitive values with function', () => {
      const numbers = [1, 2, 3, 1, 4, 2, 5];
      
      const result = uniqBy(numbers, n => n);
      
      expect(result).toEqual([1, 2, 3, 4, 5]);
      expect(result).toBe(numbers); // 동일한 배열 참조
    });

    test('should handle empty array', () => {
      const empty: any[] = [];
      const result = uniqBy(empty, 'id');
      
      expect(result).toEqual([]);
      expect(result).toBe(empty);
    });

    test('should handle array with no duplicates', () => {
      const users = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'Bob' }
      ];
      
      const result = uniqBy(users, 'id');
      
      expect(result).toHaveLength(3);
      expect(result).toEqual(users);
      expect(result).toBe(users);
    });

    test('should handle all duplicates', () => {
      const users = [
        { id: 1, name: 'John' },
        { id: 1, name: 'Jane' },
        { id: 1, name: 'Bob' }
      ];
      
      const result = uniqBy(users, 'id');
      
      expect(result).toHaveLength(1);
      expect(result).toEqual([{ id: 1, name: 'John' }]);
      expect(result).toBe(users);
    });
  });

  describe('$uniqBy (non-mutating)', () => {
    test('should remove duplicates by key property without mutating', () => {
      const users = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 1, name: 'Johnny' },
        { id: 3, name: 'Bob' }
      ];
      const originalUsers = [...users];
      
      const result = $uniqBy(users, 'id');
      
      expect(result).toHaveLength(3);
      expect(result).toEqual([
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'Bob' }
      ]);
      expect(result).not.toBe(users); // 다른 배열 참조
      expect(users).toEqual(originalUsers); // 원본 배열 유지
    });

    test('should remove duplicates by function without mutating', () => {
      const users = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 1, name: 'Johnny' },
        { id: 3, name: 'Bob' }
      ];
      const originalUsers = [...users];
      
      const result = $uniqBy(users, user => user.id);
      
      expect(result).toHaveLength(3);
      expect(result).toEqual([
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'Bob' }
      ]);
      expect(result).not.toBe(users); // 다른 배열 참조
      expect(users).toEqual(originalUsers); // 원본 배열 유지
    });

    test('should handle primitive values with function', () => {
      const numbers = [1, 2, 3, 1, 4, 2, 5];
      const originalNumbers = [...numbers];
      
      const result = $uniqBy(numbers, n => n);
      
      expect(result).toEqual([1, 2, 3, 4, 5]);
      expect(result).not.toBe(numbers); // 다른 배열 참조
      expect(numbers).toEqual(originalNumbers); // 원본 배열 유지
    });

    test('should handle empty array', () => {
      const empty: any[] = [];
      const result = $uniqBy(empty, 'id');
      
      expect(result).toEqual([]);
      expect(result).not.toBe(empty); // 다른 배열 참조
    });

    test('should handle readonly arrays', () => {
      const users: ReadonlyArray<{ id: number; name: string }> = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 1, name: 'Johnny' }
      ];
      
      const result = $uniqBy(users, 'id');
      
      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' }
      ]);
    });

    test('should handle complex key functions', () => {
      const users = [
        { id: 1, name: 'John', category: 'A' },
        { id: 2, name: 'Jane', category: 'B' },
        { id: 3, name: 'Johnny', category: 'A' },
        { id: 4, name: 'Bob', category: 'B' }
      ];
      
      const result = $uniqBy(users, user => user.category);
      
      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { id: 1, name: 'John', category: 'A' },
        { id: 2, name: 'Jane', category: 'B' }
      ]);
    });
  });
});