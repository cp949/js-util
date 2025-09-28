import { describe, test, expect } from 'vitest';
import { toFixed } from '../../../src/pmath/toFixed.js';

describe('pmath - toFixed', () => {
  describe('숫자 입력', () => {
    test('기본 소수점 처리', () => {
      expect(toFixed(3.14159, 2)).toBe(3.14);
      expect(toFixed(3.14159, 3)).toBe(3.142);
      expect(toFixed(3.14159, 4)).toBe(3.1416);
    });

    test('반올림 처리', () => {
      expect(toFixed(3.145, 2)).toBe(3.15);
      expect(toFixed(3.144, 2)).toBe(3.14);
      expect(toFixed(2.675, 2)).toBe(2.67); // JavaScript의 부동소수점 특성상 2.675는 실제로는 2.6749999...
    });

    test('0 소수점 자릿수', () => {
      expect(toFixed(3.14159, 0)).toBe(3);
      expect(toFixed(3.7, 0)).toBe(4);
      expect(toFixed(3.3, 0)).toBe(3);
    });

    test('음수 처리', () => {
      expect(toFixed(-3.14159, 2)).toBe(-3.14);
      expect(toFixed(-3.145, 2)).toBe(-3.15);
      expect(toFixed(-3.144, 2)).toBe(-3.14);
    });

    test('0 처리', () => {
      expect(toFixed(0, 2)).toBe(0);
      expect(toFixed(-0, 2)).toBe(0);
    });

    test('정수 처리', () => {
      expect(toFixed(42, 2)).toBe(42);
      expect(toFixed(100, 0)).toBe(100);
      expect(toFixed(-42, 3)).toBe(-42);
    });

    test('매우 작은 숫자', () => {
      expect(toFixed(0.001, 2)).toBe(0);
      expect(toFixed(0.001, 3)).toBe(0.001);
      expect(toFixed(0.0001, 4)).toBe(0.0001);
    });

    test('매우 큰 숫자', () => {
      expect(toFixed(1234567.89, 1)).toBe(1234567.9);
      expect(toFixed(1e10, 2)).toBe(1e10);
      expect(toFixed(Number.MAX_SAFE_INTEGER, 0)).toBe(Number.MAX_SAFE_INTEGER);
    });
  });

  describe('문자열 입력', () => {
    test('유효한 숫자 문자열', () => {
      expect(toFixed('3.14159', 2)).toBe(3.14);
      expect(toFixed('42', 1)).toBe(42);
      expect(toFixed('-3.14159', 2)).toBe(-3.14);
    });

    test('정수 문자열', () => {
      expect(toFixed('100', 2)).toBe(100);
      expect(toFixed('-50', 1)).toBe(-50);
    });

    test('소수 문자열', () => {
      expect(toFixed('0.123', 2)).toBe(0.12);
      expect(toFixed('0.999', 2)).toBe(1);
    });

    test('지수 표기법 문자열', () => {
      expect(toFixed('1e2', 1)).toBe(100);
      expect(toFixed('1.5e2', 0)).toBe(150);
      expect(toFixed('1e-2', 3)).toBe(0.01);
    });

    test('공백이 있는 문자열', () => {
      expect(toFixed(' 3.14 ', 2)).toBe(3.14);
      expect(toFixed('\t42\n', 1)).toBe(42);
    });
  });

  describe('edge cases', () => {
    test('Infinity와 NaN', () => {
      expect(toFixed(Infinity, 2)).toBe(Infinity);
      expect(toFixed(-Infinity, 2)).toBe(-Infinity);
      expect(isNaN(toFixed(NaN, 2))).toBe(true);
    });

    test('문자열 Infinity와 NaN', () => {
      expect(toFixed('Infinity', 2)).toBe(Infinity);
      expect(toFixed('-Infinity', 2)).toBe(-Infinity);
      expect(isNaN(toFixed('NaN', 2))).toBe(true);
    });

    test('높은 정밀도 요구', () => {
      expect(toFixed(3.14159265359, 10)).toBe(3.1415926536);
      expect(toFixed(1 / 3, 8)).toBe(0.33333333);
    });

    test('부동소수점 정밀도 이슈', () => {
      // 부동소수점 연산의 정밀도 한계 테스트
      const result = toFixed(0.1 + 0.2, 10);
      expect(result).toBeCloseTo(0.3, 10);
    });
  });

  describe('타입 검증', () => {
    test('반환값은 항상 number 타입', () => {
      const result1 = toFixed(3.14, 2);
      const result2 = toFixed('3.14', 2);

      expect(typeof result1).toBe('number');
      expect(typeof result2).toBe('number');

      // 네이티브 toFixed는 문자열을 반환하지만, 이 함수는 숫자를 반환
      expect(typeof (3.14).toFixed(2)).toBe('string');
      expect(typeof toFixed(3.14, 2)).toBe('number');
    });

    test('네이티브 Number.toFixed()와 결과 비교', () => {
      const testCases = [
        [3.14159, 2],
        [42, 1],
        [0.123, 3],
        [-3.14, 2],
      ] as const;

      testCases.forEach(([value, digits]) => {
        const native = Number(value.toFixed(digits));
        const custom = toFixed(value, digits);
        expect(custom).toBe(native);
      });
    });
  });

  describe('성능 테스트', () => {
    test('대량 연산 성능', () => {
      const iterations = 1000;
      const start = performance.now();

      for (let i = 0; i < iterations; i++) {
        toFixed(Math.random() * 1000, 2);
      }

      const end = performance.now();
      // 1000번 연산이 100ms 이내에 완료되어야 함
      expect(end - start).toBeLessThan(100);
    });
  });

  describe('일관성 테스트', () => {
    test('같은 입력에 대해 일관된 결과', () => {
      const testValue = 3.14159;
      const testDigits = 3;

      const result1 = toFixed(testValue, testDigits);
      const result2 = toFixed(testValue, testDigits);
      const result3 = toFixed(testValue.toString(), testDigits);

      expect(result1).toBe(result2);
      expect(result1).toBe(result3);
    });

    test('숫자와 문자열 입력 결과 동일성', () => {
      const testCases = [
        [42, '42'],
        [3.14, '3.14'],
        [-123.456, '-123.456'],
        [0, '0'],
      ];

      testCases.forEach(([num, str]) => {
        for (let digits = 0; digits <= 5; digits++) {
          expect(toFixed(num, digits)).toBe(toFixed(str, digits));
        }
      });
    });
  });
});
