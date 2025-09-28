import { describe, test, expect } from 'vitest';
import { clamp, atLeast, atMost, atLeastZero, clampZeroToOne } from '../../../src/pmath/clamp.js';

describe('pmath - clamp functions', () => {
  describe('clamp', () => {
    test('should clamp value within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });

    test('should handle min greater than max by swapping', () => {
      expect(clamp(5, 10, 0)).toBe(5);
      expect(clamp(-5, 10, 0)).toBe(0);
      expect(clamp(15, 10, 0)).toBe(10);
    });

    test('should handle equal min and max', () => {
      expect(clamp(5, 10, 10)).toBe(10);
      expect(clamp(10, 10, 10)).toBe(10);
      expect(clamp(15, 10, 10)).toBe(10);
    });

    test('should handle negative ranges', () => {
      expect(clamp(-5, -10, -1)).toBe(-5);
      expect(clamp(-15, -10, -1)).toBe(-10);
      expect(clamp(0, -10, -1)).toBe(-1);
    });

    test('should handle decimal values', () => {
      expect(clamp(0.5, 0.0, 1.0)).toBe(0.5);
      expect(clamp(-0.5, 0.0, 1.0)).toBe(0.0);
      expect(clamp(1.5, 0.0, 1.0)).toBe(1.0);
    });
  });

  describe('atLeast', () => {
    test('should enforce minimum value', () => {
      expect(atLeast(5, 3)).toBe(5);
      expect(atLeast(2, 3)).toBe(3);
      expect(atLeast(3, 3)).toBe(3);
    });

    test('should work with negative values', () => {
      expect(atLeast(-5, -3)).toBe(-3);
      expect(atLeast(-2, -3)).toBe(-2);
      expect(atLeast(-3, -3)).toBe(-3);
    });

    test('should work with decimal values', () => {
      expect(atLeast(0.5, 0.7)).toBe(0.7);
      expect(atLeast(0.8, 0.7)).toBe(0.8);
    });
  });

  describe('atMost', () => {
    test('should enforce maximum value', () => {
      expect(atMost(5, 7)).toBe(5);
      expect(atMost(8, 7)).toBe(7);
      expect(atMost(7, 7)).toBe(7);
    });

    test('should work with negative values', () => {
      expect(atMost(-5, -3)).toBe(-5);
      expect(atMost(-2, -3)).toBe(-3);
      expect(atMost(-3, -3)).toBe(-3);
    });

    test('should work with decimal values', () => {
      expect(atMost(0.5, 0.7)).toBe(0.5);
      expect(atMost(0.8, 0.7)).toBe(0.7);
    });
  });

  describe('atLeastZero', () => {
    test('should enforce zero minimum', () => {
      expect(atLeastZero(5)).toBe(5);
      expect(atLeastZero(-5)).toBe(0);
      expect(atLeastZero(0)).toBe(0);
    });

    test('should work with decimal values', () => {
      expect(atLeastZero(0.5)).toBe(0.5);
      expect(atLeastZero(-0.5)).toBe(0);
    });
  });

  describe('clampZeroToOne', () => {
    test('should clamp to 0-1 range', () => {
      expect(clampZeroToOne(0.5)).toBe(0.5);
      expect(clampZeroToOne(-0.5)).toBe(0);
      expect(clampZeroToOne(1.5)).toBe(1);
      expect(clampZeroToOne(0)).toBe(0);
      expect(clampZeroToOne(1)).toBe(1);
    });

    test('should work with extreme values', () => {
      expect(clampZeroToOne(-1000)).toBe(0);
      expect(clampZeroToOne(1000)).toBe(1);
    });
  });
});