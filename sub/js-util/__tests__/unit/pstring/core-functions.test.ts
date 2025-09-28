import { describe, test, expect } from 'vitest';
import {
  trim,
  isEmpty,
  isNotEmpty,
  isBlank,
  capitalize,
  uncapitalize,
} from '../../../src/pstring/index.js';

describe('pstring - Core Functions', () => {
  describe('trim', () => {
    test('일반적인 공백 제거', () => {
      expect(trim('  hello world  ')).toBe('hello world');
      expect(trim('\t\nhello\t\n')).toBe('hello');
    });

    test('다양한 공백 문자 제거', () => {
      expect(trim('\uFEFF\u00a0\u3000hello\uFEFF\u00a0\u3000')).toBe('hello');
    });

    test('null/undefined 처리', () => {
      expect(trim(null)).toBe('');
      expect(trim(undefined)).toBe('');
    });

    test('빈 문자열과 공백만 있는 문자열', () => {
      expect(trim('')).toBe('');
      expect(trim('   ')).toBe('');
    });

    test('숫자를 문자열로 변환해서 처리', () => {
      expect(trim('  123  ' as any)).toBe('123');
    });
  });

  describe('isEmpty', () => {
    test('빈 문자열은 true', () => {
      expect(isEmpty('')).toBe(true);
    });

    test('내용이 있는 문자열은 false', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty(' ')).toBe(false); // 공백도 내용
    });

    test('null/undefined는 true', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });
  });

  describe('isNotEmpty', () => {
    test('isEmpty와 반대 결과', () => {
      expect(isNotEmpty('hello')).toBe(true);
      expect(isNotEmpty('')).toBe(false);
      expect(isNotEmpty(null)).toBe(false);
      expect(isNotEmpty(undefined)).toBe(false);
    });
  });

  describe('isBlank', () => {
    test('빈 문자열과 공백만 있는 문자열은 true', () => {
      expect(isBlank('')).toBe(true);
      expect(isBlank('   ')).toBe(true);
      expect(isBlank('\t\n  ')).toBe(true);
    });

    test('내용이 있는 문자열은 false', () => {
      expect(isBlank('hello')).toBe(false);
      expect(isBlank(' hello ')).toBe(false);
    });

    test('null/undefined는 true', () => {
      expect(isBlank(null)).toBe(true);
      expect(isBlank(undefined)).toBe(true);
    });
  });

  describe('capitalize', () => {
    test('첫 글자 대문자화', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('world')).toBe('World');
    });

    test('이미 대문자인 경우', () => {
      expect(capitalize('Hello')).toBe('Hello');
    });

    test('한 글자 문자열', () => {
      expect(capitalize('h')).toBe('H');
      expect(capitalize('H')).toBe('H');
    });

    test('빈 문자열', () => {
      expect(capitalize('')).toBe('');
    });

    test('숫자로 시작하는 문자열', () => {
      expect(capitalize('1hello')).toBe('1hello');
    });
  });

  describe('uncapitalize', () => {
    test('첫 글자 소문자화', () => {
      expect(uncapitalize('Hello')).toBe('hello');
      expect(uncapitalize('World')).toBe('world');
    });

    test('이미 소문자인 경우', () => {
      expect(uncapitalize('hello')).toBe('hello');
    });

    test('한 글자 문자열', () => {
      expect(uncapitalize('H')).toBe('h');
      expect(uncapitalize('h')).toBe('h');
    });

    test('빈 문자열', () => {
      expect(uncapitalize('')).toBe('');
    });
  });
});
