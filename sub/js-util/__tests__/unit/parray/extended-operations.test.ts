import { describe, test, expect } from 'vitest';
import {
  associateBy,
  chunks,
  groupBy,
  isArrayEqual,
  move,
  $move,
  pluck,
  prepend,
  $prepend,
  randomChoice,
  rangeInt,
  replace,
  replaceAt,
  // shift, // Not exported
  shuffle,
  swap,
  truncate,
  uniq,
  $uniq,
  uniqBy,
  zipWith
} from '../../../src/parray/index.js';

describe('parray - Extended Operations', () => {
  describe('associateBy', () => {
    const data = [
      { id: 1, category: "fruit", name: "apple", price: 100 },
      { id: 2, category: "fruit", name: "banana", price: 200 },
      { id: 3, category: "vegetable", name: "carrot", price: 300 },
    ];

    test('기본 사용 (객체 전체 저장)', () => {
      const result = associateBy(data, "id");
      expect(result).toEqual({
        1: { id: 1, category: "fruit", name: "apple", price: 100 },
        2: { id: 2, category: "fruit", name: "banana", price: 200 },
        3: { id: 3, category: "vegetable", name: "carrot", price: 300 }
      });
    });

    test('특정 속성 값만 저장', () => {
      const result = associateBy(data, "id", "name");
      expect(result).toEqual({
        1: "apple",
        2: "banana",
        3: "carrot"
      });
    });

    test('변환 함수를 적용하여 저장', () => {
      const result = associateBy(data, "id", (item) => `${item.name} (${item.price}원)`);
      expect(result).toEqual({
        1: "apple (100원)",
        2: "banana (200원)",
        3: "carrot (300원)"
      });
    });

    test('같은 키가 여러 개 있을 경우 마지막 값 저장', () => {
      const duplicateData = [
        { id: 1, name: "first" },
        { id: 1, name: "second" },
        { id: 1, name: "last" }
      ];
      const result = associateBy(duplicateData, "id", "name");
      expect(result).toEqual({ 1: "last" });
    });
  });

  describe('chunks', () => {
    test('배열을 지정된 크기로 분할', () => {
      expect(chunks([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
      expect(chunks([1, 2, 3, 4, 5, 6], 3)).toEqual([[1, 2, 3], [4, 5, 6]]);
    });

    test('크기가 배열보다 클 때', () => {
      expect(chunks([1, 2, 3], 5)).toEqual([[1, 2, 3]]);
    });

    test('빈 배열', () => {
      expect(chunks([], 2)).toEqual([]);
    });

    test('크기가 1일 때', () => {
      expect(chunks([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
    });
  });

  describe('groupBy', () => {
    const data = [
      { category: "fruit", name: "apple", price: 100 },
      { category: "fruit", name: "banana", price: 200 },
      { category: "vegetable", name: "carrot", price: 300 }
    ];

    test('기본 그룹화 (객체 전체)', () => {
      const result = groupBy(data, "category");
      expect(result).toEqual({
        "fruit": [
          { category: "fruit", name: "apple", price: 100 },
          { category: "fruit", name: "banana", price: 200 }
        ],
        "vegetable": [
          { category: "vegetable", name: "carrot", price: 300 }
        ]
      });
    });

    test('특정 속성만 선택하여 그룹화', () => {
      const result = groupBy(data, "category", "price");
      expect(result).toEqual({
        "fruit": [100, 200],
        "vegetable": [300]
      });
    });

    test('변환 함수를 적용하여 그룹화', () => {
      const result = groupBy(data, "category", item => item.name.toUpperCase());
      expect(result).toEqual({
        "fruit": ["APPLE", "BANANA"],
        "vegetable": ["CARROT"]
      });
    });

    test('빈 배열', () => {
      expect(groupBy([], "category")).toEqual({});
    });
  });

  describe('isArrayEqual', () => {
    test('같은 배열들에 대해 true', () => {
      expect(isArrayEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(isArrayEqual([], [])).toBe(true);
      expect(isArrayEqual(['a', 'b'], ['a', 'b'])).toBe(true);
    });

    test('다른 배열들에 대해 false', () => {
      expect(isArrayEqual([1, 2, 3], [1, 2, 4])).toBe(false);
      expect(isArrayEqual([1, 2], [1, 2, 3])).toBe(false);
      expect(isArrayEqual([1, 2, 3], [3, 2, 1])).toBe(false);
    });

    test('배열이 아닌 값들에 대해 false', () => {
      expect(isArrayEqual([1, 2, 3], null)).toBe(false);
      expect(isArrayEqual(null, [1, 2, 3])).toBe(false);
      expect(isArrayEqual("string", [1, 2, 3])).toBe(false);
    });

    test('falsy 값들 포함', () => {
      expect(isArrayEqual([0, false, null], [0, false, null])).toBe(true);
      expect(isArrayEqual([0, false], [0, true])).toBe(false);
    });
  });

  describe('move', () => {
    test('배열 항목 이동 (원본 변경)', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = move(arr, 1, 3);
      
      expect(result).toBe(arr); // 원본 배열 반환
      expect(result).toEqual([1, 3, 4, 2, 5]); // 2가 인덱스 3으로 이동
    });

    test('음수 인덱스 처리', () => {
      const arr = [1, 2, 3, 4, 5];
      move(arr, -1, 0); // 마지막 요소를 처음으로
      expect(arr).toEqual([5, 1, 2, 3, 4]);
    });

    test('같은 인덱스로 이동', () => {
      const arr = [1, 2, 3];
      const result = move(arr, 1, 1);
      expect(result).toEqual([1, 2, 3]); // 변경 없음
    });

    test('빈 배열', () => {
      const arr: number[] = [];
      const result = move(arr, 0, 1);
      expect(result).toEqual([]);
    });
  });

  describe('$move', () => {
    test('불변 배열 항목 이동', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = $move(arr, 1, 3);
      
      expect(result).not.toBe(arr); // 새로운 배열
      expect(result).toEqual([1, 3, 4, 2, 5]); 
      expect(arr).toEqual([1, 2, 3, 4, 5]); // 원본 유지
    });
  });

  describe('isArrayEqual', () => {
    test('참조 동등성도 확인', () => {
      const arr = [1, 2, 3];
      expect(isArrayEqual(arr, arr)).toBe(true);
    });
  });

  describe('pluck', () => {
    test('객체 배열에서 특정 속성 추출', () => {
      const data = [
        { id: 1, name: "apple", price: 100 },
        { id: 2, name: "banana", price: 200 },
        { id: 3, name: "carrot", price: 300 }
      ];
      expect(pluck(data, "name")).toEqual(["apple", "banana", "carrot"]);
      expect(pluck(data, "price")).toEqual([100, 200, 300]);
    });

    test('빈 배열', () => {
      expect(pluck([], "name")).toEqual([]);
    });

    test('다양한 타입의 속성', () => {
      const data = [
        { active: true, count: 0 },
        { active: false, count: 5 }
      ];
      expect(pluck(data, "active")).toEqual([true, false]);
      expect(pluck(data, "count")).toEqual([0, 5]);
    });
  });

  describe('prepend', () => {
    test('배열 앞에 요소 추가 (원본 변경)', () => {
      const arr = [2, 3];
      const result = prepend(arr, [1, 0]);
      
      expect(result).toBe(arr); // 원본 배열 반환
      expect(result).toEqual([1, 0, 2, 3]);
    });

    test('중복 허용 (기본값)', () => {
      const arr = [2, 3];
      prepend(arr, [1, 2]);
      expect(arr).toEqual([1, 2, 2, 3]);
    });

    test('값 기준 중복 제거', () => {
      const arr = [2, 3];
      prepend(arr, [1, 2, 4], true);
      expect(arr).toEqual([4, 1, 2, 3]); // 2는 중복 제거, 4와 1 추가
    });

    test('함수 기준 중복 제거', () => {
      const arr = [{ id: 2, name: "b" }];
      prepend(arr, [{ id: 1, name: "a" }, { id: 2, name: "duplicate" }], x => x.id);
      expect(arr).toHaveLength(2);
      expect(arr[0]).toEqual({ id: 1, name: "a" }); 
      expect(arr[1]).toEqual({ id: 2, name: "b" }); // 기존 것 유지
    });

    test('빈 배열 추가', () => {
      const arr = [1, 2, 3];
      const result = prepend(arr, []);
      expect(result).toEqual([1, 2, 3]); // 변경 없음
    });
  });

  describe('$prepend', () => {
    test('불변 배열 앞에 요소 추가', () => {
      const arr = [2, 3];
      const result = $prepend(arr, [1, 0]);
      
      expect(result).not.toBe(arr); // 새로운 배열
      expect(result).toEqual([1, 0, 2, 3]);
      expect(arr).toEqual([2, 3]); // 원본 유지
    });

    test('중복 제거와 불변성', () => {
      const arr = [2, 3];
      const result = $prepend(arr, [1, 2], true);
      
      expect(result).not.toBe(arr);
      expect(result).toEqual([1, 2, 3]);
      expect(arr).toEqual([2, 3]); // 원본 유지
    });
  });

  describe('randomChoice', () => {
    test('배열에서 랜덤 요소 선택', () => {
      const arr = [1, 2, 3, 4, 5];
      const choice = randomChoice(arr);
      expect(arr).toContain(choice);
    });

    test('단일 요소 배열', () => {
      const arr = [42];
      expect(randomChoice(arr)).toBe(42);
    });

    test('빈 배열에서 에러', () => {
      expect(() => randomChoice([])).toThrow('invalid array');
    });

    test('여러 번 호출해도 항상 배열 요소 중 하나', () => {
      const arr = ['a', 'b', 'c'];
      for (let i = 0; i < 10; i++) {
        const choice = randomChoice(arr);
        expect(arr).toContain(choice);
      }
    });
  });

  describe('rangeInt (deprecated)', () => {
    test('지정된 개수의 정수 배열 생성', () => {
      expect(rangeInt(0)).toEqual([]);
      expect(rangeInt(1)).toEqual([0]);
      expect(rangeInt(5)).toEqual([0, 1, 2, 3, 4]);
    });

    test('소수점 반올림', () => {
      expect(rangeInt(3.7)).toEqual([0, 1, 2, 3]); // 4개 생성
      expect(rangeInt(3.2)).toEqual([0, 1, 2]); // 3개 생성
    });

    test('음수 처리', () => {
      expect(() => rangeInt(-5)).toThrow('Invalid array length'); // 음수는 배열 생성 불가
    });
  });

  describe('uniq', () => {
    test('중복 제거 (원본 변경)', () => {
      const arr = [1, 2, 2, 3, 1, 4];
      const result = uniq(arr);
      
      expect(result).toBe(arr); // 원본 배열 반환
      expect(result).toEqual([1, 2, 3, 4]);
    });

    test('중복이 없는 배열', () => {
      const arr = [1, 2, 3, 4];
      const result = uniq(arr);
      expect(result).toEqual([1, 2, 3, 4]); // 변경 없음
    });

    test('빈 배열', () => {
      const arr: number[] = [];
      expect(uniq(arr)).toEqual([]);
    });

    test('모든 요소가 같은 배열', () => {
      const arr = [5, 5, 5, 5];
      uniq(arr);
      expect(arr).toEqual([5]);
    });

    test('문자열 배열 중복 제거', () => {
      const arr = ['a', 'b', 'a', 'c', 'b'];
      uniq(arr);
      expect(arr).toEqual(['a', 'b', 'c']);
    });
  });

  describe('$uniq', () => {
    test('불변 중복 제거', () => {
      const arr = [1, 2, 2, 3, 1, 4];
      const result = $uniq(arr);
      
      expect(result).not.toBe(arr); // 새로운 배열
      expect(result).toEqual([1, 2, 3, 4]);
      expect(arr).toEqual([1, 2, 2, 3, 1, 4]); // 원본 유지
    });

    test('Set을 이용한 순서 유지', () => {
      const arr = ['c', 'a', 'b', 'a', 'c'];
      const result = $uniq(arr);
      expect(result).toEqual(['c', 'a', 'b']); // 첫 등장 순서 유지
    });
  });
});