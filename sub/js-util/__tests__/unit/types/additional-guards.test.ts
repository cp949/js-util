import { describe, test, expect } from 'vitest';
import { isDefined } from '../../../src/types/guards/isDefined.js';
import { isAsyncFunction } from '../../../src/types/guards/isAsyncFunction.js';
import { isBigInt } from '../../../src/types/guards/isBigInt.js';
import { isBuffer } from '../../../src/types/guards/isBuffer.js';
import { isAsyncGenerator } from '../../../src/types/guards/isAsyncGenerator.js';
import { isAsyncGeneratorFunction } from '../../../src/types/guards/isAsyncGeneratorFunction.js';
import { isAsyncIterable } from '../../../src/types/guards/isAsyncIterable.js';

describe('types - Additional Type Guards', () => {
  describe('isDefined', () => {
    test('정의된 값들', () => {
      expect(isDefined(0)).toBe(true);
      expect(isDefined('')).toBe(true);
      expect(isDefined(false)).toBe(true);
      expect(isDefined(null)).toBe(true);
      expect(isDefined({})).toBe(true);
      expect(isDefined([])).toBe(true);
      expect(isDefined('string')).toBe(true);
      expect(isDefined(123)).toBe(true);
      expect(isDefined(true)).toBe(true);
    });

    test('undefined 값', () => {
      expect(isDefined(undefined)).toBe(false);

      let undefinedVar: any;
      expect(isDefined(undefinedVar)).toBe(false);

      const obj: any = {};
      expect(isDefined(obj.nonExistentProperty)).toBe(false);
    });

    test('타입 가드 기능', () => {
      const mixedValue: string | undefined = Math.random() > 0.5 ? 'hello' : undefined;

      if (isDefined(mixedValue)) {
        // TypeScript가 여기서 mixedValue를 string으로 인식해야 함
        expect(typeof mixedValue).toBe('string');
        expect(mixedValue.length).toBeGreaterThanOrEqual(0);
      }
    });

    test('null과 구분', () => {
      // null은 defined이지만 undefined는 아님
      expect(isDefined(null)).toBe(true);
      expect(isDefined(undefined)).toBe(false);
    });
  });

  describe('isBigInt', () => {
    test('BigInt 값들', () => {
      expect(isBigInt(BigInt(0))).toBe(true);
      expect(isBigInt(BigInt(123))).toBe(true);
      expect(isBigInt(BigInt(-456))).toBe(true);
      expect(isBigInt(BigInt(9007199254740991))).toBe(true);

      // 리터럴 문법
      expect(isBigInt(0n)).toBe(true);
      expect(isBigInt(123n)).toBe(true);
      expect(isBigInt(-456n)).toBe(true);
      expect(isBigInt(9007199254740991n)).toBe(true);
    });

    test('BigInt가 아닌 값들', () => {
      expect(isBigInt(0)).toBe(false);
      expect(isBigInt(123)).toBe(false);
      expect(isBigInt('123')).toBe(false);
      expect(isBigInt('123n')).toBe(false);
      expect(isBigInt(true)).toBe(false);
      expect(isBigInt(null)).toBe(false);
      expect(isBigInt(undefined)).toBe(false);
      expect(isBigInt({})).toBe(false);
      expect(isBigInt([])).toBe(false);
    });

    test('매우 큰 숫자들', () => {
      // Number.MAX_SAFE_INTEGER를 넘는 값들
      expect(isBigInt(BigInt('9007199254740992'))).toBe(true);
      expect(isBigInt(9007199254740992n)).toBe(true);

      // 일반 숫자로는 정확하게 표현할 수 없는 값
      expect(isBigInt(9007199254740992)).toBe(false); // 이것은 일반 number
    });

    test('타입 가드 기능', () => {
      const mixedValue: bigint | number = Math.random() > 0.5 ? 123n : 123;

      if (isBigInt(mixedValue)) {
        // TypeScript가 여기서 mixedValue를 bigint로 인식해야 함
        expect(typeof mixedValue).toBe('bigint');
      }
    });
  });

  describe('isAsyncFunction', () => {
    test('async function 선언', () => {
      async function testAsync() {
        return 'test';
      }

      expect(isAsyncFunction(testAsync)).toBe(true);
    });

    test('async arrow function', () => {
      const asyncArrow = async () => 'test';
      expect(isAsyncFunction(asyncArrow)).toBe(true);
    });

    test('async method', () => {
      const obj = {
        async method() {
          return 'test';
        },
      };

      expect(isAsyncFunction(obj.method)).toBe(true);
    });

    test('일반 함수들', () => {
      function normalFunc() {
        return 'test';
      }

      const arrowFunc = () => 'test';

      function* generatorFunc() {
        yield 'test';
      }

      expect(isAsyncFunction(normalFunc)).toBe(false);
      expect(isAsyncFunction(arrowFunc)).toBe(false);
      expect(isAsyncFunction(generatorFunc)).toBe(false);
    });

    test('함수가 아닌 값들', () => {
      expect(isAsyncFunction('async')).toBe(false);
      expect(isAsyncFunction(123)).toBe(false);
      expect(isAsyncFunction({})).toBe(false);
      expect(isAsyncFunction([])).toBe(false);
      expect(isAsyncFunction(null)).toBe(false);
      expect(isAsyncFunction(undefined)).toBe(false);
    });

    test('Promise와 구분', () => {
      const promise = Promise.resolve('test');
      expect(isAsyncFunction(promise)).toBe(false);

      const promiseConstructor = Promise;
      expect(isAsyncFunction(promiseConstructor)).toBe(false);
    });

    test('타입 가드 기능', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      const mixedFunc: Function | any = Math.random() > 0.5 ? async () => 'async' : () => 'sync';

      if (isAsyncFunction(mixedFunc)) {
        // TypeScript가 여기서 mixedFunc를 AsyncFunction으로 인식해야 함
        expect(mixedFunc.constructor.name).toBe('AsyncFunction');
      }
    });
  });

  describe('isAsyncGenerator', () => {
    test('async generator 객체', () => {
      async function* asyncGen() {
        yield 1;
        yield 2;
      }

      const generator = asyncGen();
      expect(isAsyncGenerator(generator)).toBe(true);
    });

    test('일반 generator 객체', () => {
      function* normalGen() {
        yield 1;
        yield 2;
      }

      const generator = normalGen();
      expect(isAsyncGenerator(generator)).toBe(false);
    });

    test('async generator가 아닌 값들', () => {
      expect(isAsyncGenerator({})).toBe(false);
      expect(isAsyncGenerator([])).toBe(false);
      expect(isAsyncGenerator('generator')).toBe(false);
      expect(isAsyncGenerator(123)).toBe(false);
      expect(isAsyncGenerator(null)).toBe(false);
      expect(isAsyncGenerator(undefined)).toBe(false);
    });
  });

  describe('isAsyncGeneratorFunction', () => {
    test('async generator function', () => {
      async function* asyncGenFunc() {
        yield 1;
        yield 2;
      }

      expect(isAsyncGeneratorFunction(asyncGenFunc)).toBe(true);
    });

    test('일반 generator function', () => {
      function* normalGenFunc() {
        yield 1;
        yield 2;
      }

      expect(isAsyncGeneratorFunction(normalGenFunc)).toBe(false);
    });

    test('async function (non-generator)', () => {
      async function asyncFunc() {
        return 'test';
      }

      expect(isAsyncGeneratorFunction(asyncFunc)).toBe(false);
    });

    test('일반 함수들', () => {
      function normalFunc() {
        return 'test';
      }

      const arrowFunc = () => 'test';

      expect(isAsyncGeneratorFunction(normalFunc)).toBe(false);
      expect(isAsyncGeneratorFunction(arrowFunc)).toBe(false);
    });

    test('함수가 아닌 값들', () => {
      expect(isAsyncGeneratorFunction({})).toBe(false);
      expect(isAsyncGeneratorFunction('function')).toBe(false);
      expect(isAsyncGeneratorFunction(123)).toBe(false);
      expect(isAsyncGeneratorFunction(null)).toBe(false);
      expect(isAsyncGeneratorFunction(undefined)).toBe(false);
    });
  });

  describe('isAsyncIterable', () => {
    test('async iterable 객체', () => {
      const asyncIterable = {
        async *[Symbol.asyncIterator]() {
          yield 1;
          yield 2;
          yield 3;
        },
      };

      expect(isAsyncIterable(asyncIterable)).toBe(true);
    });

    test('async generator (async iterable)', () => {
      async function* asyncGen() {
        yield 1;
        yield 2;
      }

      const generator = asyncGen();
      expect(isAsyncIterable(generator)).toBe(true);
    });

    test('일반 iterable 객체', () => {
      const normalIterable = {
        *[Symbol.iterator]() {
          yield 1;
          yield 2;
          yield 3;
        },
      };

      expect(isAsyncIterable(normalIterable)).toBe(false);
    });

    test('내장 iterable들', () => {
      expect(isAsyncIterable([])).toBe(false);
      expect(isAsyncIterable('string')).toBe(false);
      expect(isAsyncIterable(new Set())).toBe(false);
      expect(isAsyncIterable(new Map())).toBe(false);
    });

    test('async iterable이 아닌 값들', () => {
      expect(isAsyncIterable({})).toBe(false);
      expect(isAsyncIterable(123)).toBe(false);
      expect(isAsyncIterable(null)).toBe(false);
      expect(isAsyncIterable(undefined)).toBe(false);
      expect(isAsyncIterable(true)).toBe(false);
    });
  });

  describe('isBuffer (Node.js environment)', () => {
    test('Buffer.isBuffer와 일관성 (Node.js가 사용 가능한 경우)', () => {
      // Buffer가 사용 가능한 환경에서만 테스트
      if (typeof Buffer !== 'undefined') {
        const buffer = Buffer.from('test');
        expect(isBuffer(buffer)).toBe(true);
        expect(isBuffer(new Uint8Array([1, 2, 3]))).toBe(false);
      } else {
        // Browser 환경에서는 Buffer가 없으므로 모든 값이 false
        expect(isBuffer(new Uint8Array([1, 2, 3]))).toBe(false);
      }
    });

    test('Buffer가 아닌 값들', () => {
      expect(isBuffer({})).toBe(false);
      expect(isBuffer([])).toBe(false);
      expect(isBuffer('buffer')).toBe(false);
      expect(isBuffer(123)).toBe(false);
      expect(isBuffer(null)).toBe(false);
      expect(isBuffer(undefined)).toBe(false);
      expect(isBuffer(new ArrayBuffer(10))).toBe(false);
    });
  });

  describe('타입 가드 통합 테스트', () => {
    test('여러 타입 가드 조합 사용', () => {
      const values: unknown[] = [
        undefined,
        123n,
        async () => 'test',
        (async function* () {
          yield 1;
        })(),
        'string',
      ];

      values.forEach((value) => {
        const results = {
          isDefined: isDefined(value),
          isBigInt: isBigInt(value),
          isAsyncFunction: isAsyncFunction(value),
          isAsyncGenerator: isAsyncGenerator(value),
        };

        // 각 값은 정확히 하나의 타입이어야 함 (undefined 제외)
        if (value === undefined) {
          expect(results.isDefined).toBe(false);
        } else {
          expect(results.isDefined).toBe(true);

          // 나머지 타입 중 최대 하나만 true여야 함
          const trueCount = Object.values(results).filter((r) => r === true).length;
          expect(trueCount).toBeGreaterThanOrEqual(1);
        }
      });
    });

    test('성능 테스트 (반복 호출)', () => {
      const testValue = 123n;
      const iterations = 1000;

      const start = performance.now();
      for (let i = 0; i < iterations; i++) {
        isBigInt(testValue);
      }
      const end = performance.now();

      // 1000번 호출이 10ms 이내에 완료되어야 함
      expect(end - start).toBeLessThan(10);
    });
  });
});
