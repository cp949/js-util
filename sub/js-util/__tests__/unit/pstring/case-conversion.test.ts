import { describe, test, expect } from 'vitest';
import {
  camelCase,
  pascalCase,
  kebabToConstant,
  kebabToPascal,
} from '../../../src/pstring/index.js';

describe('pstring - Case Conversion', () => {
  describe('camelCase', () => {
    test('단일 문자열', () => {
      expect(camelCase('hello')).toBe('hello');
      expect(camelCase('HELLO')).toBe('hello');
    });

    test('여러 문자열 합치기', () => {
      expect(camelCase('hello', 'world')).toBe('helloWorld');
      expect(camelCase('get', 'user', 'data')).toBe('getUserData');
    });

    test('빈 배열', () => {
      expect(camelCase()).toBe('');
    });

    test('빈 문자열 포함', () => {
      expect(camelCase('', 'hello')).toBe('hello');
      expect(camelCase('hello', '')).toBe('hello');
    });
  });

  describe('pascalCase', () => {
    test('단일 문자열', () => {
      expect(pascalCase('hello')).toBe('Hello');
    });

    test('여러 문자열 합치기', () => {
      expect(pascalCase('hello', 'world')).toBe('HelloWorld');
      expect(pascalCase('user', 'data', 'service')).toBe('UserDataService');
    });
  });

  describe('kebabToConstant', () => {
    test('kebab-case를 CONSTANT_CASE로 변환', () => {
      expect(kebabToConstant('hello-world')).toBe('HELLO_WORLD');
      expect(kebabToConstant('user-data-service')).toBe('USER_DATA_SERVICE');
    });

    test('단일 단어', () => {
      expect(kebabToConstant('hello')).toBe('HELLO');
    });

    test('빈 문자열', () => {
      expect(kebabToConstant('')).toBe('');
    });
  });

  describe('kebabToPascal', () => {
    test('kebab-case를 PascalCase로 변환', () => {
      expect(kebabToPascal('hello-world')).toBe('HelloWorld');
      expect(kebabToPascal('user-data-service')).toBe('UserDataService');
    });

    test('단일 단어', () => {
      expect(kebabToPascal('hello')).toBe('Hello');
    });

    test('숫자 포함', () => {
      expect(kebabToPascal('api-v2-endpoint')).toBe('ApiV2Endpoint');
    });
  });
});
