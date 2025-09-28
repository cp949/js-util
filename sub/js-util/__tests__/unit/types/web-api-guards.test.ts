import { describe, test, expect } from 'vitest';
import { isFile, isBlob, isURL, isURLSearchParams, isFormData } from '../../../src/types/index.js';

describe('Web API TypeGuards', () => {
  describe('isFile', () => {
    test('파일 객체 검증', () => {
      if (typeof File !== 'undefined') {
        const file = new File(['hello'], 'test.txt', { type: 'text/plain' });
        expect(isFile(file)).toBe(true);
      }
    });

    test('File이 없는 환경에서 false 반환', () => {
      expect(isFile('not a file')).toBe(false);
      expect(isFile({})).toBe(false);
      expect(isFile(null)).toBe(false);
    });
  });

  describe('isBlob', () => {
    test('Blob 객체 검증', () => {
      if (typeof Blob !== 'undefined') {
        const blob = new Blob(['hello world'], { type: 'text/plain' });
        expect(isBlob(blob)).toBe(true);
      }
    });

    test('Blob이 아닌 값들은 false', () => {
      expect(isBlob('not a blob')).toBe(false);
      expect(isBlob({})).toBe(false);
      expect(isBlob(null)).toBe(false);
    });
  });

  describe('isURL', () => {
    test('URL 객체 검증', () => {
      if (typeof URL !== 'undefined') {
        const url = new URL('https://example.com');
        expect(isURL(url)).toBe(true);
      }
    });

    test('URL이 아닌 값들은 false', () => {
      expect(isURL('https://example.com')).toBe(false);
      expect(isURL({})).toBe(false);
      expect(isURL(null)).toBe(false);
    });
  });

  describe('isURLSearchParams', () => {
    test('URLSearchParams 객체 검증', () => {
      if (typeof URLSearchParams !== 'undefined') {
        const params = new URLSearchParams('name=john&age=30');
        expect(isURLSearchParams(params)).toBe(true);
      }
    });

    test('URLSearchParams가 아닌 값들은 false', () => {
      expect(isURLSearchParams('name=john')).toBe(false);
      expect(isURLSearchParams({})).toBe(false);
      expect(isURLSearchParams(null)).toBe(false);
    });
  });

  describe('isFormData', () => {
    test('FormData 객체 검증', () => {
      if (typeof FormData !== 'undefined') {
        const formData = new FormData();
        formData.append('name', 'john');
        expect(isFormData(formData)).toBe(true);
      }
    });

    test('FormData가 아닌 값들은 false', () => {
      expect(isFormData({})).toBe(false);
      expect(isFormData(null)).toBe(false);
      expect(isFormData(undefined)).toBe(false);
    });
  });
});
