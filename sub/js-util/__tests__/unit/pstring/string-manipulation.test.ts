import { describe, test, expect } from 'vitest';
import { trim } from '../../../src/pstring/trim.js';
import { trimLeft } from '../../../src/pstring/trimLeft.js';
import { trimRight } from '../../../src/pstring/trimRight.js';
import { removePrefix } from '../../../src/pstring/removePrefix.js';
import { removeSuffix } from '../../../src/pstring/removeSuffix.js';
import { ensurePrefix } from '../../../src/pstring/ensurePrefix.js';
import { ensureSuffix } from '../../../src/pstring/ensureSuffix.js';
import { replaceAll } from '../../../src/pstring/replaceAll.js';
import { splitFirst } from '../../../src/pstring/splitFirst.js';
import { splitLast } from '../../../src/pstring/splitLast.js';

describe('pstring - string manipulation', () => {
  describe('trim functions', () => {
    test('trim - 양쪽 공백 제거', () => {
      expect(trim('  hello  ')).toBe('hello');
      expect(trim('\t\n hello \r\n')).toBe('hello');
      expect(trim('hello')).toBe('hello');
      expect(trim('')).toBe('');
    });

    test('trimLeft - 왼쪽 공백 제거', () => {
      expect(trimLeft('  hello  ')).toBe('hello  ');
      expect(trimLeft('\t\nhello')).toBe('hello');
      expect(trimLeft('hello  ')).toBe('hello  ');
      expect(trimLeft('')).toBe('');
    });

    test('trimRight - 오른쪽 공백 제거', () => {
      expect(trimRight('  hello  ')).toBe('  hello');
      expect(trimRight('hello\t\n')).toBe('hello');
      expect(trimRight('  hello')).toBe('  hello');
      expect(trimRight('')).toBe('');
    });
  });

  describe('prefix/suffix functions', () => {
    test('removePrefix - 접두사 제거', () => {
      expect(removePrefix('hello world', 'hello ')).toBe('world');
      expect(removePrefix('test_case', 'test_')).toBe('case');
      expect(removePrefix('hello', 'world')).toBe('hello');
      expect(removePrefix('', 'prefix')).toBe('');
    });

    test('removeSuffix - 접미사 제거', () => {
      expect(removeSuffix('hello world', ' world')).toBe('hello');
      expect(removeSuffix('test.js', '.js')).toBe('test');
      expect(removeSuffix('hello', 'world')).toBe('hello');
      expect(removeSuffix('', 'suffix')).toBe('');
    });

    test('ensurePrefix - 접두사 보장', () => {
      expect(ensurePrefix('world', 'hello ')).toBe('hello world');
      expect(ensurePrefix('hello world', 'hello ')).toBe('hello world');
      expect(ensurePrefix('', 'prefix')).toBe('prefix');
    });

    test('ensureSuffix - 접미사 보장', () => {
      expect(ensureSuffix('hello', ' world')).toBe('hello world');
      expect(ensureSuffix('hello world', ' world')).toBe('hello world');
      expect(ensureSuffix('', 'suffix')).toBe('suffix');
    });
  });

  describe('replaceAll', () => {
    test('기본 문자열 치환', () => {
      expect(replaceAll('hello world hello', 'hello', 'hi')).toBe('hi world hi');
      expect(replaceAll('test test test', 'test', 'case')).toBe('case case case');
    });

    test('치환할 문자가 없는 경우', () => {
      expect(replaceAll('hello world', 'xyz', 'abc')).toBe('hello world');
    });

    test('특수문자 치환', () => {
      expect(replaceAll('a.b.c', '.', '-')).toBe('a-b-c');
      expect(replaceAll('$100 $200', '$', '€')).toBe('€100 €200');
    });
  });

  describe('split functions', () => {
    test('splitFirst - 첫 번째 구분자로 분할', () => {
      expect(splitFirst('a.b.c.d', '.')).toEqual(['a', 'b.c.d']);
      expect(splitFirst('hello world test', ' ')).toEqual(['hello', 'world test']);
      expect(splitFirst('no-separator', '.')).toEqual(['no-separator', null]);
    });

    test('splitLast - 마지막 구분자로 분할', () => {
      expect(splitLast('a.b.c.d', '.')).toEqual(['a.b.c', 'd']);
      expect(splitLast('path/to/file.txt', '/')).toEqual(['path/to', 'file.txt']);
      expect(splitLast('no-separator', '.')).toEqual(['no-separator', null]);
    });
  });
});