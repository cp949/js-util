import { describe, test, expect } from 'vitest';
import {
  ensurePrefix,
  ensureSuffix,
  substringAfter,
  substringAfterLast,
  substringBefore,
  substringBeforeLast,
  strlen,
  isDigit,
  formatByteCount,
  trimLeft,
  trimRight,
} from '../../../src/pstring/index.js';

describe('pstring - Additional Functions', () => {
  describe('ensurePrefix', () => {
    test('접두사가 없으면 추가', () => {
      expect(ensurePrefix('hello', 'prefix_')).toBe('prefix_hello');
      expect(ensurePrefix('world', 'http://')).toBe('http://world');
    });

    test('접두사가 이미 있으면 그대로', () => {
      expect(ensurePrefix('prefix_hello', 'prefix_')).toBe('prefix_hello');
      expect(ensurePrefix('http://example.com', 'http://')).toBe('http://example.com');
    });

    test('빈 문자열', () => {
      expect(ensurePrefix('', 'prefix_')).toBe('prefix_');
    });

    test('빈 접두사', () => {
      expect(ensurePrefix('hello', '')).toBe('hello');
    });
  });

  describe('ensureSuffix', () => {
    test('접미사가 없으면 추가', () => {
      expect(ensureSuffix('hello', '_suffix')).toBe('hello_suffix');
      expect(ensureSuffix('file', '.txt')).toBe('file.txt');
    });

    test('접미사가 이미 있으면 그대로', () => {
      expect(ensureSuffix('hello_suffix', '_suffix')).toBe('hello_suffix');
      expect(ensureSuffix('file.txt', '.txt')).toBe('file.txt');
    });

    test('빈 문자열', () => {
      expect(ensureSuffix('', '_suffix')).toBe('_suffix');
    });

    test('빈 접미사', () => {
      expect(ensureSuffix('hello', '')).toBe('hello');
    });
  });

  describe('substringAfter', () => {
    test('구분자 뒤의 문자열 반환', () => {
      expect(substringAfter('name=value', '=')).toBe('value');
      expect(substringAfter('hello.world.test', '.')).toBe('world.test');
      expect(substringAfter('prefix_content', 'prefix_')).toBe('content');
    });

    test('구분자가 없는 경우', () => {
      expect(substringAfter('no-delimiter', '=')).toBe('no-delimiter');
      expect(substringAfter('hello', 'xyz')).toBe('hello');
    });

    test('구분자가 없을 때 기본값 사용', () => {
      expect(substringAfter('no-delimiter', '=', 'default')).toBe('default');
    });

    test('빈 문자열과 빈 구분자', () => {
      expect(substringAfter('', '=')).toBe('');
      expect(substringAfter('hello', '')).toBe('hello');
      expect(substringAfter('', '', 'default')).toBe('default');
    });
  });

  describe('substringAfterLast', () => {
    test('마지막 구분자 뒤의 문자열 반환', () => {
      expect(substringAfterLast('hello.world.test', '.')).toBe('test');
      expect(substringAfterLast('a/b/c/file.txt', '/')).toBe('file.txt');
    });

    test('구분자가 하나만 있는 경우', () => {
      expect(substringAfterLast('name=value', '=')).toBe('value');
    });

    test('구분자가 없을 때 기본값', () => {
      expect(substringAfterLast('no-delimiter', '=', 'default')).toBe('default');
    });
  });

  describe('substringBefore', () => {
    test('구분자 앞의 문자열 반환', () => {
      expect(substringBefore('name=value', '=')).toBe('name');
      expect(substringBefore('hello.world.test', '.')).toBe('hello');
      expect(substringBefore('content_suffix', '_suffix')).toBe('content');
    });

    test('구분자가 없는 경우', () => {
      expect(substringBefore('no-delimiter', '=')).toBe('no-delimiter');
    });

    test('구분자가 없을 때 기본값', () => {
      expect(substringBefore('no-delimiter', '=', 'default')).toBe('default');
    });

    test('구분자가 문자열 시작에 있는 경우', () => {
      expect(substringBefore('=value', '=')).toBe('');
    });
  });

  describe('substringBeforeLast', () => {
    test('마지막 구분자 앞의 문자열 반환', () => {
      expect(substringBeforeLast('hello.world.test', '.')).toBe('hello.world');
      expect(substringBeforeLast('a/b/c/file.txt', '/')).toBe('a/b/c');
    });

    test('구분자가 하나만 있는 경우', () => {
      expect(substringBeforeLast('name=value', '=')).toBe('name');
    });
  });

  describe('strlen', () => {
    test('일반 문자열 길이', () => {
      expect(strlen('hello')).toBe(5);
      expect(strlen('world')).toBe(5);
      expect(strlen('')).toBe(0);
    });

    test('null과 undefined 처리', () => {
      expect(strlen(null)).toBe(0);
      expect(strlen(undefined)).toBe(0);
    });

    test('유니코드 문자열', () => {
      expect(strlen('안녕하세요')).toBe(5);
      expect(strlen('🎉🎈🎊')).toBe(6); // 이모지는 2 UTF-16 코드 유닛
    });
  });

  describe('isDigit', () => {
    test('숫자 문자 판별', () => {
      expect(isDigit('0')).toBe(true);
      expect(isDigit('5')).toBe(true);
      expect(isDigit('9')).toBe(true);
    });

    test('숫자가 아닌 문자', () => {
      expect(isDigit('a')).toBe(false);
      expect(isDigit('Z')).toBe(false);
      expect(isDigit(' ')).toBe(false);
      expect(isDigit('.')).toBe(false);
    });

    test('빈 문자열과 긴 문자열', () => {
      expect(isDigit('')).toBe(false);
      expect(isDigit('12')).toBe(true); // isDigit은 문자열이 모두 숫자인지 확인
      expect(isDigit('1a')).toBe(false);
    });
  });

  describe('formatByteCount', () => {
    test('바이트 단위 포맷팅', () => {
      expect(formatByteCount(0)).toBe('0 bytes');
      expect(formatByteCount(1)).toBe('1 byte');
      expect(formatByteCount(1023)).toBe('1023 bytes');
    });

    test('KB 단위', () => {
      expect(formatByteCount(1024)).toBe('1 KB');
      expect(formatByteCount(1536)).toBe('1.5 KB');
      expect(formatByteCount(2048)).toBe('2 KB');
    });

    test('MB 단위', () => {
      expect(formatByteCount(1024 * 1024)).toBe('1 MB');
      expect(formatByteCount(1024 * 1024 * 2.5)).toBe('2.5 MB');
    });

    test('GB 단위', () => {
      expect(formatByteCount(1024 * 1024 * 1024)).toBe('1 GB');
      expect(formatByteCount(1024 * 1024 * 1024 * 1.5)).toBe('1.5 GB');
    });

    test('TB 단위', () => {
      expect(formatByteCount(1024 * 1024 * 1024 * 1024)).toBe('1 TB');
    });

    test('음수 처리', () => {
      expect(formatByteCount(-1024)).toBe('-1024 bytes'); // 음수는 단순히 bytes로 표시
    });
  });

  describe('trimLeft', () => {
    test('왼쪽 공백 제거', () => {
      expect(trimLeft('   hello')).toBe('hello');
      expect(trimLeft('\t\n hello world')).toBe('hello world');
    });

    test('오른쪽 공백은 유지', () => {
      expect(trimLeft('  hello  ')).toBe('hello  ');
    });

    test('공백이 없는 문자열', () => {
      expect(trimLeft('hello')).toBe('hello');
    });

    test('null/undefined 처리', () => {
      expect(trimLeft(null)).toBe('');
      expect(trimLeft(undefined)).toBe('');
    });
  });

  describe('trimRight', () => {
    test('오른쪽 공백 제거', () => {
      expect(trimRight('hello   ')).toBe('hello');
      expect(trimRight('hello world\t\n ')).toBe('hello world');
    });

    test('왼쪽 공백은 유지', () => {
      expect(trimRight('  hello  ')).toBe('  hello');
    });

    test('공백이 없는 문자열', () => {
      expect(trimRight('hello')).toBe('hello');
    });

    test('null/undefined 처리', () => {
      expect(trimRight(null)).toBe('');
      expect(trimRight(undefined)).toBe('');
    });
  });
});
