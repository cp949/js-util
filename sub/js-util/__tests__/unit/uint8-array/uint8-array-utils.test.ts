import { describe, test, expect, beforeEach } from 'vitest';
import {
  isUint8Array,
  assertUint8Array,
  toUint8Array,
  concatUint8Arrays,
  areUint8ArraysEqual,
  compareUint8Arrays,
  uint8ArrayToString,
  stringToUint8Array,
  uint8ArrayToBase64,
  base64ToUint8Array,
  stringToBase64,
  base64ToString,
  uint8ArrayToHex,
  hexToUint8Array,
  indexOf,
  includes,
} from '../../../src/uint8-array/index.js';

describe('uint8-array 모듈', () => {
  describe('isUint8Array', () => {
    test('Uint8Array 인스턴스에 대해 true 반환', () => {
      expect(isUint8Array(new Uint8Array())).toBe(true);
      expect(isUint8Array(new Uint8Array([1, 2, 3]))).toBe(true);
      expect(isUint8Array(new Uint8Array(10))).toBe(true);
    });

    test('다른 TypedArray들에 대해 false 반환', () => {
      expect(isUint8Array(new Int8Array())).toBe(false);
      expect(isUint8Array(new Uint16Array())).toBe(false);
      expect(isUint8Array(new Float32Array())).toBe(false);
      expect(isUint8Array(new BigInt64Array(1))).toBe(false);
    });

    test('일반적인 값들에 대해 false 반환', () => {
      expect(isUint8Array(null)).toBe(false);
      expect(isUint8Array(undefined)).toBe(false);
      expect(isUint8Array([])).toBe(false);
      expect(isUint8Array({})).toBe(false);
      expect(isUint8Array('string')).toBe(false);
      expect(isUint8Array(123)).toBe(false);
      expect(isUint8Array(true)).toBe(false);
    });

    test('ArrayBuffer에 대해 false 반환', () => {
      expect(isUint8Array(new ArrayBuffer(10))).toBe(false);
    });
  });

  describe('assertUint8Array', () => {
    test('Uint8Array에 대해 예외를 발생시키지 않음', () => {
      expect(() => assertUint8Array(new Uint8Array())).not.toThrow();
      expect(() => assertUint8Array(new Uint8Array([1, 2, 3]))).not.toThrow();
    });

    test('Uint8Array가 아닌 값에 대해 TypeError 발생', () => {
      expect(() => assertUint8Array(null)).toThrow(TypeError);
      expect(() => assertUint8Array([])).toThrow(TypeError);
      expect(() => assertUint8Array('string')).toThrow(TypeError);
      expect(() => assertUint8Array(new ArrayBuffer(10))).toThrow(TypeError);
    });

    test('에러 메시지가 올바른 타입 정보를 포함', () => {
      expect(() => assertUint8Array('string')).toThrow('Expected `Uint8Array`, got `string`');
      expect(() => assertUint8Array(123)).toThrow('Expected `Uint8Array`, got `number`');
    });
  });

  describe('toUint8Array', () => {
    test('ArrayBuffer를 Uint8Array로 변환', () => {
      const buffer = new ArrayBuffer(4);
      const view = new DataView(buffer);
      view.setUint32(0, 0x12345678);

      const result = toUint8Array(buffer);
      expect(isUint8Array(result)).toBe(true);
      expect(result.length).toBe(4);
    });

    test('다른 TypedArray를 Uint8Array로 변환', () => {
      const int16Array = new Int16Array([256, 512]); // 2 bytes each
      const result = toUint8Array(int16Array);

      expect(isUint8Array(result)).toBe(true);
      expect(result.length).toBe(4); // 2 elements × 2 bytes each
    });

    test('DataView를 Uint8Array로 변환', () => {
      const buffer = new ArrayBuffer(8);
      const dataView = new DataView(buffer, 2, 4); // offset=2, length=4

      const result = toUint8Array(dataView);
      expect(isUint8Array(result)).toBe(true);
      expect(result.length).toBe(4);
    });

    test('지원하지 않는 타입에 대해 TypeError 발생', () => {
      expect(() => toUint8Array(null as any)).toThrow(TypeError);
      expect(() => toUint8Array('string' as any)).toThrow(TypeError);
      expect(() => toUint8Array(123 as any)).toThrow(TypeError);
    });
  });

  describe('concatUint8Arrays', () => {
    test('여러 배열을 연결', () => {
      const a = new Uint8Array([1, 2]);
      const b = new Uint8Array([3, 4]);
      const c = new Uint8Array([5, 6]);

      const result = concatUint8Arrays([a, b, c]);
      expect(result).toEqual(new Uint8Array([1, 2, 3, 4, 5, 6]));
    });

    test('빈 배열에 대해 빈 Uint8Array 반환', () => {
      const result = concatUint8Arrays([]);
      expect(result).toEqual(new Uint8Array(0));
    });

    test('단일 배열 연결', () => {
      const a = new Uint8Array([1, 2, 3]);
      const result = concatUint8Arrays([a]);
      expect(result).toEqual(new Uint8Array([1, 2, 3]));
    });

    test('totalLength 매개변수 사용', () => {
      const a = new Uint8Array([1, 2]);
      const b = new Uint8Array([3, 4]);

      const result = concatUint8Arrays([a, b], 4);
      expect(result.length).toBe(4);
      expect(result).toEqual(new Uint8Array([1, 2, 3, 4]));
    });

    test('totalLength가 실제보다 클 때', () => {
      const a = new Uint8Array([1, 2]);
      const result = concatUint8Arrays([a], 5);
      expect(result.length).toBe(5);
      expect(result[0]).toBe(1);
      expect(result[1]).toBe(2);
      expect(result[2]).toBe(0); // 나머지는 0으로 채워짐
    });
  });

  describe('areUint8ArraysEqual', () => {
    test('동일한 배열들에 대해 true 반환', () => {
      const a = new Uint8Array([1, 2, 3]);
      const b = new Uint8Array([1, 2, 3]);
      expect(areUint8ArraysEqual(a, b)).toBe(true);
    });

    test('같은 참조에 대해 true 반환', () => {
      const a = new Uint8Array([1, 2, 3]);
      expect(areUint8ArraysEqual(a, a)).toBe(true);
    });

    test('다른 내용의 배열들에 대해 false 반환', () => {
      const a = new Uint8Array([1, 2, 3]);
      const b = new Uint8Array([1, 2, 4]);
      expect(areUint8ArraysEqual(a, b)).toBe(false);
    });

    test('길이가 다른 배열들에 대해 false 반환', () => {
      const a = new Uint8Array([1, 2, 3]);
      const b = new Uint8Array([1, 2]);
      expect(areUint8ArraysEqual(a, b)).toBe(false);
    });

    test('빈 배열들에 대해 true 반환', () => {
      const a = new Uint8Array();
      const b = new Uint8Array();
      expect(areUint8ArraysEqual(a, b)).toBe(true);
    });
  });

  describe('compareUint8Arrays', () => {
    test('첫 번째 배열이 작을 때 -1 반환', () => {
      const a = new Uint8Array([1, 2, 3]);
      const b = new Uint8Array([1, 2, 4]);
      expect(compareUint8Arrays(a, b)).toBe(-1);
    });

    test('첫 번째 배열이 클 때 1 반환', () => {
      const a = new Uint8Array([1, 2, 4]);
      const b = new Uint8Array([1, 2, 3]);
      expect(compareUint8Arrays(a, b)).toBe(1);
    });

    test('같은 내용일 때 0 반환', () => {
      const a = new Uint8Array([1, 2, 3]);
      const b = new Uint8Array([1, 2, 3]);
      expect(compareUint8Arrays(a, b)).toBe(0);
    });

    test('길이가 다르지만 공통 부분이 같을 때', () => {
      const a = new Uint8Array([1, 2]);
      const b = new Uint8Array([1, 2, 3]);
      expect(compareUint8Arrays(a, b)).toBe(-1); // 짧은 배열이 먼저 와야 함
    });

    test('첫 번째가 더 길 때', () => {
      const a = new Uint8Array([1, 2, 3]);
      const b = new Uint8Array([1, 2]);
      expect(compareUint8Arrays(a, b)).toBe(1);
    });
  });

  describe('uint8ArrayToString과 stringToUint8Array', () => {
    test('기본 UTF-8 변환', () => {
      const text = 'Hello, World!';
      const array = stringToUint8Array(text);
      const recovered = uint8ArrayToString(array);
      expect(recovered).toBe(text);
    });

    test('유니코드 문자 처리', () => {
      const text = '안녕하세요! 🎉';
      const array = stringToUint8Array(text);
      const recovered = uint8ArrayToString(array);
      expect(recovered).toBe(text);
    });

    test('빈 문자열 처리', () => {
      const text = '';
      const array = stringToUint8Array(text);
      const recovered = uint8ArrayToString(array);
      expect(recovered).toBe(text);
      expect(array.length).toBe(0);
    });

    test('특수 문자 처리', () => {
      const text = '\\n\\t\\r\\"\\\\';
      const array = stringToUint8Array(text);
      const recovered = uint8ArrayToString(array);
      expect(recovered).toBe(text);
    });
  });

  describe('Base64 변환 함수들', () => {
    test('uint8ArrayToBase64와 base64ToUint8Array', () => {
      const original = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
      const base64 = uint8ArrayToBase64(original);
      const recovered = base64ToUint8Array(base64);
      expect(areUint8ArraysEqual(original, recovered)).toBe(true);
    });

    test('URL-safe Base64 변환', () => {
      const original = new Uint8Array([255, 255, 255]); // 패딩이 필요한 경우
      const base64 = uint8ArrayToBase64(original, { urlSafe: true });
      expect(base64).not.toContain('+');
      expect(base64).not.toContain('/');

      const recovered = base64ToUint8Array(base64);
      expect(areUint8ArraysEqual(original, recovered)).toBe(true);
    });

    test('stringToBase64와 base64ToString', () => {
      const text = 'Hello, World!';
      const base64 = stringToBase64(text);
      const recovered = base64ToString(base64);
      expect(recovered).toBe(text);
    });

    test('URL-safe 문자열 Base64 변환', () => {
      const text = 'Hello, World!';
      const base64 = stringToBase64(text, { urlSafe: true });
      expect(typeof base64).toBe('string');

      const recovered = base64ToString(base64);
      expect(recovered).toBe(text);
    });

    test('빈 데이터 Base64 변환', () => {
      const empty = new Uint8Array();
      const base64 = uint8ArrayToBase64(empty);
      const recovered = base64ToUint8Array(base64);
      expect(areUint8ArraysEqual(empty, recovered)).toBe(true);
    });
  });

  describe('Hex 변환 함수들', () => {
    test('uint8ArrayToHex와 hexToUint8Array', () => {
      const original = new Uint8Array([0, 15, 255, 128]);
      const hex = uint8ArrayToHex(original);
      expect(hex).toBe('000fff80');

      const recovered = hexToUint8Array(hex);
      expect(areUint8ArraysEqual(original, recovered)).toBe(true);
    });

    test('대소문자 구분 없는 Hex 디코딩', () => {
      const lowerCase = 'deadbeef';
      const upperCase = 'DEADBEEF';

      const fromLower = hexToUint8Array(lowerCase);
      const fromUpper = hexToUint8Array(upperCase);

      expect(areUint8ArraysEqual(fromLower, fromUpper)).toBe(true);
    });

    test('빈 배열 Hex 변환', () => {
      const empty = new Uint8Array();
      const hex = uint8ArrayToHex(empty);
      expect(hex).toBe('');

      const recovered = hexToUint8Array(hex);
      expect(areUint8ArraysEqual(empty, recovered)).toBe(true);
    });

    test('잘못된 Hex 문자열 처리', () => {
      expect(() => hexToUint8Array('xyz')).toThrow();
      expect(() => hexToUint8Array('deadbeefg')).toThrow(); // 잘못된 문자
    });
  });

  describe('indexOf와 includes', () => {
    test('indexOf - 패턴을 찾을 수 있는 경우', () => {
      const array = new Uint8Array([1, 2, 3, 4, 5, 6]);
      const pattern = new Uint8Array([3, 4]);

      expect(indexOf(array, pattern)).toBe(2);
    });

    test('indexOf - 패턴을 찾을 수 없는 경우', () => {
      const array = new Uint8Array([1, 2, 3, 4, 5, 6]);
      const pattern = new Uint8Array([7, 8]);

      expect(indexOf(array, pattern)).toBe(-1);
    });

    test('indexOf - 빈 패턴', () => {
      const array = new Uint8Array([1, 2, 3]);
      const pattern = new Uint8Array();

      // 실제 구현에서는 빈 패턴에 대해 -1을 반환함
      expect(indexOf(array, pattern)).toBe(-1);
    });

    test('indexOf - 배열보다 긴 패턴', () => {
      const array = new Uint8Array([1, 2]);
      const pattern = new Uint8Array([1, 2, 3]);

      expect(indexOf(array, pattern)).toBe(-1);
    });

    test('includes - 패턴이 포함된 경우', () => {
      const array = new Uint8Array([1, 2, 3, 4, 5]);
      const pattern = new Uint8Array([2, 3, 4]);

      expect(includes(array, pattern)).toBe(true);
    });

    test('includes - 패턴이 포함되지 않은 경우', () => {
      const array = new Uint8Array([1, 2, 3, 4, 5]);
      const pattern = new Uint8Array([6, 7]);

      expect(includes(array, pattern)).toBe(false);
    });

    test('includes - 완전히 동일한 배열', () => {
      const array = new Uint8Array([1, 2, 3]);
      const pattern = new Uint8Array([1, 2, 3]);

      expect(includes(array, pattern)).toBe(true);
    });
  });

  describe('엣지 케이스와 에러 처리', () => {
    test('assertUint8Array가 다른 함수들에서 올바르게 작동', () => {
      expect(() => areUint8ArraysEqual(null as any, new Uint8Array())).toThrow(TypeError);
      expect(() => compareUint8Arrays(new Uint8Array(), 'string' as any)).toThrow(TypeError);
    });

    test('매우 큰 배열 처리', () => {
      const size = 10000;
      const large = new Uint8Array(size);
      for (let i = 0; i < size; i++) {
        large[i] = i % 256;
      }

      expect(isUint8Array(large)).toBe(true);
      expect(large.length).toBe(size);
    });

    test('0 값들로만 이루어진 배열', () => {
      const zeros = new Uint8Array(100);
      expect(isUint8Array(zeros)).toBe(true);
      expect(zeros.every((v) => v === 0)).toBe(true);
    });
  });
});
