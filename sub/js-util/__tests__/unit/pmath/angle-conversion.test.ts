import { describe, test, expect } from 'vitest';
import { degToRad } from '../../../src/pmath/degToRad.js';
import { radToDeg } from '../../../src/pmath/radToDeg.js';

describe('pmath - Angle Conversion Functions', () => {
  describe('degToRad - 도를 라디안으로 변환', () => {
    test('기본적인 각도 변환', () => {
      expect(degToRad(0)).toBe(0);
      expect(degToRad(180)).toBeCloseTo(Math.PI, 10);
      expect(degToRad(90)).toBeCloseTo(Math.PI / 2, 10);
      expect(degToRad(270)).toBeCloseTo((3 * Math.PI) / 2, 10);
      expect(degToRad(360)).toBeCloseTo(2 * Math.PI, 10);
    });

    test('음수 각도', () => {
      expect(degToRad(-90)).toBeCloseTo(-Math.PI / 2, 10);
      expect(degToRad(-180)).toBeCloseTo(-Math.PI, 10);
      expect(degToRad(-360)).toBeCloseTo(-2 * Math.PI, 10);
    });

    test('소수점 각도', () => {
      expect(degToRad(45)).toBeCloseTo(Math.PI / 4, 10);
      expect(degToRad(30)).toBeCloseTo(Math.PI / 6, 10);
      expect(degToRad(60)).toBeCloseTo(Math.PI / 3, 10);
      expect(degToRad(45.5)).toBeCloseTo((45.5 * Math.PI) / 180, 10);
    });

    test('큰 각도 (360도 초과)', () => {
      expect(degToRad(720)).toBeCloseTo(4 * Math.PI, 10);
      expect(degToRad(450)).toBeCloseTo(2.5 * Math.PI, 10);
    });

    test('매우 작은 각도', () => {
      expect(degToRad(0.001)).toBeCloseTo((0.001 * Math.PI) / 180, 12);
      expect(degToRad(0.1)).toBeCloseTo((0.1 * Math.PI) / 180, 10);
    });
  });

  describe('radToDeg - 라디안을 도로 변환', () => {
    test('기본적인 라디안 변환', () => {
      expect(radToDeg(0)).toBe(0);
      expect(radToDeg(Math.PI)).toBeCloseTo(180, 10);
      expect(radToDeg(Math.PI / 2)).toBeCloseTo(90, 10);
      expect(radToDeg((3 * Math.PI) / 2)).toBeCloseTo(270, 10);
      expect(radToDeg(2 * Math.PI)).toBeCloseTo(360, 10);
    });

    test('음수 라디안', () => {
      expect(radToDeg(-Math.PI / 2)).toBeCloseTo(-90, 10);
      expect(radToDeg(-Math.PI)).toBeCloseTo(-180, 10);
      expect(radToDeg(-2 * Math.PI)).toBeCloseTo(-360, 10);
    });

    test('소수점 라디안', () => {
      expect(radToDeg(Math.PI / 4)).toBeCloseTo(45, 10);
      expect(radToDeg(Math.PI / 6)).toBeCloseTo(30, 10);
      expect(radToDeg(Math.PI / 3)).toBeCloseTo(60, 10);
    });

    test('큰 라디안 (2π 초과)', () => {
      expect(radToDeg(4 * Math.PI)).toBeCloseTo(720, 10);
      expect(radToDeg(2.5 * Math.PI)).toBeCloseTo(450, 10);
    });

    test('매우 작은 라디안', () => {
      expect(radToDeg(0.001)).toBeCloseTo((0.001 * 180) / Math.PI, 10);
      expect(radToDeg(0.1)).toBeCloseTo((0.1 * 180) / Math.PI, 10);
    });
  });

  describe('변환 일관성 테스트', () => {
    test('도 → 라디안 → 도 왕복 변환', () => {
      const testAngles = [0, 30, 45, 60, 90, 120, 180, 270, 360, -90, -180];

      testAngles.forEach((angle) => {
        const result = radToDeg(degToRad(angle));
        expect(result).toBeCloseTo(angle, 10);
      });
    });

    test('라디안 → 도 → 라디안 왕복 변환', () => {
      const testRadians = [
        0,
        Math.PI / 6,
        Math.PI / 4,
        Math.PI / 3,
        Math.PI / 2,
        Math.PI,
        2 * Math.PI,
        -Math.PI / 2,
        -Math.PI,
      ];

      testRadians.forEach((radian) => {
        const result = degToRad(radToDeg(radian));
        expect(result).toBeCloseTo(radian, 10);
      });
    });

    test('소수점을 가진 값들의 왕복 변환', () => {
      const testValues = [12.5, 33.33, 66.67, 123.456, -45.78];

      testValues.forEach((deg) => {
        expect(radToDeg(degToRad(deg))).toBeCloseTo(deg, 8);
      });

      const testRadians = [0.123, 1.234, 2.345, -0.456, -1.789];
      testRadians.forEach((rad) => {
        expect(degToRad(radToDeg(rad))).toBeCloseTo(rad, 8);
      });
    });
  });

  describe('특수값 처리', () => {
    test('Infinity 처리', () => {
      expect(degToRad(Infinity)).toBe(Infinity);
      expect(degToRad(-Infinity)).toBe(-Infinity);
      expect(radToDeg(Infinity)).toBe(Infinity);
      expect(radToDeg(-Infinity)).toBe(-Infinity);
    });

    test('NaN 처리', () => {
      expect(isNaN(degToRad(NaN))).toBe(true);
      expect(isNaN(radToDeg(NaN))).toBe(true);
    });

    test('0의 처리 (양수/음수 0)', () => {
      expect(degToRad(0)).toBe(0);
      expect(degToRad(-0)).toBe(-0);
      expect(radToDeg(0)).toBe(0);
      expect(radToDeg(-0)).toBe(-0);
    });
  });

  describe('정밀도 테스트', () => {
    test('높은 정밀도가 요구되는 각도', () => {
      // π/180의 정밀도 테스트
      const preciseDegree = 1;
      const preciseRadian = Math.PI / 180;

      expect(degToRad(preciseDegree)).toBeCloseTo(preciseRadian, 15);
      expect(radToDeg(preciseRadian)).toBeCloseTo(preciseDegree, 15);
    });

    test('매우 작은 각도의 정밀도', () => {
      const smallDegree = 0.000001;
      const smallRadian = (smallDegree * Math.PI) / 180;

      expect(degToRad(smallDegree)).toBeCloseTo(smallRadian, 15);
      expect(radToDeg(smallRadian)).toBeCloseTo(smallDegree, 15);
    });
  });

  describe('실제 사용 사례', () => {
    test('삼각함수와의 연동', () => {
      // sin(30°) = 0.5
      expect(Math.sin(degToRad(30))).toBeCloseTo(0.5, 10);

      // cos(60°) = 0.5
      expect(Math.cos(degToRad(60))).toBeCloseTo(0.5, 10);

      // tan(45°) = 1
      expect(Math.tan(degToRad(45))).toBeCloseTo(1, 10);
    });

    test('아크 함수의 결과를 도로 변환', () => {
      // asin(0.5) = 30°
      expect(radToDeg(Math.asin(0.5))).toBeCloseTo(30, 10);

      // acos(0.5) = 60°
      expect(radToDeg(Math.acos(0.5))).toBeCloseTo(60, 10);

      // atan(1) = 45°
      expect(radToDeg(Math.atan(1))).toBeCloseTo(45, 10);
    });

    test('원주율 관련 각도', () => {
      // π 라디안 = 180도
      expect(radToDeg(Math.PI)).toBeCloseTo(180, 12);

      // 2π 라디안 = 360도
      expect(radToDeg(2 * Math.PI)).toBeCloseTo(360, 12);

      // π/2 라디안 = 90도
      expect(radToDeg(Math.PI / 2)).toBeCloseTo(90, 12);
    });
  });
});
