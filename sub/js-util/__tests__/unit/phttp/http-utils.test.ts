import { describe, test, expect } from 'vitest';
import {
  joinUrl,
  objectToQueryString,
  queryParam,
  queryParamAsNumber,
  queryParams,
} from '../../../src/phttp/index.js';
import queryParamAsString from '../../../src/phttp/queryParamAsString.js';

describe('phttp 모듈', () => {
  describe('joinUrl', () => {
    test('기본 URL 조합', () => {
      expect(joinUrl('http://example.com', 'path')).toBe('http://example.com/path');
      expect(joinUrl('http://example.com/', '/path')).toBe('http://example.com/path');
      expect(joinUrl('http://example.com', '/path/', 'to', 'file')).toBe(
        'http://example.com/path/to/file',
      );
    });

    test('복잡한 URL 조합 (예제에서 가져온)', () => {
      const fullUrl = joinUrl(
        'http://www.google.com',
        'a',
        '/b/cd',
        '?foo=123',
        '&bar=456',
        '#heading-1',
      );
      expect(fullUrl).toBe('http://www.google.com/a/b/cd?foo=123&bar=456#heading-1');
    });

    test('프로토콜 처리', () => {
      expect(joinUrl('https://', 'example.com', 'path')).toBe('https://example.com/path');
      expect(joinUrl('ftp://', 'example.com', 'path')).toBe('ftp://example.com/path');
      expect(joinUrl('file://', '/local', 'path')).toBe('file:///local/path');
    });

    test('빈 값과 undefined 처리', () => {
      expect(joinUrl('http://example.com', '', 'path')).toBe('http://example.com/path');
      expect(joinUrl('http://example.com', undefined, 'path')).toBe('http://example.com/path');
      expect(joinUrl('http://example.com', null as any, 'path')).toBe('http://example.com/path');
    });

    test('배열 인자 처리', () => {
      expect(joinUrl('http://example.com', ['a', 'b', 'c'])).toBe('http://example.com/a/b/c');
      expect(joinUrl('http://example.com', ['a', undefined, 'c'])).toBe('http://example.com/a/c');
      expect(joinUrl(['http://example.com', 'path', 'to', 'file'])).toBe(
        'http://example.com/path/to/file',
      );
    });

    test('점(.) 경로 처리', () => {
      expect(joinUrl('http://example.com', '.', 'path')).toBe('http://example.com/path');
      expect(joinUrl('http://example.com', 'path', '.')).toBe('http://example.com/path');
    });

    test('슬래시 정규화', () => {
      expect(joinUrl('http://example.com///', '///path///', '///to///', '///file')).toBe(
        'http://example.com/path/to/file',
      );
      expect(joinUrl('http://example.com', 'path/', '/to/', '/file/')).toBe(
        'http://example.com/path/to/file/',
      );
    });

    test('쿼리 파라미터와 해시', () => {
      expect(joinUrl('http://example.com', 'path', '?param=value')).toBe(
        'http://example.com/path?param=value',
      );
      expect(joinUrl('http://example.com', 'path', '#section')).toBe(
        'http://example.com/path#section',
      );
      expect(joinUrl('http://example.com', 'path', '?param=value', '#section')).toBe(
        'http://example.com/path?param=value#section',
      );
    });

    test('여러 쿼리 파라미터 조합', () => {
      expect(joinUrl('http://example.com', 'path', '?a=1', '?b=2', '&c=3')).toBe(
        'http://example.com/path?a=1&b=2&c=3',
      );
      expect(joinUrl('http://example.com', 'path', '?a=1', '&b=2', '?c=3')).toBe(
        'http://example.com/path?a=1&b=2&c=3',
      );
    });

    test('IPv6 주소 처리', () => {
      expect(joinUrl('[2001:db8::1]', 'path')).toBe('[2001:db8::1]/path');
      expect(joinUrl('http://[2001:db8::1]', 'path')).toBe('http://[2001:db8::1]/path');
    });

    test('파일 프로토콜', () => {
      expect(joinUrl('file://', '/absolute/path')).toBe('file:///absolute/path');
      expect(joinUrl('file:///', 'relative/path')).toBe('file:///relative/path');
    });

    test('빈 인자들', () => {
      expect(joinUrl()).toBe('');
      expect(joinUrl('')).toBe('');
      expect(joinUrl(undefined)).toBe('');
    });

    test('상대 경로와 절대 경로', () => {
      expect(joinUrl('/', 'path', 'to', 'file')).toBe('/path/to/file');
      expect(joinUrl('/base', 'path', 'to', 'file')).toBe('/base/path/to/file');
    });
  });

  describe('objectToQueryString', () => {
    test('기본 객체를 쿼리 스트링으로 변환', () => {
      expect(objectToQueryString({ name: 'john', age: 30 })).toBe('?name=john&age=30');
      expect(objectToQueryString({ id: 1 })).toBe('?id=1');
      expect(objectToQueryString({})).toBe('');
    });

    test('빈 값 처리', () => {
      expect(objectToQueryString({ name: 'john', empty: '', age: 30 })).toBe('?name=john&age=30');
      expect(objectToQueryString({ name: 'john', nil: null, age: 30 })).toBe('?name=john&age=30');
      expect(objectToQueryString({ name: 'john', undef: undefined, age: 30 })).toBe(
        '?name=john&age=30',
      );
    });

    test('숫자와 불린 값', () => {
      // 0과 false는 falsy 값이라 제외됨
      expect(objectToQueryString({ count: 0, active: false })).toBe('');
      expect(objectToQueryString({ count: 42, active: true })).toBe('?count=42&active=true');
    });

    test('특수 문자가 포함된 값', () => {
      expect(objectToQueryString({ message: 'hello world' })).toBe('?message=hello world');
      expect(objectToQueryString({ special: 'a&b=c?d#e' })).toBe('?special=a&b=c?d#e');
    });

    test('null이나 undefined 객체', () => {
      expect(objectToQueryString(null as any)).toBe('');
      expect(objectToQueryString(undefined as any)).toBe('');
    });

    test('복합 데이터 타입', () => {
      expect(objectToQueryString({ arr: [1, 2, 3], obj: { nested: 'value' } })).toBe(
        '?arr=1,2,3&obj=[object Object]',
      );
    });
  });

  describe('queryParam', () => {
    test('문자열 값 처리', () => {
      expect(queryParam('value')).toBe('value');
      expect(queryParam('')).toBe('');
    });

    test('배열 값 처리 (첫 번째 요소 반환)', () => {
      expect(queryParam(['first', 'second'])).toBe('first');
      expect(queryParam(['only'])).toBe('only');
      expect(queryParam([])).toBe(undefined);
    });

    test('null과 undefined 처리', () => {
      expect(queryParam(null)).toBe(undefined);
      expect(queryParam(undefined)).toBe(undefined);
    });
  });

  describe('queryParamAsNumber', () => {
    test('유효한 숫자 문자열 변환', () => {
      expect(queryParamAsNumber('42', 0)).toBe(42);
      expect(queryParamAsNumber('3.14', 0)).toBe(3.14);
      expect(queryParamAsNumber('-10', 0)).toBe(-10);
      expect(queryParamAsNumber('0', -1)).toBe(0);
    });

    test('무효한 숫자에 대한 기본값 반환', () => {
      expect(queryParamAsNumber('abc', 100)).toBe(100);
      expect(queryParamAsNumber('', 100)).toBe(100);
      expect(queryParamAsNumber('not-a-number', 42)).toBe(42);
    });

    test('null과 undefined에 대한 기본값 반환', () => {
      expect(queryParamAsNumber(null, 50)).toBe(50);
      expect(queryParamAsNumber(undefined, 50)).toBe(50);
    });

    test('배열에서 첫 번째 값 사용', () => {
      expect(queryParamAsNumber(['123', '456'], 0)).toBe(123);
      expect(queryParamAsNumber(['abc', '456'], 999)).toBe(999);
      expect(queryParamAsNumber([], 777)).toBe(777);
    });

    test('특수 숫자 값들', () => {
      expect(queryParamAsNumber('Infinity', 0)).toBe(Infinity);
      expect(queryParamAsNumber('-Infinity', 0)).toBe(-Infinity);
      expect(queryParamAsNumber('NaN', 100)).toBe(100); // NaN은 기본값 반환
    });

    test('공백 문자열', () => {
      // 공백만 있는 문자열은 Number()로 0이 됨
      expect(queryParamAsNumber('   ', 123)).toBe(0);
      expect(queryParamAsNumber('  42  ', 0)).toBe(42); // 공백이 있어도 숫자로 변환 가능
    });
  });

  describe('queryParamAsString', () => {
    test('유효한 문자열 반환', () => {
      expect(queryParamAsString('hello', 'default')).toBe('hello');
      expect(queryParamAsString('123', 'default')).toBe('123');
    });

    test('빈 문자열에 대한 기본값 반환', () => {
      expect(queryParamAsString('', 'default')).toBe('default');
    });

    test('null과 undefined에 대한 기본값 반환', () => {
      expect(queryParamAsString(null, 'fallback')).toBe('fallback');
      expect(queryParamAsString(undefined, 'fallback')).toBe('fallback');
    });

    test('배열에서 첫 번째 값 사용', () => {
      expect(queryParamAsString(['first', 'second'], 'default')).toBe('first');
      expect(queryParamAsString([''], 'default')).toBe('default'); // 빈 문자열은 기본값
      expect(queryParamAsString([], 'default')).toBe('default');
    });

    test('공백 문자열 처리', () => {
      expect(queryParamAsString('   ', 'default')).toBe('   '); // 공백도 유효한 값
      expect(queryParamAsString(' hello world ', 'default')).toBe(' hello world ');
    });
  });

  describe('queryParams', () => {
    test('문자열을 배열로 변환', () => {
      expect(queryParams('value')).toEqual(['value']);
      expect(queryParams('')).toEqual(['']);
    });

    test('배열 그대로 반환', () => {
      expect(queryParams(['first', 'second'])).toEqual(['first', 'second']);
      expect(queryParams([])).toEqual([]);
    });

    test('null과 undefined 처리', () => {
      expect(queryParams(null)).toBe(undefined);
      expect(queryParams(undefined)).toBe(undefined);
    });
  });
});
