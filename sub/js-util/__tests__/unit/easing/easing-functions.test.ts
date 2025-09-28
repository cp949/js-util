import { describe, test, expect } from 'vitest';
import {
  linear,
  quadIn,
  quadOut,
  quadInOut,
  cubicIn,
  cubicOut,
  cubicInOut,
  backIn,
  backOut,
  backInOut,
  bounceIn,
  bounceOut,
  bounceInOut,
} from '../../../src/easing/index.js';

describe('easing - Easing Functions', () => {
  describe('linear', () => {
    test('선형 함수 기본 동작', () => {
      expect(linear(0)).toBe(0);
      expect(linear(0.5)).toBe(0.5);
      expect(linear(1)).toBe(1);
    });

    test('임의의 값에 대한 선형 동작', () => {
      expect(linear(0.25)).toBe(0.25);
      expect(linear(0.75)).toBe(0.75);
    });

    test('범위 밖 값 처리', () => {
      expect(linear(-0.5)).toBe(-0.5);
      expect(linear(1.5)).toBe(1.5);
    });
  });

  describe('quadratic (2차) 이징', () => {
    test('경계값 테스트', () => {
      // 모든 이징 함수는 0에서 0, 1에서 1이어야 함
      expect(quadIn(0)).toBe(0);
      expect(quadIn(1)).toBe(1);
      expect(quadOut(0)).toBe(0);
      expect(quadOut(1)).toBe(1);
      expect(quadInOut(0)).toBe(0);
      expect(quadInOut(1)).toBe(1);
    });

    test('중간값에서의 동작', () => {
      // quadIn: x^2이므로 0.5^2 = 0.25
      expect(quadIn(0.5)).toBe(0.25);

      // quadOut: 1 - (1-x)^2이므로 1 - (0.5)^2 = 0.75
      expect(quadOut(0.5)).toBe(0.75);

      // quadInOut: 0.5에서는 0.5여야 함
      expect(quadInOut(0.5)).toBe(0.5);
    });

    test('함수 연속성 - InOut은 0.5에서 연속', () => {
      const epsilon = 1e-10;
      const leftValue = quadInOut(0.5 - epsilon);
      const rightValue = quadInOut(0.5 + epsilon);
      const centerValue = quadInOut(0.5);

      expect(Math.abs(leftValue - centerValue)).toBeLessThan(0.01);
      expect(Math.abs(rightValue - centerValue)).toBeLessThan(0.01);
    });
  });

  describe('cubic (3차) 이징', () => {
    test('경계값 테스트', () => {
      expect(cubicIn(0)).toBe(0);
      expect(cubicIn(1)).toBe(1);
      expect(cubicOut(0)).toBe(0);
      expect(cubicOut(1)).toBe(1);
      expect(cubicInOut(0)).toBe(0);
      expect(cubicInOut(1)).toBe(1);
    });

    test('중간값에서의 동작', () => {
      // cubicIn: x^3이므로 0.5^3 = 0.125
      expect(cubicIn(0.5)).toBe(0.125);

      // cubicOut: 1 - (1-x)^3이므로 1 - (0.5)^3 = 0.875
      expect(cubicOut(0.5)).toBe(0.875);

      // cubicInOut: 0.5에서는 0.5여야 함
      expect(cubicInOut(0.5)).toBe(0.5);
    });

    test('특정 값에서의 정확성', () => {
      // cubicIn(0.25) = 0.25^3 = 0.015625
      expect(cubicIn(0.25)).toBeCloseTo(0.015625, 6);

      // cubicOut(0.75) = 1 - (1-0.75)^3 = 1 - 0.25^3 = 0.984375
      expect(cubicOut(0.75)).toBeCloseTo(0.984375, 6);
    });
  });

  describe('back 이징', () => {
    test('경계값 테스트', () => {
      expect(backIn(0)).toBeCloseTo(0, 6);
      expect(backIn(1)).toBeCloseTo(1, 6);
      expect(backOut(0)).toBeCloseTo(0, 6);
      expect(backOut(1)).toBeCloseTo(1, 6);
      expect(backInOut(0)).toBeCloseTo(0, 6);
      expect(backInOut(1)).toBeCloseTo(1, 6);
    });

    test('back 이징의 특성 - 음수값 생성', () => {
      // backIn은 초기에 음수값을 가질 수 있음 (뒤로 당기는 효과)
      const smallX = 0.1;
      const backInValue = backIn(smallX);
      expect(backInValue).toBeLessThan(0); // 음수여야 함
    });

    test('back 이징의 특성 - 1을 초과하는 값', () => {
      // backOut은 1을 초과하는 값을 가질 수 있음 (오버슈트 효과)
      const largeX = 0.9;
      const backOutValue = backOut(largeX);
      expect(backOutValue).toBeGreaterThan(1); // 1보다 커야 함
    });

    test('중간값에서의 연속성', () => {
      expect(backInOut(0.5)).toBeCloseTo(0.5, 6);
    });
  });

  describe('bounce 이징', () => {
    test('경계값 테스트', () => {
      expect(bounceIn(0)).toBeCloseTo(0, 6);
      expect(bounceIn(1)).toBeCloseTo(1, 6);
      expect(bounceOut(0)).toBeCloseTo(0, 6);
      expect(bounceOut(1)).toBeCloseTo(1, 6);
      expect(bounceInOut(0)).toBeCloseTo(0, 6);
      expect(bounceInOut(1)).toBeCloseTo(1, 6);
    });

    test('bounce 함수들 간의 관계', () => {
      // bounceIn(x) = 1 - bounceOut(1 - x)
      const x = 0.3;
      expect(bounceIn(x)).toBeCloseTo(1 - bounceOut(1 - x), 6);
    });

    test('bounceOut의 구간별 동작', () => {
      // 첫 번째 구간 (x < 1/2.75)
      const x1 = 0.2; // < 1/2.75 ≈ 0.364
      const result1 = bounceOut(x1);
      const expected1 = 7.5625 * x1 * x1;
      expect(result1).toBeCloseTo(expected1, 6);

      // 마지막 구간에서의 동작 확인
      const x4 = 0.99;
      const result4 = bounceOut(x4);
      expect(result4).toBeGreaterThan(0.9); // 높은 값이어야 함
      expect(result4).toBeLessThanOrEqual(1); // 1 이하여야 함
    });

    test('중간값에서의 연속성', () => {
      expect(bounceInOut(0.5)).toBeCloseTo(0.5, 6);
    });
  });

  describe('일반적인 이징 함수 속성', () => {
    const easingFunctions = [
      { name: 'quadIn', fn: quadIn },
      { name: 'quadOut', fn: quadOut },
      { name: 'quadInOut', fn: quadInOut },
      { name: 'cubicIn', fn: cubicIn },
      { name: 'cubicOut', fn: cubicOut },
      { name: 'cubicInOut', fn: cubicInOut },
      { name: 'backIn', fn: backIn },
      { name: 'backOut', fn: backOut },
      { name: 'backInOut', fn: backInOut },
      { name: 'bounceIn', fn: bounceIn },
      { name: 'bounceOut', fn: bounceOut },
      { name: 'bounceInOut', fn: bounceInOut },
      { name: 'linear', fn: linear },
    ];

    test('모든 함수가 숫자를 반환', () => {
      easingFunctions.forEach(({ name, fn }) => {
        const result = fn(0.5);
        expect(typeof result, `${name} should return number`).toBe('number');
        expect(isFinite(result), `${name} should return finite number`).toBe(true);
      });
    });

    test('NaN 입력에 대한 처리', () => {
      easingFunctions.forEach(({ name, fn }) => {
        const result = fn(NaN);
        // NaN 입력에 대해서는 NaN을 반환하는 것이 일반적
        expect(isNaN(result), `${name} should handle NaN input`).toBe(true);
      });
    });

    test('Infinity 입력에 대한 처리', () => {
      easingFunctions.forEach(({ name, fn }) => {
        const positiveInf = fn(Infinity);
        const negativeInf = fn(-Infinity);

        // Infinity 입력에 대해서는 함수가 크래시하지 않아야 함
        expect(typeof positiveInf, `${name} should handle +Infinity`).toBe('number');
        expect(typeof negativeInf, `${name} should handle -Infinity`).toBe('number');
      });
    });
  });

  describe('성능 테스트', () => {
    test('대량 호출 성능', () => {
      const iterations = 10000;
      const startTime = performance.now();

      for (let i = 0; i < iterations; i++) {
        const x = i / iterations;
        quadInOut(x);
        cubicInOut(x);
        backInOut(x);
        bounceInOut(x);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // 10,000번 호출이 100ms 이내에 완료되어야 함 (성능 테스트)
      expect(duration).toBeLessThan(100);
    });
  });
});
