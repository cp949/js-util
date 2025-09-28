import { describe, test, expect } from 'vitest';
import { joinUrl } from '../../../src/phttp/joinUrl.js';
import { objectToQueryString } from '../../../src/phttp/objectToQueryString.js';
import { queryParam } from '../../../src/phttp/queryParam.js';

describe('phttp - HTTP utility functions', () => {
  describe('joinUrl', () => {
    test('기본 URL 조인', () => {
      expect(joinUrl('http://example.com', 'api', 'users')).toBe('http://example.com/api/users');
      expect(joinUrl('https://api.github.com', 'repos', 'owner', 'repo')).toBe(
        'https://api.github.com/repos/owner/repo',
      );
    });

    test('슬래시 정규화', () => {
      expect(joinUrl('http://example.com/', '/api/', '/users/')).toBe(
        'http://example.com/api/users/',
      );
      expect(joinUrl('http://example.com///', '///api///', '///users')).toBe(
        'http://example.com/api/users',
      );
    });

    test('빈 문자열 및 undefined 필터링', () => {
      expect(joinUrl('http://example.com', '', 'api', undefined, 'users')).toBe(
        'http://example.com/api/users',
      );
      expect(joinUrl('http://example.com', null as any, 'api')).toBe('http://example.com/api');
    });

    test('쿼리 파라미터와 해시', () => {
      expect(joinUrl('http://example.com', 'api', '?foo=123', '&bar=456')).toBe(
        'http://example.com/api?foo=123&bar=456',
      );
      expect(joinUrl('http://example.com', 'page', '#section')).toBe(
        'http://example.com/page#section',
      );
      expect(joinUrl('http://example.com', 'api', '?foo=123', '#section')).toBe(
        'http://example.com/api?foo=123#section',
      );
    });

    test('복잡한 쿼리 파라미터', () => {
      expect(joinUrl('http://example.com', 'search', '?q=test', '&sort=date', '&filter=all')).toBe(
        'http://example.com/search?q=test&sort=date&filter=all',
      );
      expect(joinUrl('http://example.com?existing=param', 'api', '?new=param')).toBe(
        'http://example.com/api?existing=param&new=param',
      );
    });

    test('프로토콜 처리', () => {
      expect(joinUrl('http://', 'example.com', 'api')).toBe('http://example.com/api');
      expect(joinUrl('https://', 'api.github.com')).toBe('https://api.github.com');
      expect(joinUrl('ftp://', 'files.example.com', 'data')).toBe('ftp://files.example.com/data');
    });

    test('파일 프로토콜', () => {
      expect(joinUrl('file:///', 'path', 'to', 'file.txt')).toBe('file:///path/to/file.txt');
      expect(joinUrl('file://', '/absolute/path')).toBe('file:///absolute/path');
    });

    test('상대 경로', () => {
      expect(joinUrl('/api', 'users', '123')).toBe('/api/users/123');
      expect(joinUrl('api', 'users', '123')).toBe('api/users/123');
    });

    test('배열 인자 지원', () => {
      expect(joinUrl('http://example.com', ['api', 'v1'], 'users')).toBe(
        'http://example.com/api/v1/users',
      );
      expect(joinUrl(['http://example.com', 'api'], ['users', '123'])).toBe(
        'http://example.com/api/users/123',
      );
    });

    test('점(.) 필터링', () => {
      expect(joinUrl('http://example.com', '.', 'api', '.', 'users')).toBe(
        'http://example.com/api/users',
      );
    });

    test('빈 인자 처리', () => {
      expect(joinUrl()).toBe('');
      expect(joinUrl('')).toBe('');
      expect(joinUrl('', '', '')).toBe('');
    });

    test('IPv6 주소', () => {
      expect(joinUrl('[::1]', 'api')).toBe('[::1]/api');
      expect(joinUrl('http://[2001:db8::1]', 'api')).toBe('http://[2001:db8::1]/api');
    });

    test('특수 문자가 포함된 경로', () => {
      expect(joinUrl('http://example.com', 'path with spaces', 'file.txt')).toBe(
        'http://example.com/path with spaces/file.txt',
      );
      expect(joinUrl('http://example.com', 'path-with-dashes', 'file_name.txt')).toBe(
        'http://example.com/path-with-dashes/file_name.txt',
      );
    });
  });

  describe('objectToQueryString', () => {
    test('기본 객체 변환', () => {
      expect(objectToQueryString({ foo: 'bar', baz: 'qux' })).toBe('?foo=bar&baz=qux');
      expect(objectToQueryString({ name: 'John', age: '30' })).toBe('?name=John&age=30');
    });

    test('빈 객체', () => {
      expect(objectToQueryString({})).toBe('');
    });

    test('falsy 값 필터링', () => {
      expect(
        objectToQueryString({ foo: 'bar', empty: '', nullValue: null, undefinedValue: undefined }),
      ).toBe('?foo=bar');
      expect(objectToQueryString({ zero: 0, false: false, emptyString: '' })).toBe('');
    });

    test('숫자 값', () => {
      expect(objectToQueryString({ count: 10, rating: 4.5 })).toBe('?count=10&rating=4.5');
      expect(objectToQueryString({ zero: 0 })).toBe(''); // 0은 falsy이므로 제외됨
    });

    test('불린 값', () => {
      expect(objectToQueryString({ enabled: true, disabled: false })).toBe('?enabled=true');
    });

    test('특수 문자 포함', () => {
      expect(
        objectToQueryString({
          'special-key': 'value with spaces',
          another_key: 'value&with&ampersands',
        }),
      ).toBe('?special-key=value with spaces&another_key=value&with&ampersands');
    });

    test('단일 키-값', () => {
      expect(objectToQueryString({ single: 'value' })).toBe('?single=value');
    });

    test('null/undefined 객체', () => {
      expect(objectToQueryString(null as any)).toBe('');
      expect(objectToQueryString(undefined as any)).toBe('');
    });

    test('중첩된 값들 (문자열화)', () => {
      expect(
        objectToQueryString({ arr: [1, 2, 3].toString(), obj: JSON.stringify({ a: 1 }) }),
      ).toBe('?arr=1,2,3&obj={"a":1}');
    });
  });

  describe('queryParam', () => {
    test('문자열 값 반환', () => {
      expect(queryParam('hello')).toBe('hello');
      expect(queryParam('123')).toBe('123');
      expect(queryParam('')).toBe('');
    });

    test('배열의 첫 번째 값 반환', () => {
      expect(queryParam(['first', 'second', 'third'])).toBe('first');
      expect(queryParam(['only'])).toBe('only');
      expect(queryParam([])).toBe(undefined);
    });

    test('null과 undefined 처리', () => {
      expect(queryParam(null)).toBe(undefined);
      expect(queryParam(undefined)).toBe(undefined);
    });

    test('빈 배열 처리', () => {
      expect(queryParam([])).toBe(undefined);
    });

    test('복잡한 배열 값', () => {
      expect(queryParam(['param1=value1', 'param2=value2'])).toBe('param1=value1');
      expect(queryParam(['123', '456', '789'])).toBe('123');
    });

    test('특수 문자가 포함된 값', () => {
      expect(queryParam('value with spaces')).toBe('value with spaces');
      expect(queryParam('value&with&special=chars')).toBe('value&with&special=chars');
      expect(queryParam(['encoded%20value', 'second'])).toBe('encoded%20value');
    });

    test('유니코드 문자', () => {
      expect(queryParam('한글값')).toBe('한글값');
      expect(queryParam(['🦄unicorn', 'second'])).toBe('🦄unicorn');
    });
  });

  describe('edge cases', () => {
    test('joinUrl - 매우 긴 URL', () => {
      const longPath = 'a'.repeat(1000);
      const result = joinUrl('http://example.com', longPath, 'api');
      expect(result).toBe(`http://example.com/${longPath}/api`);
      expect(result.length).toBeGreaterThan(1000);
    });

    test('objectToQueryString - 매우 많은 파라미터', () => {
      const manyParams = {};
      for (let i = 0; i < 100; i++) {
        (manyParams as any)[`param${i}`] = `value${i}`;
      }
      const result = objectToQueryString(manyParams);
      expect(result).toMatch(/^\?param0=value0/);
      expect(result.split('&').length).toBe(100);
    });

    test('queryParam - 매우 큰 배열', () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => `value${i}`);
      expect(queryParam(largeArray)).toBe('value0');
    });
  });

  describe('일관성 테스트', () => {
    test('joinUrl과 objectToQueryString 조합', () => {
      const baseUrl = 'http://api.example.com';
      const path = 'users/123';
      const params = { include: 'profile', format: 'json' };

      const url = joinUrl(baseUrl, path);
      const queryString = objectToQueryString(params);
      const fullUrl = url + queryString;

      expect(fullUrl).toBe('http://api.example.com/users/123?include=profile&format=json');
    });

    test('URL 재구성 가능성', () => {
      const originalParts = ['http://example.com', 'api', 'v1', 'users'];
      const joined = joinUrl(...originalParts);

      // URL을 다시 파싱할 수 있어야 함
      expect(joined).toMatch(/^http:\/\/example\.com\/api\/v1\/users$/);

      const url = new URL(joined);
      expect(url.protocol).toBe('http:');
      expect(url.hostname).toBe('example.com');
      expect(url.pathname).toBe('/api/v1/users');
    });
  });

  describe('성능 테스트', () => {
    test('joinUrl 대량 처리', () => {
      const start = performance.now();

      for (let i = 0; i < 1000; i++) {
        joinUrl('http://example.com', 'api', `resource${i}`, `${i}`);
      }

      const end = performance.now();
      expect(end - start).toBeLessThan(100);
    });

    test('objectToQueryString 대량 처리', () => {
      const start = performance.now();

      for (let i = 0; i < 1000; i++) {
        objectToQueryString({
          id: i,
          name: `name${i}`,
          active: i % 2 === 0,
          count: i * 10,
        });
      }

      const end = performance.now();
      expect(end - start).toBeLessThan(50);
    });
  });
});
