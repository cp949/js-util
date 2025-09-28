import { describe, test, expect } from 'vitest';
import {
  circIn, circOut, circInOut,
  elasticIn, elasticOut, elasticInOut,
  expoIn, expoOut, expoInOut,
  quartIn, quartOut, quartInOut,
  quintIn, quintOut, quintInOut,
  sineIn, sineOut, sineInOut
} from '../../../src/easing/index.js';

describe('easing - Additional Easing Functions', () => {
  describe('circular (circ) 이징', () => {
    test('경계값 테스트', () => {
      expect(circIn(0)).toBe(0);
      expect(circIn(1)).toBe(1);
      expect(circOut(0)).toBe(0);
      expect(circOut(1)).toBe(1);
      expect(circInOut(0)).toBe(0);
      expect(circInOut(1)).toBe(1);
    });

    test('중간값에서의 동작', () => {
      // circIn: 1 - sqrt(1 - x^2)
      const circInHalf = circIn(0.5);
      const expected = 1 - Math.sqrt(1 - 0.25); // 1 - sqrt(0.75)
      expect(circInHalf).toBeCloseTo(expected, 6);

      // circOut: sqrt(1 - (x-1)^2)
      const circOutHalf = circOut(0.5);
      const expectedOut = Math.sqrt(1 - 0.25); // sqrt(0.75)
      expect(circOutHalf).toBeCloseTo(expectedOut, 6);

      // circInOut: 0.5에서는 0.5여야 함
      expect(circInOut(0.5)).toBeCloseTo(0.5, 6);
    });

    test('함수 연속성', () => {
      // circOut과 circIn의 관계 확인
      const x = 0.3;
      const circInValue = circIn(x);
      const circOutValue = circOut(1 - x);
      expect(circInValue).toBeCloseTo(1 - circOutValue, 6);
    });

    test('원형 곡선의 특성', () => {
      // 모든 값이 0과 1 사이에 있어야 함 (back/elastic과 달리)
      for (let i = 0; i <= 10; i++) {
        const x = i / 10;
        expect(circIn(x)).toBeGreaterThanOrEqual(0);
        expect(circIn(x)).toBeLessThanOrEqual(1);
        expect(circOut(x)).toBeGreaterThanOrEqual(0);
        expect(circOut(x)).toBeLessThanOrEqual(1);
        expect(circInOut(x)).toBeGreaterThanOrEqual(0);
        expect(circInOut(x)).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('elastic 이징', () => {
    test('경계값 테스트', () => {
      expect(elasticIn(0)).toBe(0);
      expect(elasticIn(1)).toBe(1);
      expect(elasticOut(0)).toBe(0);
      expect(elasticOut(1)).toBe(1);
      expect(elasticInOut(0)).toBe(0);
      expect(elasticInOut(1)).toBe(1);
    });

    test('특별한 값들에서의 정확한 반환', () => {
      // elasticIn과 elasticOut은 x=0, x=1일 때 특별 처리
      expect(elasticIn(0)).toBe(0);
      expect(elasticIn(1)).toBe(1);
      expect(elasticOut(0)).toBe(0);
      expect(elasticOut(1)).toBe(1);
      expect(elasticInOut(0)).toBe(0);
      expect(elasticInOut(1)).toBe(1);
    });

    test('중간값에서의 동작', () => {
      expect(elasticInOut(0.5)).toBeCloseTo(0.5, 6);
    });

    test('elastic 함수의 진동 특성', () => {
      // elasticOut은 1 근처에서 진동하며 오버슈트할 수 있음
      const x = 0.1;
      const elasticOutValue = elasticOut(x);
      expect(typeof elasticOutValue).toBe('number');
      expect(isFinite(elasticOutValue)).toBe(true);

      // elasticIn은 0 근처에서 진동하며 음수값을 가질 수 있음
      const elasticInValue = elasticIn(0.9);
      expect(typeof elasticInValue).toBe('number');
      expect(isFinite(elasticInValue)).toBe(true);
    });

    test('함수들 간의 관계', () => {
      // elasticIn(x) + elasticOut(1-x)가 대략 1이 되어야 함 (대칭성)
      const x = 0.3;
      const sumValue = elasticIn(x) + elasticOut(1 - x);
      expect(sumValue).toBeCloseTo(1, 1); // 진동 때문에 정확하지 않을 수 있음
    });
  });

  describe('exponential (expo) 이징', () => {
    test('경계값 테스트', () => {
      expect(expoIn(0)).toBe(0);
      expect(expoIn(1)).toBe(1);
      expect(expoOut(0)).toBeCloseTo(0, 6);
      expect(expoOut(1)).toBe(1);
      expect(expoInOut(0)).toBe(0);
      expect(expoInOut(1)).toBe(1);
    });

    test('중간값에서의 동작', () => {
      // expoIn: x === 0 ? 0 : 2^(10x - 10)
      const expoInHalf = expoIn(0.5);
      const expected = Math.pow(2, 10 * 0.5 - 10); // 2^(-5) = 1/32
      expect(expoInHalf).toBeCloseTo(expected, 6);

      // expoOut: x === 1 ? 1 : 1 - 2^(-10x)
      const expoOutHalf = expoOut(0.5);
      const expectedOut = 1 - Math.pow(2, -10 * 0.5); // 1 - 2^(-5)
      expect(expoOutHalf).toBeCloseTo(expectedOut, 6);

      // expoInOut: 0.5에서는 0.5여야 함
      expect(expoInOut(0.5)).toBeCloseTo(0.5, 6);
    });

    test('지수 함수의 특성', () => {
      // expoIn은 x=0에서만 정확히 0, 나머지는 작은 양수
      expect(expoIn(0)).toBe(0);
      expect(expoIn(0.1)).toBeGreaterThan(0);
      expect(expoIn(0.1)).toBeLessThan(0.1);

      // expoOut은 x=1에서만 정확히 1, 나머지는 1보다 작음
      expect(expoOut(1)).toBe(1);
      expect(expoOut(0.9)).toBeLessThan(1);
      expect(expoOut(0.9)).toBeGreaterThan(0.9);
    });

    test('함수들 간의 관계', () => {
      // expoIn(x) = 1 - expoOut(1-x)
      const x = 0.3;
      expect(expoIn(x)).toBeCloseTo(1 - expoOut(1 - x), 6);
    });
  });

  describe('quartic (4차) 이징', () => {
    test('경계값 테스트', () => {
      expect(quartIn(0)).toBe(0);
      expect(quartIn(1)).toBe(1);
      expect(quartOut(0)).toBe(0);
      expect(quartOut(1)).toBe(1);
      expect(quartInOut(0)).toBe(0);
      expect(quartInOut(1)).toBe(1);
    });

    test('중간값에서의 동작', () => {
      // quartIn: x^4
      expect(quartIn(0.5)).toBe(0.5 * 0.5 * 0.5 * 0.5); // 0.0625

      // quartOut: 1 - (1-x)^4
      const quartOutHalf = quartOut(0.5);
      const expected = 1 - Math.pow(0.5, 4); // 1 - 0.0625 = 0.9375
      expect(quartOutHalf).toBe(expected);

      // quartInOut: 0.5에서는 0.5여야 함
      expect(quartInOut(0.5)).toBe(0.5);
    });

    test('특정 값에서의 정확성', () => {
      // quartIn(0.25) = 0.25^4
      expect(quartIn(0.25)).toBeCloseTo(Math.pow(0.25, 4), 8);

      // quartOut(0.75) = 1 - (1-0.75)^4 = 1 - 0.25^4
      expect(quartOut(0.75)).toBeCloseTo(1 - Math.pow(0.25, 4), 8);
    });

    test('함수 연속성', () => {
      // quartInOut의 0.5 지점에서 연속성 확인
      const epsilon = 1e-10;
      const leftValue = quartInOut(0.5 - epsilon);
      const rightValue = quartInOut(0.5 + epsilon);
      const centerValue = quartInOut(0.5);

      expect(Math.abs(leftValue - centerValue)).toBeLessThan(0.01);
      expect(Math.abs(rightValue - centerValue)).toBeLessThan(0.01);
    });
  });

  describe('quintic (5차) 이징', () => {
    test('경계값 테스트', () => {
      expect(quintIn(0)).toBe(0);
      expect(quintIn(1)).toBe(1);
      expect(quintOut(0)).toBe(0);
      expect(quintOut(1)).toBe(1);
      expect(quintInOut(0)).toBe(0);
      expect(quintInOut(1)).toBe(1);
    });

    test('중간값에서의 동작', () => {
      // quintIn: x^5
      expect(quintIn(0.5)).toBe(Math.pow(0.5, 5)); // 0.03125

      // quintOut: 1 - (1-x)^5
      const quintOutHalf = quintOut(0.5);
      const expected = 1 - Math.pow(0.5, 5); // 1 - 0.03125 = 0.96875
      expect(quintOutHalf).toBe(expected);

      // quintInOut: 0.5에서는 0.5여야 함
      expect(quintInOut(0.5)).toBe(0.5);
    });

    test('특정 값에서의 정확성', () => {
      // quintIn(0.2) = 0.2^5 = 0.00032
      expect(quintIn(0.2)).toBeCloseTo(Math.pow(0.2, 5), 8);

      // quintOut(0.8) = 1 - (1-0.8)^5 = 1 - 0.2^5
      expect(quintOut(0.8)).toBeCloseTo(1 - Math.pow(0.2, 5), 8);
    });

    test('차수별 비교', () => {
      // 동일한 x값에서 quintIn < quartIn < cubicIn < quadIn (x < 1일 때)
      const x = 0.5;
      expect(quintIn(x)).toBeLessThan(quartIn(x));
      expect(quintIn(x)).toBeLessThan(Math.pow(x, 3)); // cubic equivalent
      expect(quintIn(x)).toBeLessThan(Math.pow(x, 2)); // quad equivalent
    });
  });

  describe('sine 이징', () => {
    test('경계값 테스트', () => {
      expect(sineIn(0)).toBe(0);
      expect(sineIn(1)).toBeCloseTo(1, 6);
      expect(sineOut(0)).toBe(0);
      expect(sineOut(1)).toBe(1);
      expect(sineInOut(0)).toBeCloseTo(0, 6);
      expect(sineInOut(1)).toBe(1);
    });

    test('중간값에서의 동작', () => {
      // sineIn: 1 - cos(x * π/2)
      const sineInHalf = sineIn(0.5);
      const expected = 1 - Math.cos((0.5 * Math.PI) / 2); // 1 - cos(π/4)
      expect(sineInHalf).toBeCloseTo(expected, 6);

      // sineOut: sin(x * π/2)
      const sineOutHalf = sineOut(0.5);
      const expectedOut = Math.sin((0.5 * Math.PI) / 2); // sin(π/4)
      expect(sineOutHalf).toBeCloseTo(expectedOut, 6);

      // sineInOut: -(cos(πx) - 1) / 2
      expect(sineInOut(0.5)).toBeCloseTo(0.5, 6);
    });

    test('삼각함수의 특성', () => {
      // sineIn(0.25) + sineOut(0.25)는 특별한 관계를 가짐
      const x = 0.25;
      const sineInValue = sineIn(x);
      const sineOutValue = sineOut(x);

      // sineIn(x) + sineOut(1-x) = 1 (대칭성)
      expect(sineIn(x) + sineOut(1 - x)).toBeCloseTo(1, 6);
    });

    test('특정 각도에서의 정확성', () => {
      // sineOut(0.5) = sin(π/4) = √2/2
      expect(sineOut(0.5)).toBeCloseTo(Math.sin(Math.PI / 4), 6);

      // sineIn(0.5) = 1 - cos(π/4) = 1 - √2/2
      expect(sineIn(0.5)).toBeCloseTo(1 - Math.cos(Math.PI / 4), 6);

      // sineInOut의 특정 값들 - sineInOut(x) = -(cos(π*x) - 1) / 2
      expect(sineInOut(0.25)).toBeCloseTo(-(Math.cos(Math.PI * 0.25) - 1) / 2, 6); 
      expect(sineInOut(0.75)).toBeCloseTo(-(Math.cos(Math.PI * 0.75) - 1) / 2, 6);
    });
  });

  describe('모든 새로운 이징 함수의 공통 속성', () => {
    const newEasingFunctions = [
      { name: 'circIn', fn: circIn },
      { name: 'circOut', fn: circOut },
      { name: 'circInOut', fn: circInOut },
      { name: 'elasticIn', fn: elasticIn },
      { name: 'elasticOut', fn: elasticOut },
      { name: 'elasticInOut', fn: elasticInOut },
      { name: 'expoIn', fn: expoIn },
      { name: 'expoOut', fn: expoOut },
      { name: 'expoInOut', fn: expoInOut },
      { name: 'quartIn', fn: quartIn },
      { name: 'quartOut', fn: quartOut },
      { name: 'quartInOut', fn: quartInOut },
      { name: 'quintIn', fn: quintIn },
      { name: 'quintOut', fn: quintOut },
      { name: 'quintInOut', fn: quintInOut },
      { name: 'sineIn', fn: sineIn },
      { name: 'sineOut', fn: sineOut },
      { name: 'sineInOut', fn: sineInOut }
    ];

    test('모든 함수가 숫자를 반환', () => {
      newEasingFunctions.forEach(({ name, fn }) => {
        const result = fn(0.5);
        expect(typeof result, `${name} should return number`).toBe('number');
        expect(isFinite(result), `${name} should return finite number`).toBe(true);
      });
    });

    test('경계 조건 일관성', () => {
      newEasingFunctions.forEach(({ name, fn }) => {
        expect(fn(0), `${name}(0) should be 0`).toBeCloseTo(0, 6);
        expect(fn(1), `${name}(1) should be 1`).toBeCloseTo(1, 6);
      });
    });

    test('InOut 함수들의 중점 대칭성', () => {
      const inOutFunctions = newEasingFunctions.filter(({ name }) => name.endsWith('InOut'));
      
      inOutFunctions.forEach(({ name, fn }) => {
        expect(fn(0.5), `${name}(0.5) should be 0.5`).toBeCloseTo(0.5, 6);
      });
    });

    test('함수의 단조성 (일부 구간에서)', () => {
      // In 함수들은 단조증가
      const inFunctions = newEasingFunctions.filter(({ name }) => name.endsWith('In') && !name.includes('elastic'));
      
      inFunctions.forEach(({ name, fn }) => {
        const values = [0, 0.25, 0.5, 0.75, 1].map(fn);
        for (let i = 1; i < values.length; i++) {
          expect(values[i], `${name} should be monotonic increasing`).toBeGreaterThanOrEqual(values[i-1]);
        }
      });
    });

    test('극값 처리', () => {
      newEasingFunctions.forEach(({ name, fn }) => {
        expect(isNaN(fn(NaN)), `${name} should handle NaN`).toBe(true);
        
        const positiveInf = fn(Infinity);
        const negativeInf = fn(-Infinity);
        expect(typeof positiveInf, `${name} should handle +Infinity`).toBe('number');
        expect(typeof negativeInf, `${name} should handle -Infinity`).toBe('number');
      });
    });
  });

  describe('성능 테스트 - 새로운 이징 함수들', () => {
    test('대량 호출 성능', () => {
      const iterations = 5000;
      const startTime = performance.now();

      for (let i = 0; i < iterations; i++) {
        const x = i / iterations;
        // 가장 복잡한 함수들 테스트
        circInOut(x);
        elasticInOut(x);
        expoInOut(x);
        quintInOut(x);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // 5,000번 호출이 100ms 이내에 완료되어야 함
      expect(duration).toBeLessThan(100);
    });
  });
});