import { describe, test, expect } from 'vitest';
import {
  clamp,
  lerp,
  normalizeValue,
  within,
  degToRad,
  radToDeg,
  toFixed,
  roundf as round
} from '../../../src/pmath/index.js';

describe('pmath - Basic Math Functions', () => {
  describe('clamp', () => {
    test('값을 지정된 범위 내로 제한', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
    
    test('경계값 처리', () => {
      expect(clamp(0, 0, 10)).toBe(0);
      expect(clamp(10, 0, 10)).toBe(10);
    });
    
    test('소수점 처리', () => {
      expect(clamp(1.5, 1.0, 2.0)).toBe(1.5);
      expect(clamp(0.5, 1.0, 2.0)).toBe(1.0);
      expect(clamp(2.5, 1.0, 2.0)).toBe(2.0);
    });
  });
  
  describe('lerp', () => {
    test('선형 보간', () => {
      expect(lerp(0, 10, 0.5)).toBe(5);
      expect(lerp(0, 10, 0)).toBe(0);
      expect(lerp(0, 10, 1)).toBe(10);
    });
    
    test('음수 값 보간', () => {
      expect(lerp(-10, 10, 0.5)).toBe(0);
      expect(lerp(-5, 5, 0.25)).toBe(-2.5);
    });
    
    test('1보다 큰 t 값 (extrapolation)', () => {
      expect(lerp(0, 10, 1.5)).toBe(15);
      expect(lerp(0, 10, -0.5)).toBe(-5);
    });
  });
  
  describe('normalizeValue', () => {
    test('값을 0-1 범위로 정규화', () => {
      expect(normalizeValue(5, 0, 10)).toBe(0.5);
      expect(normalizeValue(0, 0, 10)).toBe(0);
      expect(normalizeValue(10, 0, 10)).toBe(1);
    });
    
    test('음수 범위', () => {
      expect(normalizeValue(0, -10, 10)).toBe(0.5);
      expect(normalizeValue(-5, -10, 10)).toBe(0.25);
    });
    
    test('범위를 벗어난 값', () => {
      expect(normalizeValue(15, 0, 10)).toBe(1.5);
      expect(normalizeValue(-5, 0, 10)).toBe(-0.5);
    });
  });
  
  describe('within', () => {
    test('지정된 범위 내에 있는지 확인', () => {
      expect(within(5, 0, 10)).toBe(true);
      expect(within(0, 0, 10)).toBe(true);
      expect(within(10, 0, 10)).toBe(true);
    });
    
    test('범위를 벗어난 값', () => {
      expect(within(-1, 0, 10)).toBe(false);
      expect(within(11, 0, 10)).toBe(false);
    });
  });
  
  describe('degToRad', () => {
    test('도를 라디안으로 변환', () => {
      expect(degToRad(0)).toBe(0);
      expect(degToRad(90)).toBeCloseTo(Math.PI / 2);
      expect(degToRad(180)).toBeCloseTo(Math.PI);
      expect(degToRad(360)).toBeCloseTo(Math.PI * 2);
    });
    
    test('음수 각도', () => {
      expect(degToRad(-90)).toBeCloseTo(-Math.PI / 2);
    });
  });
  
  describe('radToDeg', () => {
    test('라디안을 도로 변환', () => {
      expect(radToDeg(0)).toBe(0);
      expect(radToDeg(Math.PI / 2)).toBeCloseTo(90);
      expect(radToDeg(Math.PI)).toBeCloseTo(180);
      expect(radToDeg(Math.PI * 2)).toBeCloseTo(360);
    });
  });
  
  describe('toFixed', () => {
    test('지정된 소수점 자릿수로 반올림', () => {
      expect(toFixed(3.14159, 2)).toBe(3.14);
      expect(toFixed(10.999, 1)).toBe(11.0);
    });
    
    test('소수점 자릿수가 0인 경우', () => {
      expect(toFixed(3.7, 0)).toBe(4);
    });
    
    test('이미 맞는 소수점 자릿수', () => {
      expect(toFixed(3.1, 2)).toBe(3.1);
    });
  });
});