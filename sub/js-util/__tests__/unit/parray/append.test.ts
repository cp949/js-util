import { describe, test, expect } from 'vitest';
import { append, $append } from '../../../src/parray/append.js';

describe('parray/append', () => {
  describe('append (원본 변경)', () => {
    test('빈 배열에 요소 추가', () => {
      const arr: number[] = [];
      const result = append(arr, [1, 2, 3]);

      expect(result).toBe(arr); // 원본 배열 반환
      expect(result).toEqual([1, 2, 3]);
    });

    test('기존 배열에 단일 요소 추가', () => {
      const arr = [1, 2, 3];
      const result = append(arr, [4]);

      expect(result).toBe(arr);
      expect(result).toEqual([1, 2, 3, 4]);
    });

    test('기존 배열에 여러 요소 추가', () => {
      const arr = [1, 2, 3];
      append(arr, [4, 5, 6]);

      expect(arr).toEqual([1, 2, 3, 4, 5, 6]);
    });

    test('빈 배열 추가 시 원본 유지', () => {
      const arr = [1, 2, 3];
      const result = append(arr, []);

      expect(result).toBe(arr);
      expect(result).toEqual([1, 2, 3]);
    });

    test('중복 제거 옵션 - true', () => {
      const arr = [1, 2, 3];
      append(arr, [2, 3, 4], true);

      expect(arr).toEqual([1, 2, 3, 4]);
    });

    test('중복 제거 옵션 - 함수', () => {
      const arr = [{ id: 1 }, { id: 2 }];
      append(arr, [{ id: 2 }, { id: 3 }], (item) => item.id);

      expect(arr).toHaveLength(3);
      expect(arr.map((item) => item.id)).toEqual([1, 2, 3]);
    });

    test('중복 제거 없음 (기본값)', () => {
      const arr = [1, 2];
      append(arr, [2, 3]);

      expect(arr).toEqual([1, 2, 2, 3]);
    });
  });

  describe('$append (불변)', () => {
    test('새로운 배열 반환', () => {
      const arr = [1, 2, 3];
      const result = $append(arr, [4, 5]);

      expect(result).not.toBe(arr); // 새로운 배열
      expect(result).toEqual([1, 2, 3, 4, 5]);
      expect(arr).toEqual([1, 2, 3]); // 원본 유지
    });

    test('빈 배열에 요소 추가', () => {
      const arr: number[] = [];
      const result = $append(arr, [1, 2]);

      expect(result).not.toBe(arr);
      expect(result).toEqual([1, 2]);
      expect(arr).toEqual([]);
    });

    test('중복 제거와 불변성', () => {
      const arr = [1, 2];
      const result = $append(arr, [2, 3], true);

      expect(result).not.toBe(arr);
      expect(result).toEqual([1, 2, 3]);
      expect(arr).toEqual([1, 2]); // 원본 유지
    });

    test('객체 배열 중복 제거', () => {
      const arr = [{ name: 'Alice' }, { name: 'Bob' }];
      const result = $append(arr, [{ name: 'Bob' }, { name: 'Charlie' }], (item) => item.name);

      expect(result).not.toBe(arr);
      expect(result.map((item) => item.name)).toEqual(['Alice', 'Bob', 'Charlie']);
      expect(arr).toHaveLength(2); // 원본 유지
    });
  });
});
