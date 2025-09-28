import { describe, test, expect } from 'vitest';
import {
  toObjectString,
  createTypeGuard,
  createTypeAssertion,
  isUnion
} from '../../../src/types/utils.js';

describe('types - Type Utils', () => {
  describe('toObjectString', () => {
    test('should return correct object string for primitives', () => {
      expect(toObjectString(null)).toBe('[object Null]');
      expect(toObjectString(undefined)).toBe('[object Undefined]');
      expect(toObjectString(true)).toBe('[object Boolean]');
      expect(toObjectString(123)).toBe('[object Number]');
      expect(toObjectString('test')).toBe('[object String]');
    });

    test('should return correct object string for objects', () => {
      expect(toObjectString({})).toBe('[object Object]');
      expect(toObjectString([])).toBe('[object Array]');
      expect(toObjectString(new Date())).toBe('[object Date]');
      expect(toObjectString(/regex/)).toBe('[object RegExp]');
    });

    test('should return correct object string for functions', () => {
      expect(toObjectString(() => {})).toBe('[object Function]');
      expect(toObjectString(async () => {})).toBe('[object AsyncFunction]');
    });
  });

  describe('createTypeGuard', () => {
    test('should create type guard without options', () => {
      const isString = createTypeGuard<string>((value) => typeof value === 'string');
      expect(isString('hello')).toBe(true);
      expect(isString(123)).toBe(false);
      expect(isString(null)).toBe(false);
    });

    test('should create type guard with options', () => {
      const isPositiveNumber = createTypeGuard<number>(
        (value, options) => typeof value === 'number' && value > 0,
        { min: 0 } as any
      );
      expect(isPositiveNumber(5)).toBe(true);
      expect(isPositiveNumber(-1)).toBe(false);
      expect(isPositiveNumber('5')).toBe(false);
    });

    test('should handle complex validation logic', () => {
      const isValidUser = createTypeGuard<{ name: string; age: number }>(
        (value) => 
          typeof value === 'object' && 
          value !== null &&
          'name' in value && 
          'age' in value &&
          typeof (value as any).name === 'string' &&
          typeof (value as any).age === 'number'
      );
      
      expect(isValidUser({ name: 'John', age: 30 })).toBe(true);
      expect(isValidUser({ name: 'John' })).toBe(false);
      expect(isValidUser({ age: 30 })).toBe(false);
      expect(isValidUser(null)).toBe(false);
    });
  });

  describe('createTypeAssertion', () => {
    test('should create assertion that throws on invalid input', () => {
      const isString = (value: unknown): value is string => typeof value === 'string';
      const assertString = createTypeAssertion(isString);
      
      expect(() => assertString('hello')).not.toThrow();
      expect(() => assertString(123)).toThrow(TypeError);
      expect(() => assertString(null)).toThrow(TypeError);
    });

    test('should create assertion with custom error message', () => {
      const isNumber = (input: unknown): input is number => typeof input === 'number';
      const assertNumber = createTypeAssertion(isNumber);
      
      expect(() => assertNumber(123)).not.toThrow();
      expect(() => assertNumber('not a number', { message: 'Expected number' } as any)).toThrow('Expected number');
    });

    test('should handle edge cases', () => {
      const alwaysTrue = (value: unknown): value is any => true;
      const alwaysFalse = (value: unknown): value is never => false;
      
      const assertAlwaysTrue = createTypeAssertion(alwaysTrue);
      const assertAlwaysFalse = createTypeAssertion(alwaysFalse);
      
      expect(() => assertAlwaysTrue('anything')).not.toThrow();
      expect(() => assertAlwaysFalse('anything')).toThrow(TypeError);
    });
  });

  describe('isUnion', () => {
    test('should create union type guard from multiple guards', () => {
      const isString = (value: unknown): value is string => typeof value === 'string';
      const isNumber = (value: unknown): value is number => typeof value === 'number';
      const isStringOrNumber = isUnion<string | number>(isString as any, isNumber as any);
      
      expect(isStringOrNumber('hello')).toBe(true);
      expect(isStringOrNumber(123)).toBe(true);
      expect(isStringOrNumber(true)).toBe(false);
      expect(isStringOrNumber(null)).toBe(false);
    });

    test('should handle single guard', () => {
      const isString = (value: unknown): value is string => typeof value === 'string';
      const singleUnion = isUnion(isString);
      
      expect(singleUnion('hello')).toBe(true);
      expect(singleUnion(123)).toBe(false);
    });

    test('should handle empty guard list', () => {
      const emptyUnion = isUnion();
      expect(emptyUnion('anything')).toBe(false);
      expect(emptyUnion(null)).toBe(false);
    });

    test('should pass additional arguments to guards', () => {
      const guardWithOptions = (value: unknown, options?: any): value is string => 
        typeof value === 'string' && (!options?.minLength || value.length >= options.minLength);
      
      const unionGuard = isUnion<string>(guardWithOptions);
      expect(unionGuard('hello', { minLength: 3 })).toBe(true);
      expect(unionGuard('hi', { minLength: 5 })).toBe(false);
    });

    test('should short-circuit on first match', () => {
      let callCount = 0;
      const guard1 = (input: unknown): input is string => {
        callCount++;
        return typeof input === 'string';
      };
      const guard2 = (input: unknown): input is string => {
        callCount++;
        return typeof input === 'number';
      };
      
      const unionGuard = isUnion<string>(guard1, guard2);
      callCount = 0;
      unionGuard('hello');
      expect(callCount).toBe(1); // Should stop after first guard succeeds
    });
  });
});