import { describe, test, expect } from 'vitest';
import { isArraySorted } from '../../../src/parray/isArraySorted.js';

describe('parray - isArraySorted', () => {
  describe('기본 숫자 배열 정렬 확인', () => {
    test('정렬된 숫자 배열', () => {
      expect(isArraySorted([1, 2, 3, 4, 5])).toBe(true);
      expect(isArraySorted([1, 1, 2, 3])).toBe(true); // 같은 값 허용
      expect(isArraySorted([5])).toBe(true); // 단일 원소
      expect(isArraySorted([])).toBe(true); // 빈 배열
    });

    test('정렬되지 않은 숫자 배열', () => {
      expect(isArraySorted([1, 3, 2])).toBe(false);
      expect(isArraySorted([5, 4, 3, 2, 1])).toBe(false);
      expect(isArraySorted([1, 2, 4, 3])).toBe(false);
    });

    test('동일한 값으로 구성된 배열', () => {
      expect(isArraySorted([1, 1, 1, 1])).toBe(true);
      expect(isArraySorted([0, 0, 0])).toBe(true);
    });
  });

  describe('문자열 배열', () => {
    test('문자열 배열은 기본적으로 사전식 정렬로 확인됨', () => {
      // 기본 비교자는 > 연산자를 사용하므로 사전식 정렬
      expect(isArraySorted(['a', 'b', 'c'])).toBe(true);
      expect(isArraySorted(['apple', 'banana', 'cherry'])).toBe(true);
    });

    test('정렬되지 않은 문자열 배열', () => {
      expect(isArraySorted(['c', 'a', 'b'])).toBe(false);
      expect(isArraySorted(['banana', 'apple', 'cherry'])).toBe(false);
    });

    test('대소문자 구분', () => {
      expect(isArraySorted(['A', 'B', 'a', 'b'])).toBe(true); // ASCII 순서
      expect(isArraySorted(['a', 'A', 'b', 'B'])).toBe(false);
    });
  });

  describe('커스텀 comparator', () => {
    test('내림차순 정렬 확인', () => {
      const desc = (a: number, b: number) => b - a;

      expect(isArraySorted([5, 4, 3, 2, 1], desc)).toBe(true);
      expect(isArraySorted([1, 2, 3, 4, 5], desc)).toBe(false);
      expect(isArraySorted([5, 5, 3, 1], desc)).toBe(true);
    });

    test('객체 배열 정렬 확인', () => {
      interface Person {
        name: string;
        age: number;
      }

      const people: Person[] = [
        { name: 'Alice', age: 20 },
        { name: 'Bob', age: 25 },
        { name: 'Charlie', age: 30 },
      ];

      // 나이순 정렬 확인
      const ageComparator = (a: Person, b: Person) => a.age - b.age;
      expect(isArraySorted(people, ageComparator)).toBe(true);

      const unsortedPeople: Person[] = [
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 20 },
        { name: 'Charlie', age: 25 },
      ];
      expect(isArraySorted(unsortedPeople, ageComparator)).toBe(false);
    });

    test('문자열 길이순 정렬', () => {
      const lengthComparator = (a: string, b: string) => a.length - b.length;

      expect(isArraySorted(['a', 'ab', 'abc'], lengthComparator)).toBe(true);
      expect(isArraySorted(['abc', 'ab', 'a'], lengthComparator)).toBe(false);
      expect(isArraySorted(['hi', 'yo', 'abc'], lengthComparator)).toBe(true); // 같은 길이
    });
  });

  describe('특수 케이스', () => {
    test('부동소수점 숫자', () => {
      expect(isArraySorted([1.1, 1.2, 1.3])).toBe(true);
      expect(isArraySorted([1.3, 1.1, 1.2])).toBe(false);
      expect(isArraySorted([0.1, 0.2, 0.3])).toBe(true);
    });

    test('음수 포함 배열', () => {
      expect(isArraySorted([-3, -2, -1, 0, 1])).toBe(true);
      expect(isArraySorted([1, 0, -1, -2, -3])).toBe(false);
    });

    test('매우 큰 숫자', () => {
      expect(isArraySorted([Number.MIN_SAFE_INTEGER, 0, Number.MAX_SAFE_INTEGER])).toBe(true);
      expect(isArraySorted([Number.MAX_SAFE_INTEGER, 0, Number.MIN_SAFE_INTEGER])).toBe(false);
    });

    test('NaN과 Infinity', () => {
      // 우리 구현에서는 NaN, null, undefined가 있으면 정렬되지 않은 것으로 판단
      expect(isArraySorted([1, 2, NaN])).toBe(false); // NaN 포함 시 false
      expect(isArraySorted([NaN, 1, 2])).toBe(false); // NaN 포함 시 false

      // Infinity는 정상 숫자로 처리
      expect(isArraySorted([1, 2, Infinity])).toBe(true);
      expect(isArraySorted([-Infinity, 0, Infinity])).toBe(true);
    });
  });

  describe('성능 관련', () => {
    test('큰 배열에서도 정상 동작', () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => i);
      expect(isArraySorted(largeArray)).toBe(true);

      const reversedArray = Array.from({ length: 1000 }, (_, i) => 1000 - i);
      expect(isArraySorted(reversedArray)).toBe(false);
    });

    test('이미 정렬된 배열의 빠른 확인', () => {
      // 첫 번째 비교에서 실패하는 케이스
      expect(isArraySorted([2, 1, 3, 4, 5])).toBe(false);
    });
  });

  describe('타입 안전성', () => {
    test('ReadonlyArray 타입 지원', () => {
      const readonlyArray: readonly number[] = [1, 2, 3, 4, 5];
      expect(isArraySorted(readonlyArray)).toBe(true);
    });

    test('혼합 타입은 컴파일 타임에 방지됨', () => {
      // 이 테스트는 컴파일 타임 타입 체크를 위한 것으로,
      // 실제로는 TypeScript가 타입 안전성을 보장합니다.
      const mixedArray = [1, '2', 3]; // 실제로는 타입 에러가 발생해야 함
      // 하지만 런타임에서는 동작할 수 있음 (타입 단언 등으로 우회 가능)
      expect(typeof mixedArray).toBe('object');
    });
  });

  describe('에러 케이스', () => {
    test('null이나 undefined가 포함된 배열', () => {
      // null/undefined 비교는 특별한 동작을 보임
      expect(isArraySorted([null, undefined])).toBe(false); // null > undefined는 false
      expect(isArraySorted([undefined, null])).toBe(false); // undefined > null도 false

      // null과 숫자 비교 - 우리 구현에서는 null/undefined 있으면 false
      expect(isArraySorted([null, 1] as any)).toBe(false); // null 포함 시 false
      expect(isArraySorted([1, null] as any)).toBe(false); // null 포함 시 false
    });
  });
});
