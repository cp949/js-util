import { describe, test, expect } from 'vitest';
import {
  cos,
  cycle,
  fuzzyCeil,
  fuzzyEquals,
  fuzzyFloor,
  fuzzyGreaterThan,
  fuzzyLessThan,
  getPrecision,
  mapRange,
  range,
  sin,
  wrap,
  wrapIndexArray,
  wrapAngle180,
  wrapRange,
  wrapRangeArray
} from '../../../src/pmath/index.js';
import { sineInOut } from '../../../src/easing/index.js';

describe('pmath - Extended Math Functions', () => {
  describe('cos', () => {
    test('특정 각도에서 정확한 값 반환', () => {
      expect(cos(0)).toBe(1);
      expect(cos(Math.PI / 2)).toBe(0);
      expect(cos(Math.PI)).toBe(-1);
      expect(cos(3 * Math.PI / 2)).toBe(0);
    });

    test('일반적인 각도에서 Math.cos와 동일', () => {
      const angle = Math.PI / 4;
      expect(cos(angle)).toBeCloseTo(Math.cos(angle));
      expect(cos(Math.PI / 6)).toBeCloseTo(Math.cos(Math.PI / 6));
    });

    test('음수 각도 처리', () => {
      expect(cos(-Math.PI / 2)).toBe(0);
      expect(cos(-Math.PI)).toBe(-1);
    });
  });

  describe('cycle', () => {
    test('기본 사이클 동작 (sineInOut)', () => {
      expect(cycle(0)).toBeCloseTo(0);
      expect(cycle(0.25)).toBeCloseTo(sineInOut(0.5));
      expect(cycle(0.5)).toBe(1);
      expect(cycle(0.75)).toBeCloseTo(sineInOut(0.5));
      expect(cycle(1)).toBeCloseTo(0);
    });

    test('커스텀 메서드로 사이클', () => {
      const linear = (t: number) => t;
      expect(cycle(0, linear)).toBe(0);
      expect(cycle(0.25, linear)).toBe(0.5);
      expect(cycle(0.5, linear)).toBe(1);
      expect(cycle(0.75, linear)).toBe(0.5);
      expect(cycle(1, linear)).toBe(0);
    });

    test('경계값 처리', () => {
      expect(cycle(0)).toBeCloseTo(0);
      expect(cycle(1)).toBeCloseTo(0);
    });
  });

  describe('fuzzy 함수들', () => {
    describe('fuzzyEquals', () => {
      test('기본 엡실론으로 비교', () => {
        expect(fuzzyEquals(1, 1)).toBe(true);
        expect(fuzzyEquals(1, 1.00001)).toBe(true); // 0.00001 < 0.0001
        expect(fuzzyEquals(1, 0.99999)).toBe(true); // 0.00001 < 0.0001
        expect(fuzzyEquals(1, 1.001)).toBe(false); // 0.001 > 0.0001
      });

      test('커스텀 엡실론으로 비교', () => {
        expect(fuzzyEquals(1, 1.1, 0.2)).toBe(true);
        expect(fuzzyEquals(1, 1.3, 0.2)).toBe(false);
      });
    });

    describe('fuzzyCeil', () => {
      test('기본 엡실론으로 올림', () => {
        expect(fuzzyCeil(2.9999)).toBe(3); // 2.9999 - 0.0001 = 2.9998 → ceil(2.9998) = 3
        expect(fuzzyCeil(2.5)).toBe(3);
        expect(fuzzyCeil(3.0001)).toBe(3); // 3.0001 - 0.0001 = 3 → ceil(3) = 3
      });

      test('커스텀 엡실론으로 올림', () => {
        expect(fuzzyCeil(2.99, 0.1)).toBe(3);
        expect(fuzzyCeil(2.8, 0.1)).toBe(3);
      });
    });

    describe('fuzzyFloor', () => {
      test('기본 엡실론으로 내림', () => {
        expect(fuzzyFloor(3.0001)).toBe(3); // 3.0001 + 0.0001 = 3.0002 → floor(3.0002) = 3
        expect(fuzzyFloor(3.5)).toBe(3);
        expect(fuzzyFloor(2.9999)).toBe(3); // 2.9999 + 0.0001 = 3 → floor(3) = 3
      });

      test('커스텀 엡실론으로 내림', () => {
        expect(fuzzyFloor(3.01, 0.1)).toBe(3);
        expect(fuzzyFloor(3.2, 0.1)).toBe(3);
      });
    });

    describe('fuzzyGreaterThan', () => {
      test('기본 엡실론으로 비교', () => {
        expect(fuzzyGreaterThan(1.1, 1)).toBe(true);
        expect(fuzzyGreaterThan(1.00001, 1)).toBe(true);
        expect(fuzzyGreaterThan(0.9999, 1)).toBe(false); // 0.9999 > 1 - 0.0001 = 0.9999? false
        expect(fuzzyGreaterThan(0.999, 1)).toBe(false);
      });
    });

    describe('fuzzyLessThan', () => {
      test('기본 엡실론으로 비교', () => {
        expect(fuzzyLessThan(0.9, 1)).toBe(true);
        expect(fuzzyLessThan(0.99999, 1)).toBe(true);
        expect(fuzzyLessThan(1.00001, 1)).toBe(true); // 엡실론 범위내
        expect(fuzzyLessThan(1.001, 1)).toBe(false);
      });
    });
  });

  describe('getPrecision', () => {
    test('소수점 자릿수 계산', () => {
      expect(getPrecision(123)).toBe(0);
      expect(getPrecision(123.45)).toBe(2);
      expect(getPrecision(0.001)).toBe(3);
      expect(getPrecision(1.23456789)).toBe(8);
    });

    test('정수 처리', () => {
      expect(getPrecision(0)).toBe(0);
      expect(getPrecision(100)).toBe(0);
      expect(getPrecision(-50)).toBe(0);
    });

    test('과학적 표기법 처리', () => {
      expect(getPrecision(1e5)).toBe(0); // 100000은 정수
      expect(getPrecision(1e-3)).toBe(3); // 0.001은 소수점 3자리
    });
  });

  describe('mapRange', () => {
    test('범위 매핑', () => {
      expect(mapRange(5, 0, 10, 0, 100)).toBe(50);
      expect(mapRange(0, 0, 10, 50, 150)).toBe(50);
      expect(mapRange(10, 0, 10, 50, 150)).toBe(150);
    });

    test('역방향 매핑', () => {
      expect(mapRange(5, 0, 10, 100, 0)).toBe(50);
      expect(mapRange(2, 0, 10, 20, 10)).toBe(18);
    });

    test('같은 범위 처리', () => {
      expect(mapRange(5, 5, 5, 0, 100)).toBe(0); // h1 === l1이면 l2 반환
    });

    test('음수 범위', () => {
      expect(mapRange(0, -10, 10, 0, 100)).toBe(50);
      expect(mapRange(-5, -10, 0, 0, 100)).toBe(50);
    });
  });

  describe('range', () => {
    test('기본 증가 시퀀스', () => {
      const result = Array.from(range(0, 5));
      expect(result).toEqual([0, 1, 2, 3, 4]);
    });

    test('커스텀 스텝', () => {
      const result = Array.from(range(0, 10, 2));
      expect(result).toEqual([0, 2, 4, 6, 8]);
    });

    test('감소 시퀀스', () => {
      const result = Array.from(range(10, 5, -1));
      expect(result).toEqual([10, 9, 8, 7, 6]);
    });

    test('음수 스텝으로 감소', () => {
      const result = Array.from(range(10, 0, -2));
      expect(result).toEqual([10, 8, 6, 4, 2]);
    });

    test('0 스텝은 에러', () => {
      expect(() => Array.from(range(0, 5, 0))).toThrow('step cannot be 0');
    });

    test('빈 범위', () => {
      const result = Array.from(range(5, 5));
      expect(result).toEqual([]);
    });
  });

  describe('sin', () => {
    test('특정 각도에서 정확한 값 반환', () => {
      expect(sin(0)).toBe(0);
      expect(sin(Math.PI / 2)).toBe(1);
      expect(sin(Math.PI)).toBe(0);
      expect(sin(3 * Math.PI / 2)).toBe(-1);
    });

    test('일반적인 각도에서 Math.sin과 동일', () => {
      const angle = Math.PI / 4;
      expect(sin(angle)).toBeCloseTo(Math.sin(angle));
      expect(sin(Math.PI / 6)).toBeCloseTo(Math.sin(Math.PI / 6));
    });

    test('음수 각도 처리', () => {
      expect(sin(-Math.PI / 2)).toBe(-1);
      expect(sin(-Math.PI)).toBeCloseTo(0); // 부동소수점 오차
    });
  });

  describe('wrap', () => {
    test('포함적 범위에서 순환 (기본값)', () => {
      expect(wrap(5, 0, 4)).toBe(0);
      expect(wrap(-1, 0, 4)).toBe(4);
      expect(wrap(7, 1, 3)).toBe(1); // 7은 범위 1~3에서 1이 됨
      expect(wrap(3, 1, 3)).toBe(3);
    });

    test('비포함적 범위에서 순환', () => {
      expect(wrap(3, 1, 3, false)).toBe(1);
      expect(wrap(4, 0, 4, false)).toBe(0);
    });

    test('같은 min/max', () => {
      expect(wrap(5, 2, 2)).toBe(2);
      expect(wrap(-1, 2, 2)).toBe(2);
    });

    test('잘못된 범위 (min > max) 자동 수정', () => {
      expect(wrap(5, 4, 0)).toBe(0); // 실제로는 0~4 범위로 처리되고 5는 0이 됨
    });
  });

  describe('wrapIndexArray', () => {
    test('배열 인덱스 순환', () => {
      const array = { length: 4 };
      expect(wrapIndexArray(5, array)).toBe(1);
      expect(wrapIndexArray(-1, array)).toBe(3);
      expect(wrapIndexArray(0, array)).toBe(0);
      expect(wrapIndexArray(3, array)).toBe(3);
    });

    test('빈 배열 처리', () => {
      const array = { length: 0 };
      expect(wrapIndexArray(5, array)).toBe(-1); // wrap(5, 0, -1)
    });
  });

  describe('wrapAngle180', () => {
    test('범위 내 각도는 그대로 반환', () => {
      expect(wrapAngle180(0)).toBe(0);
      expect(wrapAngle180(90)).toBe(90);
      expect(wrapAngle180(-90)).toBe(-90);
      expect(wrapAngle180(180)).toBe(180);
      expect(wrapAngle180(-180)).toBe(-180);
    });

    test('범위를 벗어난 각도 순환', () => {
      expect(wrapAngle180(270)).toBe(-90);
      expect(wrapAngle180(450)).toBe(90);
      expect(wrapAngle180(-270)).toBe(90);
      expect(wrapAngle180(-450)).toBe(-90);
    });

    test('큰 각도 처리', () => {
      expect(wrapAngle180(720)).toBe(0);
      expect(wrapAngle180(1080)).toBe(0);
    });
  });

  describe('wrapRange (deprecated)', () => {
    test('기본 순환 동작', () => {
      expect(wrapRange(5, 0, 4)).toBe(0);
      expect(wrapRange(-1, 0, 4)).toBe(4);
      expect(wrapRange(7, 1, 3)).toBe(1); // wrapRange는 wrap()과 동일하게 동작
    });

    test('wrap() 함수와 동일한 결과 (inclusive)', () => {
      expect(wrapRange(5, 0, 4)).toBe(wrap(5, 0, 4, true));
      expect(wrapRange(-1, 0, 4)).toBe(wrap(-1, 0, 4, true));
    });
  });

  describe('wrapRangeArray (deprecated)', () => {
    test('wrapIndexArray와 동일한 결과', () => {
      const array = { length: 4 };
      expect(wrapRangeArray(5, array)).toBe(wrapIndexArray(5, array));
      expect(wrapRangeArray(-1, array)).toBe(wrapIndexArray(-1, array));
    });
  });
});