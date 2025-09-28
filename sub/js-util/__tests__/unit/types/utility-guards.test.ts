import { describe, test, expect } from 'vitest';
import {
  isNonEmptyArray,
  isNonEmptyString,
  isJSON,
  isEmail,
  isString,
} from '../../../src/types/index.js';

describe('Utility TypeGuards', () => {
  describe('isNonEmptyArray', () => {
    test('비어있지 않은 배열 검증', () => {
      expect(isNonEmptyArray([1, 2, 3])).toBe(true);
      expect(isNonEmptyArray(['a'])).toBe(true);
      expect(isNonEmptyArray([null])).toBe(true);
    });

    test('비어있은 배열은 false', () => {
      expect(isNonEmptyArray([])).toBe(false);
    });

    test('배열이 아닌 값들은 false', () => {
      expect(isNonEmptyArray('not array')).toBe(false);
      expect(isNonEmptyArray({})).toBe(false);
      expect(isNonEmptyArray(null)).toBe(false);
    });

    test('값 검증자와 함께 사용', () => {
      const stringArray = ['a', 'b', 'c'];
      expect(isNonEmptyArray<string>(stringArray, { valueValidator: isString })).toBe(true);

      const mixedArray = ['a', 1, 'c'];
      expect(isNonEmptyArray<string>(mixedArray, { valueValidator: isString })).toBe(false);
    });
  });

  describe('isNonEmptyString', () => {
    test('비어있지 않은 문자열 검증', () => {
      expect(isNonEmptyString('hello')).toBe(true);
      expect(isNonEmptyString('a')).toBe(true);
      expect(isNonEmptyString(' ')).toBe(true); // 공백도 내용이 있다고 처리
    });

    test('빈 문자열은 false', () => {
      expect(isNonEmptyString('')).toBe(false);
    });

    test('문자열이 아닌 값들은 false', () => {
      expect(isNonEmptyString(123)).toBe(false);
      expect(isNonEmptyString({})).toBe(false);
      expect(isNonEmptyString(null)).toBe(false);
    });
  });

  describe('isJSON', () => {
    test('유효한 JSON 문자열 검증', () => {
      expect(isJSON('{"name": "john"}')).toBe(true);
      expect(isJSON('[1, 2, 3]')).toBe(true);
      expect(isJSON('"hello"')).toBe(true);
      expect(isJSON('123')).toBe(true);
      expect(isJSON('true')).toBe(true);
      expect(isJSON('null')).toBe(true);
    });

    test('잘못된 JSON 문자열은 false', () => {
      expect(isJSON('{name: "john"}')).toBe(false); // 키에 따옴표 없음
      expect(isJSON('{"name": }')).toBe(false); // 값 누락
      expect(isJSON('undefined')).toBe(false);
      expect(isJSON('hello')).toBe(false); // 따옴표 없는 문자열
    });

    test('문자열이 아닌 값들은 false', () => {
      expect(isJSON(123)).toBe(false);
      expect(isJSON({})).toBe(false);
      expect(isJSON(null)).toBe(false);
    });
  });

  describe('isEmail', () => {
    test('유효한 이메일 검증', () => {
      expect(isEmail('user@example.com')).toBe(true);
      expect(isEmail('test.email@domain.co.kr')).toBe(true);
      expect(isEmail('admin@localhost.dev')).toBe(true);
    });

    test('잘못된 이메일 형식은 false', () => {
      expect(isEmail('not-an-email')).toBe(false);
      expect(isEmail('user@')).toBe(false);
      expect(isEmail('@domain.com')).toBe(false);
      expect(isEmail('user space@domain.com')).toBe(false); // 공백 포함
      expect(isEmail('user@@domain.com')).toBe(false); // @ 중복
    });

    test('문자열이 아닌 값들은 false', () => {
      expect(isEmail(123)).toBe(false);
      expect(isEmail({})).toBe(false);
      expect(isEmail(null)).toBe(false);
    });
  });
});
