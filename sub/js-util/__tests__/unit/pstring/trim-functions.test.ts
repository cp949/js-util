import { describe, test, expect } from 'vitest';
import { trimToUndefined, trimToUndef } from '../../../src/pstring/trimToUndef.js';

describe('pstring - Trim Functions', () => {
  describe('trimToUndefined', () => {
    test('should return undefined for empty strings after trim', () => {
      expect(trimToUndefined('')).toBeUndefined();
      expect(trimToUndefined('   ')).toBeUndefined();
      expect(trimToUndefined('\t\n\r ')).toBeUndefined();
    });

    test('should return trimmed string for non-empty content', () => {
      expect(trimToUndefined('hello')).toBe('hello');
      expect(trimToUndefined('  hello  ')).toBe('hello');
      expect(trimToUndefined('\t\nhello\r\n')).toBe('hello');
    });

    test('should handle null and undefined input', () => {
      expect(trimToUndefined(null)).toBeUndefined();
      expect(trimToUndefined(undefined)).toBeUndefined();
    });

    test('should handle edge cases', () => {
      expect(trimToUndefined('a')).toBe('a');
      expect(trimToUndefined(' a ')).toBe('a');
      expect(trimToUndefined('0')).toBe('0'); // Zero string should not be undefined
    });
  });

  describe('trimToUndef', () => {
    test('should return undefined for empty strings after trim', () => {
      expect(trimToUndef('')).toBeUndefined();
      expect(trimToUndef('   ')).toBeUndefined();
      expect(trimToUndef('\t\n\r ')).toBeUndefined();
    });

    test('should return trimmed string for non-empty content', () => {
      expect(trimToUndef('hello')).toBe('hello');
      expect(trimToUndef('  hello  ')).toBe('hello');
      expect(trimToUndef('\t\nhello\r\n')).toBe('hello');
    });

    test('should handle null and undefined input', () => {
      expect(trimToUndef(null)).toBeUndefined();
      expect(trimToUndef(undefined)).toBeUndefined();
    });

    test('should handle edge cases', () => {
      expect(trimToUndef('a')).toBe('a');
      expect(trimToUndef(' a ')).toBe('a');
      expect(trimToUndef('0')).toBe('0'); // Zero string should not be undefined
    });

    test('should behave identically to trimToUndefined', () => {
      const testCases = ['', '   ', 'hello', '  hello  ', null, undefined, 'a', ' a '];
      testCases.forEach(testCase => {
        expect(trimToUndef(testCase)).toBe(trimToUndefined(testCase));
      });
    });
  });
});