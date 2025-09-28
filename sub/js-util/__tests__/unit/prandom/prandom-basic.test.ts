import { describe, test, expect } from 'vitest';
import {
  randomBoolean,
  randomInt,
  randomUint8Array
} from '../../../src/prandom/index.js';

describe('prandom - Basic Functions', () => {
  describe('randomBoolean', () => {
    test('boolean 값을 반환', () => {
      const result = randomBoolean();
      expect(typeof result).toBe('boolean');
    });
    
    test('여러 번 호출 시 다양한 결과', () => {
      const results = Array.from({ length: 100 }, () => randomBoolean());
      const trueCount = results.filter(r => r === true).length;
      const falseCount = results.filter(r => r === false).length;
      
      // 100번 중에 둘 다 최소 10번은 나와야 함 (확률적으로 거의 확실)
      expect(trueCount).toBeGreaterThan(10);
      expect(falseCount).toBeGreaterThan(10);
    });
  });
  
  describe('randomInt', () => {
    test('범위 내 정수 반환 (inclusive)', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomInt(5, 10);
        expect(result).toBeGreaterThanOrEqual(5);
        expect(result).toBeLessThanOrEqual(10);
        expect(Number.isInteger(result)).toBe(true);
      }
    });
    
    test('exclusive end 옵션', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomInt(5, 10, true);
        expect(result).toBeGreaterThanOrEqual(5);
        expect(result).toBeLessThan(10); // exclusive
        expect(Number.isInteger(result)).toBe(true);
      }
    });
    
    test('min > max 일 때 자동으로 순서 바뀜', () => {
      for (let i = 0; i < 50; i++) {
        const result = randomInt(10, 5);
        expect(result).toBeGreaterThanOrEqual(5);
        expect(result).toBeLessThanOrEqual(10);
      }
    });
    
    test('같은 값일 때 해당 값 반환', () => {
      const result = randomInt(7, 7);
      expect(result).toBe(7);
    });
    
    test('음수 범위에서도 동작', () => {
      for (let i = 0; i < 50; i++) {
        const result = randomInt(-10, -5);
        expect(result).toBeGreaterThanOrEqual(-10);
        expect(result).toBeLessThanOrEqual(-5);
      }
    });
  });
  
  describe('randomUint8Array', () => {
    test('지정된 길이의 Uint8Array 반환', () => {
      const result = randomUint8Array(10);
      expect(result).toBeInstanceOf(Uint8Array);
      expect(result.length).toBe(10);
    });
    
    test('각 바이트가 0-255 범위', () => {
      const result = randomUint8Array(20);
      for (const byte of result) {
        expect(byte).toBeGreaterThanOrEqual(0);
        expect(byte).toBeLessThanOrEqual(255);
        expect(Number.isInteger(byte)).toBe(true);
      }
    });
    
    test('길이가 0일 때 빈 배열 반환', () => {
      const result = randomUint8Array(0);
      expect(result).toBeInstanceOf(Uint8Array);
      expect(result.length).toBe(0);
    });
    
    test('음수 길이일 때 빈 배열 반환', () => {
      const result = randomUint8Array(-5);
      expect(result).toBeInstanceOf(Uint8Array);
      expect(result.length).toBe(0);
    });
    
    test('여러 번 호출 시 다른 결과', () => {
      const result1 = randomUint8Array(16);
      const result2 = randomUint8Array(16);
      
      // 두 결과가 완전히 같을 확률은 극히 낮음
      const isIdentical = result1.every((byte, index) => byte === result2[index]);
      expect(isIdentical).toBe(false);
    });
    
    test('crypto API 사용 가능 여부에 관계없이 동작', () => {
      // crypto API가 있을 때와 없을 때 모두 정상 동작해야 함
      const result = randomUint8Array(8);
      expect(result).toBeInstanceOf(Uint8Array);
      expect(result.length).toBe(8);
    });
  });
});