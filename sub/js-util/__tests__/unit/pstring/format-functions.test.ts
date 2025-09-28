import { describe, test, expect } from 'vitest';
import { formatByteCount } from '../../../src/pstring/formatByteCount.js';
import { formatDurationByMilli } from '../../../src/pstring/formatDuration.js';
import slugify, { slugifyWithCounter } from '../../../src/pstring/slugify.js';

describe('pstring - format functions', () => {
  describe('formatByteCount', () => {
    test('기본 바이트 단위 변환', () => {
      expect(formatByteCount(0)).toBe('0 bytes');
      expect(formatByteCount(1)).toBe('1 byte');
      expect(formatByteCount(2)).toBe('2 bytes');
      expect(formatByteCount(999)).toBe('999 bytes');
    });

    test('킬로바이트 변환', () => {
      expect(formatByteCount(1024)).toBe('1 KB');
      expect(formatByteCount(1536)).toBe('1.5 KB');
      expect(formatByteCount(2048)).toBe('2 KB');
      expect(formatByteCount(1024 * 10)).toBe('10 KB');
    });

    test('메가바이트 변환', () => {
      expect(formatByteCount(1024 * 1024)).toBe('1 MB');
      expect(formatByteCount(1024 * 1024 * 1.5)).toBe('1.5 MB');
      expect(formatByteCount(1024 * 1024 * 10)).toBe('10 MB');
    });

    test('기가바이트 변환', () => {
      expect(formatByteCount(1024 * 1024 * 1024)).toBe('1 GB');
      expect(formatByteCount(1024 * 1024 * 1024 * 2.5)).toBe('2.5 GB');
    });

    test('테라바이트 이상 변환', () => {
      const TB = 1024 * 1024 * 1024 * 1024;
      expect(formatByteCount(TB)).toBe('1 TB');
      expect(formatByteCount(TB * 1024)).toBe('1 PB');
      expect(formatByteCount(TB * 1024 * 1024)).toBe('1 EB');
    });

    test('소수점 처리 규칙', () => {
      // 10 미만일 때는 소수점 1자리, 10 이상일 때는 정수
      expect(formatByteCount(1536)).toBe('1.5 KB'); // 1.5 < 10
      expect(formatByteCount(10240)).toBe('10 KB'); // 10 >= 10
      expect(formatByteCount(15360)).toBe('15 KB'); // 15 >= 10
    });

    test('음수 및 0 처리', () => {
      expect(formatByteCount(0)).toBe('0 bytes');
      // 음수는 실제로는 유효하지 않지만 함수의 동작 확인
      expect(formatByteCount(-1024)).toBe('-1024 bytes');
    });

    test('매우 큰 수 처리', () => {
      const YB = Math.pow(1024, 8);
      expect(formatByteCount(YB)).toBe('1 YB');
    });
  });

  describe('formatDurationByMilli', () => {
    test('기본 시간 포맷팅', () => {
      expect(formatDurationByMilli(0)).toBe('00:00');
      expect(formatDurationByMilli(1000)).toBe('00:01');
      expect(formatDurationByMilli(60000)).toBe('01:00');
    });

    test('시간이 포함된 포맷팅', () => {
      expect(formatDurationByMilli(3600000)).toBe('01:00:00');
      expect(formatDurationByMilli(3661000)).toBe('01:01:01');
      expect(formatDurationByMilli(7322000)).toBe('02:02:02');
    });

    test('withZeroHour 옵션', () => {
      expect(formatDurationByMilli(60000, true)).toBe('00:01:00');
      expect(formatDurationByMilli(90000, true)).toBe('00:01:30');
    });

    test('leadingZero 옵션', () => {
      expect(formatDurationByMilli(60000, false, false)).toBe('1:00');
      expect(formatDurationByMilli(3600000, false, false)).toBe('1:00:00');
    });

    test('음수 처리', () => {
      expect(formatDurationByMilli(-1000)).toBe('-00:01');
      expect(formatDurationByMilli(-3661000)).toBe('-01:01:01');
    });
  });

  describe('slugify', () => {
    test('기본 slugify 변환', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('This is a Test')).toBe('this-is-a-test');
      expect(slugify('JavaScript & TypeScript')).toBe('java-script-and-type-script');
    });

    test('특수문자 제거', () => {
      expect(slugify('hello@world.com')).toBe('hello-world-com');
      expect(slugify('test#123$456')).toBe('test-123-456');
      expect(slugify('a/b\\c')).toBe('a-b-c');
    });

    test('camelCase 분해', () => {
      expect(slugify('camelCaseString')).toBe('camel-case-string');
      expect(slugify('XMLHttpRequest')).toBe('xml-http-request');
      expect(slugify('HTMLElement')).toBe('html-element');
    });

    test('유니코드 문자 처리', () => {
      expect(slugify('café')).toBe('cafe');
      expect(slugify('naïve')).toBe('naive');
      expect(slugify('Москва')).toBe('moskva');
    });

    test('이모지 및 특수 문자 변환', () => {
      expect(slugify('I ♥ unicorns & 🦄')).toBe('i-love-unicorns-and-unicorn');
    });

    test('옵션 - separator 변경', () => {
      expect(slugify('hello world', { separator: '_' })).toBe('hello_world');
      expect(slugify('test-case', { separator: '.' })).toBe('test.case');
    });

    test('옵션 - lowercase 비활성화', () => {
      expect(slugify('Hello World', { lowercase: false })).toBe('Hello-World');
      expect(slugify('TEST CASE', { lowercase: false })).toBe('TEST-CASE');
    });

    test('옵션 - decamelize 비활성화', () => {
      expect(slugify('camelCase', { decamelize: false })).toBe('camelcase');
      expect(slugify('XMLHttpRequest', { decamelize: false })).toBe('xmlhttprequest');
    });

    test('옵션 - custom replacements', () => {
      const options = {
        customReplacements: [
          ['@', 'at'],
          ['©', 'copyright']
        ] as [string, string][]
      };
      expect(slugify('email@domain.com', options)).toBe('emailatdomain-com');
      expect(slugify('© 2023', options)).toBe('copyright-2023');
    });

    test('옵션 - preserve characters', () => {
      expect(slugify('hello.world', { preserveCharacters: ['.'] })).toBe('hello.world');
      expect(slugify('test_case', { preserveCharacters: ['_'] })).toBe('test_case');
    });

    test('옵션 - preserve leading underscore', () => {
      expect(slugify('_private', { preserveLeadingUnderscore: true })).toBe('_private');
      expect(slugify('__double', { preserveLeadingUnderscore: true })).toBe('_double');
    });

    test('옵션 - preserve trailing dash', () => {
      expect(slugify('command-', { preserveTrailingDash: true })).toBe('command-');
    });

    test('빈 문자열 및 공백만 있는 경우', () => {
      expect(slugify('')).toBe('');
      expect(slugify('   ')).toBe('');
      expect(slugify('!!!')).toBe('');
    });

    test('연속된 구분자 제거', () => {
      expect(slugify('hello---world')).toBe('hello-world');
      expect(slugify('test___case')).toBe('test-case');
    });
  });

  describe('slugifyWithCounter', () => {
    test('기본 카운터 기능', () => {
      const slugifyCounter = slugifyWithCounter();
      
      expect(slugifyCounter('hello world')).toBe('hello-world');
      expect(slugifyCounter('hello world')).toBe('hello-world-2');
      expect(slugifyCounter('hello world')).toBe('hello-world-3');
    });

    test('서로 다른 문자열은 독립적', () => {
      const slugifyCounter = slugifyWithCounter();
      
      expect(slugifyCounter('hello')).toBe('hello');
      expect(slugifyCounter('world')).toBe('world');
      expect(slugifyCounter('hello')).toBe('hello-2');
      expect(slugifyCounter('world')).toBe('world-2');
    });

    test('reset 기능', () => {
      const slugifyCounter = slugifyWithCounter();
      
      expect(slugifyCounter('test')).toBe('test');
      expect(slugifyCounter('test')).toBe('test-2');
      
      slugifyCounter.reset();
      
      expect(slugifyCounter('test')).toBe('test');
      expect(slugifyCounter('test')).toBe('test-2');
    });

    test('빈 문자열 처리', () => {
      const slugifyCounter = slugifyWithCounter();
      
      expect(slugifyCounter('')).toBe('');
      expect(slugifyCounter('')).toBe('');
    });

    test('옵션과 함께 사용', () => {
      const slugifyCounter = slugifyWithCounter();
      const options = { separator: '_' };
      
      expect(slugifyCounter('hello world', options)).toBe('hello_world');
      expect(slugifyCounter('hello world', options)).toBe('hello_world_2');
    });
  });

  describe('성능 테스트', () => {
    test('formatByteCount 대량 처리', () => {
      const start = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        formatByteCount(Math.random() * 1024 * 1024 * 1024);
      }
      
      const end = performance.now();
      expect(end - start).toBeLessThan(50);
    });

    test('slugify 대량 처리', () => {
      const start = performance.now();
      
      for (let i = 0; i < 100; i++) {
        slugify(`Test String Number ${i} with Special Characters @#$%`);
      }
      
      const end = performance.now();
      expect(end - start).toBeLessThan(100);
    });
  });
});