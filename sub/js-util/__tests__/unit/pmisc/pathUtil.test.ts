import { describe, test, expect } from 'vitest';
import { pathUtil } from '../../../src/pmisc/pathUtil.js';

describe('pmisc - pathUtil', () => {
  describe('normalize', () => {
    test('기본 경로 정규화', () => {
      expect(pathUtil.normalize('/foo/bar//baz/asdf/quux/..')).toBe('/foo/bar/baz/asdf');
      expect(pathUtil.normalize('/foo/bar//baz/asdf/quux/../..')).toBe('/foo/bar/baz');
      expect(pathUtil.normalize('/foo/bar/./baz')).toBe('/foo/bar/baz');
    });

    test('상대 경로 정규화', () => {
      expect(pathUtil.normalize('foo/bar//baz/asdf/quux/..')).toBe('foo/bar/baz/asdf');
      expect(pathUtil.normalize('./foo')).toBe('foo');
      expect(pathUtil.normalize('../foo')).toBe('../foo');
      expect(pathUtil.normalize('../../foo')).toBe('../../foo');
    });

    test('빈 경로와 특수 케이스', () => {
      expect(pathUtil.normalize('')).toBe('.');
      expect(pathUtil.normalize('.')).toBe('.');
      expect(pathUtil.normalize('..')).toBe('..');
      expect(pathUtil.normalize('/')).toBe('/');
    });

    test('연속 슬래시 처리', () => {
      expect(pathUtil.normalize('//foo//bar//')).toBe('/foo/bar/');
      expect(pathUtil.normalize('foo//bar')).toBe('foo/bar');
    });

    test('trailing separator 유지', () => {
      expect(pathUtil.normalize('/foo/bar/')).toBe('/foo/bar/');
      expect(pathUtil.normalize('foo/bar/')).toBe('foo/bar/');
    });

    test('복잡한 . 과 .. 처리', () => {
      expect(pathUtil.normalize('/foo/./bar/../baz')).toBe('/foo/baz');
      expect(pathUtil.normalize('/foo/../bar/./baz')).toBe('/bar/baz');
      expect(pathUtil.normalize('/../../foo')).toBe('/foo');
    });

    test('잘못된 입력 타입', () => {
      expect(() => pathUtil.normalize(123 as any)).toThrow('Path must be a string');
      expect(() => pathUtil.normalize(null as any)).toThrow('Path must be a string');
      expect(() => pathUtil.normalize(undefined as any)).toThrow('Path must be a string');
    });
  });

  describe('isAbsolute', () => {
    test('절대 경로 판별', () => {
      expect(pathUtil.isAbsolute('/foo/bar')).toBe(true);
      expect(pathUtil.isAbsolute('/baz/..')).toBe(true);
      expect(pathUtil.isAbsolute('/foo/bar//baz')).toBe(true);
    });

    test('상대 경로 판별', () => {
      expect(pathUtil.isAbsolute('foo/bar')).toBe(false);
      expect(pathUtil.isAbsolute('./foo')).toBe(false);
      expect(pathUtil.isAbsolute('../foo')).toBe(false);
      expect(pathUtil.isAbsolute('.')).toBe(false);
      expect(pathUtil.isAbsolute('..')).toBe(false);
    });

    test('빈 경로', () => {
      expect(pathUtil.isAbsolute('')).toBe(false);
    });

    test('루트 경로', () => {
      expect(pathUtil.isAbsolute('/')).toBe(true);
    });

    test('잘못된 입력 타입', () => {
      expect(() => pathUtil.isAbsolute(123 as any)).toThrow('Path must be a string');
      expect(() => pathUtil.isAbsolute(null as any)).toThrow('Path must be a string');
    });
  });

  describe('join', () => {
    test('기본 경로 결합', () => {
      expect(pathUtil.join('/foo', 'bar', 'baz/asdf', 'quux', '..')).toBe('/foo/bar/baz/asdf');
      expect(pathUtil.join('foo', 'bar', 'baz')).toBe('foo/bar/baz');
    });

    test('빈 인자들 처리', () => {
      expect(pathUtil.join()).toBe('.');
      expect(pathUtil.join('')).toBe('.');
      expect(pathUtil.join('', 'foo')).toBe('foo');
      expect(pathUtil.join('foo', '', 'bar')).toBe('foo/bar');
    });

    test('절대 경로가 포함된 결합', () => {
      expect(pathUtil.join('foo', '/bar', 'baz')).toBe('foo/bar/baz');
      expect(pathUtil.join('/foo', 'bar')).toBe('/foo/bar');
    });

    test('현재 및 상위 디렉토리', () => {
      expect(pathUtil.join('foo', '.', 'bar')).toBe('foo/bar');
      expect(pathUtil.join('foo', '..', 'bar')).toBe('bar');
      expect(pathUtil.join('foo', '../bar')).toBe('bar');
    });

    test('복잡한 경로 결합', () => {
      expect(pathUtil.join('/foo/bar', '../baz', './quux')).toBe('/foo/baz/quux');
      expect(pathUtil.join('a', 'b', '..', '..', 'c')).toBe('c');
    });

    test('잘못된 입력 타입', () => {
      expect(() => pathUtil.join('foo', 123 as any)).toThrow('Path must be a string');
      expect(() => pathUtil.join(null as any)).toThrow('Path must be a string');
    });
  });

  describe('parse', () => {
    test('절대 경로 파싱', () => {
      const result = pathUtil.parse('/home/user/documents/file.txt');
      expect(result).toEqual({
        root: '/',
        dir: '/home/user/documents',
        base: 'file.txt',
        ext: '.txt',
        name: 'file'
      });
    });

    test('상대 경로 파싱', () => {
      const result = pathUtil.parse('documents/file.txt');
      expect(result).toEqual({
        root: '',
        dir: 'documents',
        base: 'file.txt',
        ext: '.txt',
        name: 'file'
      });
    });

    test('확장자 없는 파일', () => {
      const result = pathUtil.parse('/home/user/filename');
      expect(result).toEqual({
        root: '/',
        dir: '/home/user',
        base: 'filename',
        ext: '',
        name: 'filename'
      });
    });

    test('숨김 파일', () => {
      const result = pathUtil.parse('/home/user/.bashrc');
      expect(result).toEqual({
        root: '/',
        dir: '/home/user',
        base: '.bashrc',
        ext: '',
        name: '.bashrc'
      });
    });

    test('확장자가 있는 숨김 파일', () => {
      const result = pathUtil.parse('/home/user/.config.json');
      expect(result).toEqual({
        root: '/',
        dir: '/home/user',
        base: '.config.json',
        ext: '.json',
        name: '.config'
      });
    });

    test('경로만 있는 경우 (디렉토리)', () => {
      const result = pathUtil.parse('/home/user/');
      expect(result).toEqual({
        root: '/',
        dir: '/home',
        base: 'user',
        ext: '',
        name: 'user'
      });
    });

    test('루트 경로', () => {
      const result = pathUtil.parse('/');
      expect(result).toEqual({
        root: '/',
        dir: '/',
        base: '',
        ext: '',
        name: ''
      });
    });

    test('빈 경로', () => {
      const result = pathUtil.parse('');
      expect(result).toEqual({
        root: '',
        dir: '',
        base: '',
        ext: '',
        name: ''
      });
    });

    test('파일명만', () => {
      const result = pathUtil.parse('file.txt');
      expect(result).toEqual({
        root: '',
        dir: '',
        base: 'file.txt',
        ext: '.txt',
        name: 'file'
      });
    });

    test('복잡한 확장자', () => {
      const result = pathUtil.parse('/path/file.tar.gz');
      expect(result).toEqual({
        root: '/',
        dir: '/path',
        base: 'file.tar.gz',
        ext: '.gz',
        name: 'file.tar'
      });
    });

    test('점으로만 이루어진 경우', () => {
      expect(pathUtil.parse('/home/..')).toEqual({
        root: '/',
        dir: '/home',
        base: '..',
        ext: '',
        name: '..'
      });

      expect(pathUtil.parse('/home/.')).toEqual({
        root: '/',
        dir: '/home',
        base: '.',
        ext: '',
        name: '.'
      });
    });

    test('잘못된 입력 타입', () => {
      expect(() => pathUtil.parse(123 as any)).toThrow('Path must be a string');
      expect(() => pathUtil.parse(null as any)).toThrow('Path must be a string');
    });
  });

  describe('통합 테스트', () => {
    test('normalize와 join 조합', () => {
      const joined = pathUtil.join('/foo', 'bar', '..', 'baz');
      const normalized = pathUtil.normalize(joined);
      expect(normalized).toBe('/foo/baz');
    });

    test('parse와 다른 메서드들 조합', () => {
      const parsed = pathUtil.parse('/home/user/documents/file.txt');
      const rejoined = pathUtil.join(parsed.dir, parsed.base);
      expect(pathUtil.normalize(rejoined)).toBe('/home/user/documents/file.txt');
    });

    test('isAbsolute와 normalize 조합', () => {
      const path1 = '/foo/../bar';
      const path2 = 'foo/../bar';
      
      expect(pathUtil.isAbsolute(path1)).toBe(true);
      expect(pathUtil.isAbsolute(path2)).toBe(false);
      
      const normalized1 = pathUtil.normalize(path1);
      const normalized2 = pathUtil.normalize(path2);
      
      expect(pathUtil.isAbsolute(normalized1)).toBe(true);
      expect(pathUtil.isAbsolute(normalized2)).toBe(false);
    });

    test('실제 사용 시나리오', () => {
      // 파일 시스템 경로 조작 시나리오
      const basePath = '/var/www/html';
      const userPath = '../../../etc/passwd';
      const fullPath = pathUtil.join(basePath, userPath);
      const normalizedPath = pathUtil.normalize(fullPath);
      
      expect(normalizedPath).toBe('/etc/passwd');
      expect(pathUtil.isAbsolute(normalizedPath)).toBe(true);
      
      const parsed = pathUtil.parse(normalizedPath);
      expect(parsed.dir).toBe('/etc');
      expect(parsed.name).toBe('passwd');
      expect(parsed.ext).toBe('');
    });
  });

  describe('Edge Cases', () => {
    test('매우 긴 경로', () => {
      const longPath = '/' + 'a'.repeat(1000) + '/' + 'b'.repeat(1000) + '.txt';
      const parsed = pathUtil.parse(longPath);
      expect(parsed.name).toBe('b'.repeat(1000));
      expect(parsed.ext).toBe('.txt');
    });

    test('특수 문자가 포함된 경로', () => {
      const specialPath = '/home/user/file name with spaces.txt';
      const parsed = pathUtil.parse(specialPath);
      expect(parsed.name).toBe('file name with spaces');
      expect(parsed.ext).toBe('.txt');
    });

    test('여러 점이 포함된 파일명', () => {
      const multiDotPath = '/home/user/file.with.many.dots.txt';
      const parsed = pathUtil.parse(multiDotPath);
      expect(parsed.name).toBe('file.with.many.dots');
      expect(parsed.ext).toBe('.txt');
    });
  });

  describe('성능 테스트', () => {
    test('대량 경로 처리 성능', () => {
      const iterations = 1000;
      const paths = [
        '/foo/bar/baz',
        '../foo/bar',
        './foo/../bar',
        '/foo/./bar/../baz'
      ];
      
      const start = performance.now();
      for (let i = 0; i < iterations; i++) {
        const path = paths[i % paths.length];
        pathUtil.normalize(path);
        pathUtil.isAbsolute(path);
        pathUtil.parse(path);
      }
      const end = performance.now();
      
      // 1000번 연산이 100ms 이내에 완료되어야 함
      expect(end - start).toBeLessThan(100);
    });
  });
});