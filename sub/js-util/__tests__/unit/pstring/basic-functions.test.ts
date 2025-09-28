import { describe, test, expect } from 'vitest';
import { camelCase } from '../../../src/pstring/camelCase.js';
import { capitalize } from '../../../src/pstring/capitalize.js';
import { isBlank } from '../../../src/pstring/isBlank.js';
import { isEmpty } from '../../../src/pstring/isEmpty.js';
import { isNotBlank } from '../../../src/pstring/isNotBlank.js';
import { isNotEmpty } from '../../../src/pstring/isNotEmpty.js';
import { uncapitalize } from '../../../src/pstring/uncapitalize.js';

describe('pstring - basic functions', () => {
  describe('camelCase', () => {
    test('기본 camelCase 변환', () => {
      expect(camelCase('hello', 'world')).toBe('helloWorld');
      expect(camelCase('my', 'variable', 'name')).toBe('myVariableName');
      expect(camelCase('test')).toBe('test');
    });

    test('빈 문자열 및 공백 처리', () => {
      expect(camelCase()).toBe('');
      expect(camelCase('')).toBe('');
      expect(camelCase('', 'world')).toBe('world');
      expect(camelCase('hello', '')).toBe('hello');
    });

    test('특수문자가 포함된 경우', () => {
      expect(camelCase('hello-world', 'test_case')).toBe('hello-worldTest_case');
      expect(camelCase('API', 'response', 'data')).toBe('apiResponseData');
    });

    test('숫자가 포함된 경우', () => {
      expect(camelCase('version1', 'api2')).toBe('version1Api2');
      expect(camelCase('test123', 'case456')).toBe('test123Case456');
    });
  });

  describe('capitalize', () => {
    test('기본 첫 글자 대문자 변환', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('world')).toBe('World');
      expect(capitalize('test')).toBe('Test');
    });

    test('이미 대문자인 경우', () => {
      expect(capitalize('Hello')).toBe('Hello');
      expect(capitalize('WORLD')).toBe('WORLD');
    });

    test('빈 문자열 처리', () => {
      expect(capitalize('')).toBe('');
    });

    test('한 글자 문자열', () => {
      expect(capitalize('a')).toBe('A');
      expect(capitalize('A')).toBe('A');
      expect(capitalize('1')).toBe('1');
    });

    test('공백으로 시작하는 문자열', () => {
      expect(capitalize(' hello')).toBe(' hello');
      expect(capitalize('\thello')).toBe('\thello');
    });

    test('특수문자로 시작하는 문자열', () => {
      expect(capitalize('123abc')).toBe('123abc');
      expect(capitalize('_hello')).toBe('_hello');
      expect(capitalize('-world')).toBe('-world');
    });

    test('유니코드 문자 처리', () => {
      expect(capitalize('한글')).toBe('한글');
      expect(capitalize('français')).toBe('Français');
      expect(capitalize('español')).toBe('Español');
    });
  });

  describe('uncapitalize', () => {
    test('기본 첫 글자 소문자 변환', () => {
      expect(uncapitalize('Hello')).toBe('hello');
      expect(uncapitalize('World')).toBe('world');
      expect(uncapitalize('Test')).toBe('test');
    });

    test('이미 소문자인 경우', () => {
      expect(uncapitalize('hello')).toBe('hello');
      expect(uncapitalize('world')).toBe('world');
    });

    test('빈 문자열 처리', () => {
      expect(uncapitalize('')).toBe('');
    });

    test('한 글자 문자열', () => {
      expect(uncapitalize('A')).toBe('a');
      expect(uncapitalize('a')).toBe('a');
      expect(uncapitalize('1')).toBe('1');
    });

    test('특수문자로 시작하는 문자열', () => {
      expect(uncapitalize('123ABC')).toBe('123ABC');
      expect(uncapitalize('_Hello')).toBe('_Hello');
    });
  });

  describe('isEmpty', () => {
    test('빈 문자열 검사', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty('0')).toBe(false);
    });

    test('null 및 undefined 처리', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });

    test('공백 문자열 처리', () => {
      expect(isEmpty(' ')).toBe(false);
      expect(isEmpty('\t')).toBe(false);
      expect(isEmpty('\n')).toBe(false);
    });
  });

  describe('isNotEmpty', () => {
    test('비어있지 않은 문자열 검사', () => {
      expect(isNotEmpty('hello')).toBe(true);
      expect(isNotEmpty('0')).toBe(true);
      expect(isNotEmpty(' ')).toBe(true);
    });

    test('빈 문자열 및 null 처리', () => {
      expect(isNotEmpty('')).toBe(false);
      expect(isNotEmpty(null)).toBe(false);
      expect(isNotEmpty(undefined)).toBe(false);
    });
  });

  describe('isBlank', () => {
    test('공백 문자열 검사', () => {
      expect(isBlank('')).toBe(true);
      expect(isBlank('   ')).toBe(true);
      expect(isBlank('\t\n\r')).toBe(true);
    });

    test('null 및 undefined 처리', () => {
      expect(isBlank(null)).toBe(true);
      expect(isBlank(undefined)).toBe(true);
    });

    test('내용이 있는 문자열', () => {
      expect(isBlank('hello')).toBe(false);
      expect(isBlank(' hello ')).toBe(false);
      expect(isBlank('0')).toBe(false);
    });
  });

  describe('isNotBlank', () => {
    test('공백이 아닌 문자열 검사', () => {
      expect(isNotBlank('hello')).toBe(true);
      expect(isNotBlank(' hello ')).toBe(true);
      expect(isNotBlank('0')).toBe(true);
    });

    test('공백 문자열 및 null 처리', () => {
      expect(isNotBlank('')).toBe(false);
      expect(isNotBlank('   ')).toBe(false);
      expect(isNotBlank('\t\n\r')).toBe(false);
      expect(isNotBlank(null)).toBe(false);
      expect(isNotBlank(undefined)).toBe(false);
    });
  });

  describe('타입 안전성 테스트', () => {
    test('camelCase 반환 타입', () => {
      const result = camelCase('hello', 'world');
      expect(typeof result).toBe('string');
    });

    test('capitalize/uncapitalize 반환 타입', () => {
      expect(typeof capitalize('hello')).toBe('string');
      expect(typeof uncapitalize('Hello')).toBe('string');
    });

    test('is 함수들 반환 타입', () => {
      expect(typeof isEmpty('')).toBe('boolean');
      expect(typeof isNotEmpty('')).toBe('boolean');
      expect(typeof isBlank('')).toBe('boolean');
      expect(typeof isNotBlank('')).toBe('boolean');
    });
  });

  describe('일관성 테스트', () => {
    test('capitalize와 uncapitalize는 서로 역함수', () => {
      const testStrings = ['hello', 'World', 'tEST', 'a'];

      testStrings.forEach((str) => {
        if (str.length > 0) {
          const capitalized = capitalize(uncapitalize(str));
          const uncapitalized = uncapitalize(capitalize(str));

          expect(capitalized.charAt(0)).toBe(str.charAt(0).toUpperCase());
          expect(uncapitalized.charAt(0)).toBe(str.charAt(0).toLowerCase());
        }
      });
    });

    test('isEmpty와 isNotEmpty는 서로 반대', () => {
      const testCases = ['', 'hello', null, undefined, ' ', '0'];

      testCases.forEach((testCase) => {
        expect(isEmpty(testCase)).toBe(!isNotEmpty(testCase));
      });
    });

    test('isBlank와 isNotBlank는 서로 반대', () => {
      const testCases = ['', 'hello', null, undefined, '   ', '\t\n', ' a '];

      testCases.forEach((testCase) => {
        expect(isBlank(testCase)).toBe(!isNotBlank(testCase));
      });
    });
  });
});
