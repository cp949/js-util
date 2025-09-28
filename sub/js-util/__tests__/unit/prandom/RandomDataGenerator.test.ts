import { describe, test, expect, beforeEach } from 'vitest';
import { RandomDataGenerator } from '../../../src/prandom/index.js';

describe('prandom - RandomDataGenerator', () => {
  let rng: RandomDataGenerator;
  
  beforeEach(() => {
    rng = new RandomDataGenerator(['test-seed']);
  });
  
  describe('생성자와 초기화', () => {
    test('시드 없이 생성 가능', () => {
      const generator = new RandomDataGenerator();
      expect(generator).toBeInstanceOf(RandomDataGenerator);
    });
    
    test('문자열 시드로 생성', () => {
      const generator = new RandomDataGenerator('string-seed');
      expect(generator).toBeInstanceOf(RandomDataGenerator);
    });
    
    test('배열 시드로 생성', () => {
      const generator = new RandomDataGenerator(['seed1', 'seed2']);
      expect(generator).toBeInstanceOf(RandomDataGenerator);
    });
    
    test('기본 인스턴스 반환', () => {
      const instance1 = RandomDataGenerator.getDefaultInstance();
      const instance2 = RandomDataGenerator.getDefaultInstance();
      expect(instance1).toBe(instance2); // 같은 인스턴스
    });
  });
  
  describe('결정적 동작 (같은 시드 = 같은 결과)', () => {
    test('integer() - 같은 시드에서 같은 정수 시퀀스', () => {
      const rng1 = new RandomDataGenerator(['deterministic']);
      const rng2 = new RandomDataGenerator(['deterministic']);
      
      const sequence1 = Array.from({ length: 10 }, () => rng1.integer());
      const sequence2 = Array.from({ length: 10 }, () => rng2.integer());
      
      expect(sequence1).toEqual(sequence2);
    });
    
    test('frac() - 같은 시드에서 같은 소수 시퀀스', () => {
      const rng1 = new RandomDataGenerator(['frac-test']);
      const rng2 = new RandomDataGenerator(['frac-test']);
      
      const sequence1 = Array.from({ length: 5 }, () => rng1.frac());
      const sequence2 = Array.from({ length: 5 }, () => rng2.frac());
      
      expect(sequence1).toEqual(sequence2);
      sequence1.forEach(value => {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
      });
    });
  });
  
  describe('범위 기반 함수들', () => {
    test('integerInRange() - 지정된 범위 내 정수', () => {
      for (let i = 0; i < 100; i++) {
        const result = rng.integerInRange(5, 15);
        expect(result).toBeGreaterThanOrEqual(5);
        expect(result).toBeLessThanOrEqual(15);
        expect(Number.isInteger(result)).toBe(true);
      }
    });
    
    test('between() - integerInRange와 같은 동작', () => {
      const rng1 = new RandomDataGenerator(['range-test']);
      const rng2 = new RandomDataGenerator(['range-test']);
      
      const results1 = Array.from({ length: 10 }, () => rng1.integerInRange(10, 20));
      const results2 = Array.from({ length: 10 }, () => rng2.between(10, 20));
      
      expect(results1).toEqual(results2);
    });
    
    test('realInRange() - 지정된 범위 내 실수', () => {
      for (let i = 0; i < 50; i++) {
        const result = rng.realInRange(1.5, 3.7);
        expect(result).toBeGreaterThanOrEqual(1.5);
        expect(result).toBeLessThanOrEqual(3.7);
      }
    });
  });
  
  describe('특수 함수들', () => {
    test('normal() - -1과 1 사이 값', () => {
      for (let i = 0; i < 50; i++) {
        const result = rng.normal();
        expect(result).toBeGreaterThanOrEqual(-1);
        expect(result).toBeLessThanOrEqual(1);
      }
    });
    
    test('sign() - -1 또는 1 반환', () => {
      const results = Array.from({ length: 100 }, () => rng.sign());
      const uniqueValues = [...new Set(results)];
      
      expect(uniqueValues).toHaveLength(2);
      expect(uniqueValues).toContain(-1);
      expect(uniqueValues).toContain(1);
    });
    
    test('uuid() - 유효한 UUID 형식', () => {
      const uuid = rng.uuid();
      expect(typeof uuid).toBe('string');
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });
    
    test('angle() - -180과 180 사이', () => {
      for (let i = 0; i < 50; i++) {
        const result = rng.angle();
        expect(result).toBeGreaterThanOrEqual(-180);
        expect(result).toBeLessThanOrEqual(180);
        expect(Number.isInteger(result)).toBe(true);
      }
    });
    
    test('rotation() - -π와 π 사이', () => {
      for (let i = 0; i < 50; i++) {
        const result = rng.rotation();
        expect(result).toBeGreaterThanOrEqual(-3.1415926);
        expect(result).toBeLessThanOrEqual(3.1415926);
      }
    });
    
    test('timestamp() - 유효한 타임스탬프 범위', () => {
      const result = rng.timestamp(1000000000000, 2000000000000);
      expect(result).toBeGreaterThanOrEqual(1000000000000);
      expect(result).toBeLessThanOrEqual(2000000000000);
    });
  });
  
  describe('배열 관련 함수들', () => {
    test('pick() - 배열에서 요소 선택', () => {
      const array = ['a', 'b', 'c', 'd', 'e'];
      
      for (let i = 0; i < 20; i++) {
        const result = rng.pick(array);
        expect(array).toContain(result);
      }
    });
    
    test('weightedPick() - 가중치 선택 (앞쪽 선호)', () => {
      const array = [0, 1, 2, 3, 4];
      const results = Array.from({ length: 1000 }, () => rng.weightedPick(array));
      
      // 앞쪽 인덱스가 더 많이 선택되어야 함
      const count0 = results.filter(r => r === 0).length;
      const count4 = results.filter(r => r === 4).length;
      
      expect(count0).toBeGreaterThan(count4);
    });
    
    test('shuffle() - 배열 셔플', () => {
      const original = [1, 2, 3, 4, 5];
      const toShuffle = [...original];
      
      const shuffled = rng.shuffle(toShuffle);
      
      // 같은 배열 인스턴스 반환
      expect(shuffled).toBe(toShuffle);
      
      // 모든 원소가 여전히 존재
      expect(shuffled.sort()).toEqual(original.sort());
    });
  });
  
  describe('시드 재현성', () => {
    test('같은 시드로 여러 메서드 호출 시 일관성', () => {
      const rng1 = new RandomDataGenerator(['consistency']);
      const rng2 = new RandomDataGenerator(['consistency']);
      
      // 다양한 메서드를 순서대로 호출
      const results1 = [
        rng1.integer(),
        rng1.frac(),
        rng1.integerInRange(1, 100),
        rng1.sign(),
        rng1.pick([10, 20, 30])
      ];
      
      const results2 = [
        rng2.integer(),
        rng2.frac(),
        rng2.integerInRange(1, 100),
        rng2.sign(),
        rng2.pick([10, 20, 30])
      ];
      
      expect(results1).toEqual(results2);
    });
  });
});