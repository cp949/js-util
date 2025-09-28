import { describe, test, expect } from 'vitest';
import { toInt } from '../../../src/pstring/toInt.js';
import { stringify } from '../../../src/pstring/stringify.js';
import { compressSpaces } from '../../../src/pstring/compressSpaces.js';

describe('pstring - Uncovered Functions', () => {
  describe('toInt', () => {
    test('should parse valid integer strings', () => {
      expect(toInt('123')).toBe(123);
      expect(toInt('0')).toBe(0);
      expect(toInt('-456')).toBe(-456);
    });

    test('should handle decimal numbers by parsing integer part', () => {
      expect(toInt('123.456')).toBe(123);
      expect(toInt('0.999')).toBe(0);
    });

    test('should return default value for invalid strings', () => {
      expect(toInt('abc')).toBe(0);
      expect(toInt('123abc')).toBe(123); // parseInt behavior
      expect(toInt('')).toBe(0);
      expect(toInt(' ')).toBe(0);
    });

    test('should handle null and undefined', () => {
      expect(toInt(null)).toBe(0);
      expect(toInt(undefined)).toBe(0);
    });

    test('should use custom default value', () => {
      expect(toInt('abc', -1)).toBe(-1);
      expect(toInt(null, 100)).toBe(100);
      expect(toInt(undefined, -999)).toBe(-999);
    });

    test('should handle edge cases', () => {
      expect(toInt('Infinity')).toBe(0); // parseInt('Infinity') returns NaN
      expect(toInt('-Infinity')).toBe(0); // parseInt('-Infinity') returns NaN
      expect(toInt('NaN')).toBe(0); // parseInt('NaN') returns NaN
    });

    test('should handle numeric strings with whitespace', () => {
      expect(toInt(' 123 ')).toBe(123);
      expect(toInt('\n456\t')).toBe(456);
    });

    test('should handle binary and hex strings as base-10', () => {
      expect(toInt('0b1010')).toBe(0); // parseInt with base 10
      expect(toInt('0xFF')).toBe(0); // parseInt with base 10
    });
  });

  describe('stringify', () => {
    test('should stringify normal objects', () => {
      expect(stringify({ a: 1, b: 'test' })).toBe('{"a":1,"b":"test"}');
      expect(stringify([1, 2, 3])).toBe('[1,2,3]');
      expect(stringify('hello')).toBe('"hello"');
    });

    test('should convert Infinity to 0', () => {
      expect(stringify({ value: Infinity })).toBe('{"value":0}');
      expect(stringify({ value: -Infinity })).toBe('{"value":0}');
      expect(stringify([Infinity, -Infinity])).toBe('[0,0]');
    });

    test('should convert NaN to 0', () => {
      expect(stringify({ value: NaN })).toBe('{"value":0}');
      expect(stringify([NaN, 123])).toBe('[0,123]');
    });

    test('should handle nested objects with special numbers', () => {
      const obj = {
        normal: 42,
        infinity: Infinity,
        negInfinity: -Infinity,
        nan: NaN,
        nested: {
          value: Infinity,
        },
      };
      const result = stringify(obj);
      expect(result).toBe(
        '{"normal":42,"infinity":0,"negInfinity":0,"nan":0,"nested":{"value":0}}',
      );
    });

    test('should handle arrays with special numbers', () => {
      const arr = [1, Infinity, NaN, -Infinity, 2];
      expect(stringify(arr)).toBe('[1,0,0,0,2]');
    });

    test('should handle primitive values', () => {
      expect(stringify(null)).toBe('null');
      expect(stringify(true)).toBe('true');
      expect(stringify(false)).toBe('false');
      expect(stringify(42)).toBe('42');
    });
  });

  describe('compressSpaces', () => {
    test('should compress multiple spaces into single space', () => {
      expect(compressSpaces('hello    world')).toBe('hello world');
      expect(compressSpaces('a  b   c    d')).toBe('a b c d');
    });

    test('should handle different whitespace characters', () => {
      expect(compressSpaces('hello\t\tworld')).toBe('hello world');
      expect(compressSpaces('hello\n\nworld')).toBe('hello world');
      expect(compressSpaces('hello\r\rworld')).toBe('hello world');
    });

    test('should handle mixed whitespace', () => {
      expect(compressSpaces('hello \t\n\r world')).toBe('hello world');
      expect(compressSpaces('  \t\n  text  \t\n  ')).toBe(' text ');
    });

    test('should handle special Unicode spaces', () => {
      expect(compressSpaces('hello\u00a0\u00a0world')).toBe('hello world'); // non-breaking space
      expect(compressSpaces('hello\uFEFF\uFEFFworld')).toBe('hello world'); // zero-width no-break space
      expect(compressSpaces('hello\u3000\u3000world')).toBe('hello world'); // ideographic space
    });

    test('should handle null and undefined', () => {
      expect(compressSpaces(null)).toBe('');
      expect(compressSpaces(undefined)).toBe('');
    });

    test('should handle empty string', () => {
      expect(compressSpaces('')).toBe('');
      expect(compressSpaces('   ')).toBe(' ');
    });

    test('should handle string with no spaces', () => {
      expect(compressSpaces('hello')).toBe('hello');
      expect(compressSpaces('123')).toBe('123');
    });

    test('should handle strings that convert to strings properly', () => {
      // Test the (str + '') conversion
      expect(compressSpaces('test   string')).toBe('test string');
    });
  });
});
