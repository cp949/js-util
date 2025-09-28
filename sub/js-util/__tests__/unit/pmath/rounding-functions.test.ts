import { describe, test, expect } from 'vitest';
import {
  roundf, roundf1, roundf2, roundf3, roundf4, roundf5,
  roundi, roundi1, roundi2, roundi3, roundi4, roundi5
} from '../../../src/pmath/round.js';

describe('pmath - Rounding Functions', () => {
  describe('roundf - 소수점 반올림', () => {
    test('기본 동작 (fractionDigits = 0)', () => {
      expect(roundf(3.7)).toBe(4);
      expect(roundf(3.2)).toBe(3);
      expect(roundf(-2.8)).toBe(-3);
      expect(roundf(-2.2)).toBe(-2);
    });

    test('소수점 자릿수 지정', () => {
      expect(roundf(3.14159, 2)).toBe(3.14);
      expect(roundf(3.14159, 3)).toBe(3.142);
      expect(roundf(3.14159, 4)).toBe(3.1416);
    });

    test('0 이하의 fractionDigits', () => {
      expect(roundf(3.7, 0)).toBe(4);
      expect(roundf(3.7, -1)).toBe(4); // 0 이하일 때는 Math.round와 동일
    });

    test('정확성 테스트', () => {
      // 부동소수점 정밀도 문제를 고려한 테스트
      // JavaScript의 부동소수점 특성상 1.005는 정확하게 표현되지 않음
      expect(roundf(1.005, 2)).toBe(1.00); // 실제 IEEE 754 결과
      expect(roundf(2.675, 2)).toBe(2.68); // 실제 IEEE 754 결과
      expect(roundf(0.1 + 0.2, 1)).toBe(0.3);
    });

    test('큰 숫자와 음수', () => {
      expect(roundf(12345.6789, 2)).toBe(12345.68);
      expect(roundf(-12345.6789, 2)).toBe(-12345.68);
    });
  });

  describe('roundf 편의 함수들', () => {
    test('roundf1 - 소수점 첫째 자리', () => {
      expect(roundf1(3.14159)).toBe(3.1);
      expect(roundf1(3.16)).toBe(3.2);
      expect(roundf1(-2.85)).toBe(-2.8); // JavaScript의 Math.round는 0.5에서 짝수 방향으로 반올림
    });

    test('roundf2 - 소수점 둘째 자리', () => {
      expect(roundf2(3.14159)).toBe(3.14);
      expect(roundf2(3.146)).toBe(3.15);
      expect(roundf2(-2.855)).toBe(-2.85); // JavaScript의 Math.round는 0.5에서 짝수 방향으로 반올림
    });

    test('roundf3 - 소수점 셋째 자리', () => {
      expect(roundf3(3.14159)).toBe(3.142);
      expect(roundf3(3.1416)).toBe(3.142);
    });

    test('roundf4 - 소수점 넷째 자리', () => {
      expect(roundf4(3.14159)).toBe(3.1416);
      expect(roundf4(3.141592)).toBe(3.1416);
    });

    test('roundf5 - 소수점 다섯째 자리', () => {
      expect(roundf5(3.141592653)).toBe(3.14159);
      expect(roundf5(3.141596)).toBe(3.1416);
    });

    test('이미 짧은 소수점을 가진 숫자', () => {
      expect(roundf3(3.1)).toBe(3.1);
      expect(roundf2(3)).toBe(3);
      expect(roundf1(0)).toBe(0);
    });
  });

  describe('roundi - 정수 자릿수 반올림', () => {
    test('기본 동작 (digits = 0)', () => {
      expect(roundi(37)).toBe(37);
      expect(roundi(37.8)).toBe(38);
      expect(roundi(-27.2)).toBe(-27);
    });

    test('자릿수 지정', () => {
      expect(roundi(1234, 1)).toBe(1230); // 10의 자리로 반올림
      expect(roundi(1234, 2)).toBe(1200); // 100의 자리로 반올림
      expect(roundi(1234, 3)).toBe(1000); // 1000의 자리로 반올림
      expect(roundi(1678, 3)).toBe(2000);
    });

    test('0 이하의 digits', () => {
      expect(roundi(37.8, 0)).toBe(38);
      expect(roundi(37.8, -1)).toBe(38); // 0 이하일 때는 Math.round와 동일
    });

    test('경계값 테스트', () => {
      expect(roundi(15, 1)).toBe(20); // 15는 20으로 반올림
      expect(roundi(14, 1)).toBe(10); // 14는 10으로 반올림
      expect(roundi(125, 2)).toBe(100); // 125는 100으로 반올림
      expect(roundi(150, 2)).toBe(200); // 150은 200으로 반올림
    });

    test('음수', () => {
      expect(roundi(-1234, 1)).toBe(-1230);
      expect(roundi(-1678, 3)).toBe(-2000);
    });
  });

  describe('roundi 편의 함수들', () => {
    test('roundi1 - 10의 자리', () => {
      expect(roundi1(123)).toBe(120);
      expect(roundi1(127)).toBe(130);
      expect(roundi1(125)).toBe(130);
      expect(roundi1(-127)).toBe(-130);
    });

    test('roundi2 - 100의 자리', () => {
      expect(roundi2(1234)).toBe(1200);
      expect(roundi2(1678)).toBe(1700);
      expect(roundi2(1550)).toBe(1600);
      expect(roundi2(-1678)).toBe(-1700);
    });

    test('roundi3 - 1000의 자리', () => {
      expect(roundi3(12340)).toBe(12000);
      expect(roundi3(16780)).toBe(17000);
      expect(roundi3(15500)).toBe(16000);
    });

    test('roundi4 - 10000의 자리', () => {
      expect(roundi4(123400)).toBe(120000);
      expect(roundi4(167800)).toBe(170000);
    });

    test('roundi5 - 100000의 자리', () => {
      expect(roundi5(1234000)).toBe(1200000);
      expect(roundi5(1678000)).toBe(1700000);
    });

    test('작은 숫자들', () => {
      expect(roundi2(50)).toBe(100);
      expect(roundi3(500)).toBe(1000);
      expect(roundi4(5000)).toBe(10000);
      expect(roundi5(50000)).toBe(100000);
    });
  });

  describe('특수 케이스', () => {
    test('0 처리', () => {
      expect(roundf(0, 2)).toBe(0);
      expect(roundi(0, 3)).toBe(0);
      expect(roundf3(0)).toBe(0);
      expect(roundi3(0)).toBe(0);
    });

    test('매우 작은 수', () => {
      expect(roundf(0.0001, 3)).toBe(0);
      expect(roundf(0.0006, 3)).toBe(0.001);
    });

    test('매우 큰 수', () => {
      expect(roundf(Number.MAX_SAFE_INTEGER, 2)).toBe(Number.MAX_SAFE_INTEGER);
      // roundi(Number.MAX_SAFE_INTEGER, 1)은 10의 자리로 반올림하므로 결과가 다를 수 있음
      // 9007199254740991 -> 9007199254740990
      expect(roundi(Number.MAX_SAFE_INTEGER, 1)).toBe(9007199254740990);
    });

    test('Infinity와 NaN', () => {
      expect(roundf(Infinity, 2)).toBe(Infinity);
      expect(roundf(-Infinity, 2)).toBe(-Infinity);
      expect(isNaN(roundf(NaN, 2))).toBe(true);
      
      expect(roundi(Infinity, 2)).toBe(Infinity);
      expect(roundi(-Infinity, 2)).toBe(-Infinity);
      expect(isNaN(roundi(NaN, 2))).toBe(true);
    });
  });

  describe('성능 관련', () => {
    test('편의 함수들의 일관성', () => {
      const testValue = 3.14159265359;
      
      expect(roundf1(testValue)).toBe(roundf(testValue, 1));
      expect(roundf2(testValue)).toBe(roundf(testValue, 2));
      expect(roundf3(testValue)).toBe(roundf(testValue, 3));
      expect(roundf4(testValue)).toBe(roundf(testValue, 4));
      expect(roundf5(testValue)).toBe(roundf(testValue, 5));
    });

    test('정수 반올림 편의 함수들의 일관성', () => {
      const testValue = 12345.67;
      
      expect(roundi1(testValue)).toBe(roundi(testValue, 1));
      expect(roundi2(testValue)).toBe(roundi(testValue, 2));
      expect(roundi3(testValue)).toBe(roundi(testValue, 3));
      expect(roundi4(testValue)).toBe(roundi(testValue, 4));
      expect(roundi5(testValue)).toBe(roundi(testValue, 5));
    });
  });
});