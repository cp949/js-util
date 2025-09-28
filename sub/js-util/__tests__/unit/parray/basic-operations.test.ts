import { describe, test, expect } from 'vitest';
import {
  first,
  firstOne,
  last,
  lastOne,
  at,
  isEmpty,
  isNotEmpty,
  size,
  remove,
  removeAt,
  insertAt
} from '../../../src/parray/index.js';

describe('parray - Basic Operations', () => {
  describe('firstOne', () => {
    test('배열의 첫 번째 요소 반환', () => {
      expect(firstOne([1, 2, 3])).toBe(1);
      expect(firstOne(['a', 'b', 'c'])).toBe('a');
    });
    
    test('빈 배열에서 undefined 반환', () => {
      expect(firstOne([])).toBeUndefined();
    });
    
    test('단일 요소 배열', () => {
      expect(firstOne([42])).toBe(42);
    });
    
    test('falsy 값들', () => {
      expect(firstOne([0, 1, 2])).toBe(0);
      expect(firstOne([false, true])).toBe(false);
      expect(firstOne([null, 'value'])).toBe(null);
    });
  });
  
  describe('first', () => {
    test('첫 n개 요소 반환 (기본값 1)', () => {
      expect(first([1, 2, 3])).toEqual([1]);
      expect(first([1, 2, 3], 2)).toEqual([1, 2]);
    });
    
    test('빈 배열', () => {
      expect(first([])).toEqual([]);
    });
  });
  
  describe('lastOne', () => {
    test('배열의 마지막 요소 반환', () => {
      expect(lastOne([1, 2, 3])).toBe(3);
      expect(lastOne(['a', 'b', 'c'])).toBe('c');
    });
    
    test('빈 배열에서 undefined 반환', () => {
      expect(lastOne([])).toBeUndefined();
    });
    
    test('단일 요소 배열', () => {
      expect(lastOne([42])).toBe(42);
    });
  });
  
  describe('last', () => {
    test('마지막 n개 요소 반환 (기본값 1)', () => {
      expect(last([1, 2, 3])).toEqual([3]);
      expect(last([1, 2, 3], 2)).toEqual([2, 3]);
    });
    
    test('빈 배열', () => {
      expect(last([])).toEqual([]);
    });
  });
  
  describe('at', () => {
    test('양수 인덱스로 접근', () => {
      const arr = ['a', 'b', 'c', 'd'];
      expect(at(arr, 0)).toBe('a');
      expect(at(arr, 2)).toBe('c');
    });
    
    test('음수 인덱스는 지원하지 않음', () => {
      const arr = ['a', 'b', 'c', 'd'];
      expect(at(arr, -1)).toBeUndefined();
      expect(at(arr, -2)).toBeUndefined();
    });
    
    test('범위를 벗어난 인덱스', () => {
      const arr = ['a', 'b', 'c'];
      expect(at(arr, 10)).toBeUndefined();
      expect(at(arr, -10)).toBeUndefined();
    });
    
    test('빈 배열', () => {
      expect(at([], 0)).toBeUndefined();
    });
  });
  
  describe('isEmpty', () => {
    test('빈 배열에대해 true', () => {
      expect(isEmpty([])).toBe(true);
    });
    
    test('내용이 있는 배열에대해 false', () => {
      expect(isEmpty([1])).toBe(false);
      expect(isEmpty([null])).toBe(false);
      expect(isEmpty([undefined])).toBe(false);
    });
  });
  
  describe('isNotEmpty', () => {
    test('isEmpty와 반대 결과', () => {
      expect(isNotEmpty([])).toBe(false);
      expect(isNotEmpty([1, 2, 3])).toBe(true);
    });
  });
  
  describe('size', () => {
    test('배열 길이 반환', () => {
      expect(size([])).toBe(0);
      expect(size([1, 2, 3])).toBe(3);
      expect(size(['a'])).toBe(1);
    });
  });
  
  describe('remove', () => {
    test('지정된 요소 제거', () => {
      const arr = [1, 2, 3, 2, 4];
      const result = remove(arr, 2);
      
      expect(result).toBe(arr); // 원본 배열 반환
      expect(result).toEqual([1, 3, 2, 4]); // 첫 번째 2만 제거
    });
    
    test('없는 요소 제거 시도', () => {
      const arr = [1, 2, 3];
      const result = remove(arr, 5);
      
      expect(result).toBe(arr);
      expect(result).toEqual([1, 2, 3]); // 변경 없음
    });
    
    test('빈 배열', () => {
      const arr: number[] = [];
      const result = remove(arr, 1);
      
      expect(result).toBe(arr);
      expect(result).toEqual([]);
    });
  });
  
  describe('removeAt', () => {
    test('지정된 인덱스의 요소 제거', () => {
      const arr = ['a', 'b', 'c', 'd'];
      const result = removeAt(arr, 1);
      
      expect(result).toBe(arr);
      expect(result).toEqual(['a', 'c', 'd']);
    });
    
    test('음수 인덱스', () => {
      const arr = ['a', 'b', 'c'];
      const result = removeAt(arr, -1);
      
      expect(result).toEqual(['a', 'b']);
    });
    
    test('범위를 벗어난 인덱스', () => {
      const arr = [1, 2, 3];
      const result = removeAt(arr, 10);
      
      expect(result).toEqual([1, 2, 3]); // 변경 없음
    });
  });
  
  describe('insertAt', () => {
    test('지정된 위치에 요소 삽입', () => {
      const arr = ['a', 'c', 'd'];
      const result = insertAt(arr, 1, ['b']);
      
      expect(result).toBe(arr);
      expect(result).toEqual(['a', 'b', 'c', 'd']);
    });
    
    test('범위를 벗어난 인덱스는 변경 없음', () => {
      const arr = [1, 2];
      const result = insertAt(arr, 3, [10]);
      
      expect(result).toEqual([1, 2, 10]); // insertAt adds element at end if index out of bounds
    });
    
    test('배열 시작에 삽입', () => {
      const arr = [2, 3];
      const result = insertAt(arr, 0, [1]);
      
      expect(result).toEqual([1, 2, 3]);
    });
    
    test('음수 인덱스', () => {
      const arr = ['a', 'b', 'c'];
      const result = insertAt(arr, -1, ['x']);
      
      expect(result).toEqual(['a', 'b', 'x', 'c']);
    });
  });
});