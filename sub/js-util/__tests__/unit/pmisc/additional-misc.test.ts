import { describe, test, expect, vi } from 'vitest';
import { Closables, pathUtil } from '../../../src/pmisc/index.js';

describe('pmisc - Additional Functions', () => {
  describe('Closables', () => {
    test('기본 인스턴스 생성', () => {
      const closables = new Closables();
      expect(closables.count).toBe(0);
    });

    test('함수 추가와 실행', () => {
      const closables = new Closables();
      const mockFn1 = vi.fn();
      const mockFn2 = vi.fn();

      closables.add(mockFn1, mockFn2);
      expect(closables.count).toBe(2);

      closables.close();
      expect(mockFn1).toHaveBeenCalledOnce();
      expect(mockFn2).toHaveBeenCalledOnce();
      expect(closables.count).toBe(0);
    });

    test('함수 제거', () => {
      const closables = new Closables();
      const mockFn1 = vi.fn();
      const mockFn2 = vi.fn();

      closables.add(mockFn1, mockFn2);
      expect(closables.count).toBe(2);

      closables.remove(mockFn1);
      expect(closables.count).toBe(1);

      closables.close();
      expect(mockFn1).not.toHaveBeenCalled();
      expect(mockFn2).toHaveBeenCalledOnce();
    });

    test('RxJS 구독 추가 (addRx)', () => {
      const closables = new Closables();
      const mockSubscription = { unsubscribe: vi.fn() };

      closables.addRx(mockSubscription);
      expect(closables.count).toBe(1);

      closables.close();
      expect(mockSubscription.unsubscribe).toHaveBeenCalledOnce();
    });

    test('addUnsubscribe는 addRx와 동일', () => {
      const closables = new Closables();
      const mockSubscription = { unsubscribe: vi.fn() };

      closables.addUnsubscribe(mockSubscription);
      expect(closables.count).toBe(1);

      closables.close();
      expect(mockSubscription.unsubscribe).toHaveBeenCalledOnce();
    });

    test('close 메서드를 가진 객체 추가', () => {
      const closables = new Closables();
      const mockClosable = { close: vi.fn() };

      closables.addClose(mockClosable);
      expect(closables.count).toBe(1);

      closables.close();
      expect(mockClosable.close).toHaveBeenCalledOnce();
    });

    test('dispose 메서드를 가진 객체 추가', () => {
      const closables = new Closables();
      const mockDisposable = { dispose: vi.fn() };

      closables.addDispose(mockDisposable);
      expect(closables.count).toBe(1);

      closables.close();
      expect(mockDisposable.dispose).toHaveBeenCalledOnce();
    });

    test('destroy 메서드를 가진 객체 추가', () => {
      const closables = new Closables();
      const mockDestroyable = { destroy: vi.fn() };

      closables.addDestroy(mockDestroyable);
      expect(closables.count).toBe(1);

      closables.close();
      expect(mockDestroyable.destroy).toHaveBeenCalledOnce();
    });

    test('shutdown 메서드를 가진 객체 추가', () => {
      const closables = new Closables();
      const mockShutdownable = { shutdown: vi.fn() };

      closables.addShutdown(mockShutdownable);
      expect(closables.count).toBe(1);

      closables.close();
      expect(mockShutdownable.shutdown).toHaveBeenCalledOnce();
    });

    test('terminate 메서드를 가진 객체 추가', () => {
      const closables = new Closables();
      const mockTerminable = { terminate: vi.fn() };

      closables.addTerminate(mockTerminable);
      expect(closables.count).toBe(1);

      closables.close();
      expect(mockTerminable.terminate).toHaveBeenCalledOnce();
    });

    test.skipIf(typeof document === 'undefined')('DOM 이벤트 리스너 추가', () => {
      const closables = new Closables();
      const mockElement = document.createElement('div');
      const mockListener = vi.fn();

      // Element 이벤트 리스너 추가
      closables.addElementListener(mockElement, 'click', mockListener);
      expect(closables.count).toBe(1);

      // 이벤트 발생 시뮬레이션
      mockElement.click();
      expect(mockListener).toHaveBeenCalledOnce();

      // cleanup
      closables.close();
      expect(closables.count).toBe(0);

      // cleanup 후에는 이벤트가 호출되지 않아야 함
      mockElement.click();
      expect(mockListener).toHaveBeenCalledOnce(); // 여전히 한 번만
    });

    test.skipIf(typeof document === 'undefined')('Document 이벤트 리스너 추가', () => {
      const closables = new Closables();
      const mockListener = vi.fn();

      closables.addDocumentListener('click', mockListener);
      expect(closables.count).toBe(1);

      // cleanup
      closables.close();
      expect(closables.count).toBe(0);
    });

    test.skipIf(typeof window === 'undefined')('Window 이벤트 리스너 추가', () => {
      const closables = new Closables();
      const mockListener = vi.fn();

      closables.addWindowListener('resize', mockListener);
      expect(closables.count).toBe(1);

      // cleanup
      closables.close();
      expect(closables.count).toBe(0);
    });

    test('여러 번 close 호출해도 안전', () => {
      const closables = new Closables();
      const mockFn = vi.fn();

      closables.add(mockFn);
      closables.close();
      closables.close(); // 두 번째 호출

      expect(mockFn).toHaveBeenCalledOnce();
      expect(closables.count).toBe(0);
    });

    test('정적 메서드 - create', () => {
      const mockFn1 = vi.fn();
      const mockFn2 = vi.fn();

      const closables = Closables.create(mockFn1, mockFn2);
      expect(closables.count).toBe(2);

      closables.close();
      expect(mockFn1).toHaveBeenCalledOnce();
      expect(mockFn2).toHaveBeenCalledOnce();
    });

    test.skipIf(typeof window === 'undefined')('정적 메서드 - createWindowListener', () => {
      const mockListener = vi.fn();

      const closables = Closables.createWindowListener('resize', mockListener);
      expect(closables.count).toBe(1);

      closables.close();
      expect(closables.count).toBe(0);
    });

    test.skipIf(typeof document === 'undefined')('정적 메서드 - createDocumentListener', () => {
      const mockListener = vi.fn();

      const closables = Closables.createDocumentListener('click', mockListener);
      expect(closables.count).toBe(1);

      closables.close();
      expect(closables.count).toBe(0);
    });

    test.skipIf(typeof document === 'undefined')('정적 메서드 - createElementListener', () => {
      const mockElement = document.createElement('div');
      const mockListener = vi.fn();

      const closables = Closables.createElementListener(mockElement, 'click', mockListener);
      expect(closables.count).toBe(1);

      closables.close();
      expect(closables.count).toBe(0);
    });

    test('정적 메서드 - createRx', () => {
      const mockSubscription = { unsubscribe: vi.fn() };

      const closables = Closables.createRx(mockSubscription);
      expect(closables.count).toBe(1);

      closables.close();
      expect(mockSubscription.unsubscribe).toHaveBeenCalledOnce();
    });

    test('정적 메서드 - createClose', () => {
      const mockClosable = { close: vi.fn() };

      const closables = Closables.createClose(mockClosable);
      expect(closables.count).toBe(1);

      closables.close();
      expect(mockClosable.close).toHaveBeenCalledOnce();
    });

    test('정적 메서드 - createTerminate', () => {
      const mockTerminable = { terminate: vi.fn() };

      const closables = Closables.createTerminate(mockTerminable);
      expect(closables.count).toBe(1);

      closables.close();
      expect(mockTerminable.terminate).toHaveBeenCalledOnce();
    });

    test('정적 메서드 - createShutdown', () => {
      const mockShutdownable = { shutdown: vi.fn() };

      const closables = Closables.createShutdown(mockShutdownable);
      expect(closables.count).toBe(1);

      closables.close();
      expect(mockShutdownable.shutdown).toHaveBeenCalledOnce();
    });

    test('정적 메서드 - createDestroy', () => {
      const mockDestroyable = { destroy: vi.fn() };

      const closables = Closables.createDestroy(mockDestroyable);
      expect(closables.count).toBe(1);

      closables.close();
      expect(mockDestroyable.destroy).toHaveBeenCalledOnce();
    });

    test('정적 메서드 - createDispose', () => {
      const mockDisposable = { dispose: vi.fn() };

      const closables = Closables.createDispose(mockDisposable);
      expect(closables.count).toBe(1);

      closables.close();
      expect(mockDisposable.dispose).toHaveBeenCalledOnce();
    });

    test('메서드 체이닝', () => {
      const closables = new Closables();
      const mockFn = vi.fn();
      const mockSubscription = { unsubscribe: vi.fn() };
      const mockClosable = { close: vi.fn() };

      const result = closables.add(mockFn).addRx(mockSubscription).addClose(mockClosable);

      expect(result).toBe(closables); // 체이닝 확인
      expect(closables.count).toBe(3);

      closables.close();
      expect(mockFn).toHaveBeenCalledOnce();
      expect(mockSubscription.unsubscribe).toHaveBeenCalledOnce();
      expect(mockClosable.close).toHaveBeenCalledOnce();
    });

    test('다양한 타입의 closable 혼합 사용', () => {
      const closables = new Closables();
      const mockFn = vi.fn();
      const mockRx = { unsubscribe: vi.fn() };
      const mockClosable = { close: vi.fn() };
      const mockDisposable = { dispose: vi.fn() };
      const mockDestroyable = { destroy: vi.fn() };

      closables
        .add(mockFn)
        .addRx(mockRx)
        .addClose(mockClosable)
        .addDispose(mockDisposable)
        .addDestroy(mockDestroyable);

      expect(closables.count).toBe(5);

      closables.close();

      expect(mockFn).toHaveBeenCalledOnce();
      expect(mockRx.unsubscribe).toHaveBeenCalledOnce();
      expect(mockClosable.close).toHaveBeenCalledOnce();
      expect(mockDisposable.dispose).toHaveBeenCalledOnce();
      expect(mockDestroyable.destroy).toHaveBeenCalledOnce();
    });
  });

  describe('pathUtil', () => {
    describe('normalize', () => {
      test('단순 경로 정규화', () => {
        expect(pathUtil.normalize('.')).toBe('.');
        expect(pathUtil.normalize('')).toBe('.');
        expect(pathUtil.normalize('/foo/bar')).toBe('/foo/bar');
        expect(pathUtil.normalize('foo/bar')).toBe('foo/bar');
      });

      test('. 과 .. 처리', () => {
        expect(pathUtil.normalize('/foo/./bar')).toBe('/foo/bar');
        expect(pathUtil.normalize('/foo/../bar')).toBe('/bar');
        expect(pathUtil.normalize('./foo/bar')).toBe('foo/bar');
        expect(pathUtil.normalize('../foo/bar')).toBe('../foo/bar');
      });

      test('여러 슬래시 제거', () => {
        expect(pathUtil.normalize('/foo//bar')).toBe('/foo/bar');
        expect(pathUtil.normalize('/foo///bar')).toBe('/foo/bar');
        expect(pathUtil.normalize('foo//bar')).toBe('foo/bar');
      });

      test('끝의 슬래시 처리', () => {
        expect(pathUtil.normalize('/foo/bar/')).toBe('/foo/bar/');
        expect(pathUtil.normalize('foo/bar/')).toBe('foo/bar/');
        expect(pathUtil.normalize('/foo/bar/.')).toBe('/foo/bar'); // . 이 제거되어 trailing slash도 사라짐
        expect(pathUtil.normalize('foo/bar/.')).toBe('foo/bar');
      });

      test('복잡한 . 과 .. 조합', () => {
        expect(pathUtil.normalize('/foo/bar/../baz')).toBe('/foo/baz');
        expect(pathUtil.normalize('/foo/bar/./baz')).toBe('/foo/bar/baz');
        expect(pathUtil.normalize('/foo/bar/../..')).toBe('/');
        expect(pathUtil.normalize('foo/bar/../..')).toBe('.');
      });

      test('절대 경로의 .. 처리', () => {
        expect(pathUtil.normalize('/..')).toBe('/');
        expect(pathUtil.normalize('/../..')).toBe('/');
        expect(pathUtil.normalize('/../foo')).toBe('/foo');
      });

      test('잘못된 입력 처리', () => {
        expect(() => pathUtil.normalize(null as any)).toThrow(TypeError);
        expect(() => pathUtil.normalize(undefined as any)).toThrow(TypeError);
        expect(() => pathUtil.normalize(123 as any)).toThrow(TypeError);
      });
    });

    describe('isAbsolute', () => {
      test('절대 경로 판별', () => {
        expect(pathUtil.isAbsolute('/foo/bar')).toBe(true);
        expect(pathUtil.isAbsolute('/foo')).toBe(true);
        expect(pathUtil.isAbsolute('/')).toBe(true);
      });

      test('상대 경로 판별', () => {
        expect(pathUtil.isAbsolute('foo/bar')).toBe(false);
        expect(pathUtil.isAbsolute('./foo')).toBe(false);
        expect(pathUtil.isAbsolute('../foo')).toBe(false);
        expect(pathUtil.isAbsolute('.')).toBe(false);
        expect(pathUtil.isAbsolute('..')).toBe(false);
        expect(pathUtil.isAbsolute('')).toBe(false);
      });

      test('잘못된 입력 처리', () => {
        expect(() => pathUtil.isAbsolute(null as any)).toThrow(TypeError);
        expect(() => pathUtil.isAbsolute(undefined as any)).toThrow(TypeError);
        expect(() => pathUtil.isAbsolute(123 as any)).toThrow(TypeError);
      });
    });

    describe('join', () => {
      test('기본 경로 결합', () => {
        expect(pathUtil.join('foo', 'bar')).toBe('foo/bar');
        expect(pathUtil.join('/foo', 'bar')).toBe('/foo/bar');
        expect(pathUtil.join('foo', '/bar')).toBe('foo/bar');
        expect(pathUtil.join('/foo', '/bar')).toBe('/foo/bar');
      });

      test('빈 인수 처리', () => {
        expect(pathUtil.join()).toBe('.');
        expect(pathUtil.join('')).toBe('.');
        expect(pathUtil.join('', 'foo')).toBe('foo');
        expect(pathUtil.join('foo', '')).toBe('foo');
        expect(pathUtil.join('', '', '')).toBe('.');
      });

      test('여러 경로 결합', () => {
        expect(pathUtil.join('foo', 'bar', 'baz')).toBe('foo/bar/baz');
        expect(pathUtil.join('/foo', 'bar', 'baz')).toBe('/foo/bar/baz');
        expect(pathUtil.join('foo', '../bar')).toBe('bar');
        expect(pathUtil.join('foo', './bar')).toBe('foo/bar');
      });

      test('절대 경로와 상대 경로 혼합', () => {
        expect(pathUtil.join('/foo', '../bar')).toBe('/bar');
        expect(pathUtil.join('/foo', './bar')).toBe('/foo/bar');
        expect(pathUtil.join('foo', '/bar')).toBe('foo/bar');
      });

      test('정규화 동작', () => {
        expect(pathUtil.join('foo//bar', 'baz')).toBe('foo/bar/baz');
        expect(pathUtil.join('foo/.', 'bar')).toBe('foo/bar');
        expect(pathUtil.join('foo/..', 'bar')).toBe('bar');
      });

      test('잘못된 입력 처리', () => {
        expect(() => pathUtil.join('foo', null as any)).toThrow(TypeError);
        expect(() => pathUtil.join('foo', undefined as any)).toThrow(TypeError);
        expect(() => pathUtil.join('foo', 123 as any)).toThrow(TypeError);
      });
    });

    describe('parse', () => {
      test('기본 경로 파싱', () => {
        const parsed = pathUtil.parse('/foo/bar/baz.txt');
        expect(parsed.root).toBe('/');
        expect(parsed.dir).toBe('/foo/bar');
        expect(parsed.base).toBe('baz.txt');
        expect(parsed.ext).toBe('.txt');
        expect(parsed.name).toBe('baz');
      });

      test('상대 경로 파싱', () => {
        const parsed = pathUtil.parse('foo/bar/baz.txt');
        expect(parsed.root).toBe('');
        expect(parsed.dir).toBe('foo/bar');
        expect(parsed.base).toBe('baz.txt');
        expect(parsed.ext).toBe('.txt');
        expect(parsed.name).toBe('baz');
      });

      test('확장자가 없는 파일', () => {
        const parsed = pathUtil.parse('/foo/bar/baz');
        expect(parsed.root).toBe('/');
        expect(parsed.dir).toBe('/foo/bar');
        expect(parsed.base).toBe('baz');
        expect(parsed.ext).toBe('');
        expect(parsed.name).toBe('baz');
      });

      test('점으로 시작하는 파일', () => {
        const parsed = pathUtil.parse('/foo/.bashrc');
        expect(parsed.root).toBe('/');
        expect(parsed.dir).toBe('/foo');
        expect(parsed.base).toBe('.bashrc');
        expect(parsed.ext).toBe('');
        expect(parsed.name).toBe('.bashrc');
      });

      test('디렉토리만 있는 경우', () => {
        const parsed = pathUtil.parse('/foo/bar/');
        expect(parsed.root).toBe('/');
        expect(parsed.dir).toBe('/foo');
        expect(parsed.base).toBe('bar');
        expect(parsed.ext).toBe('');
        expect(parsed.name).toBe('bar');
      });

      test('루트 경로', () => {
        const parsed = pathUtil.parse('/');
        expect(parsed.root).toBe('/');
        expect(parsed.dir).toBe('/');
        expect(parsed.base).toBe('');
        expect(parsed.ext).toBe('');
        expect(parsed.name).toBe('');
      });

      test('빈 문자열', () => {
        const parsed = pathUtil.parse('');
        expect(parsed.root).toBe('');
        expect(parsed.dir).toBe('');
        expect(parsed.base).toBe('');
        expect(parsed.ext).toBe('');
        expect(parsed.name).toBe('');
      });

      test('복잡한 확장자', () => {
        const parsed = pathUtil.parse('/foo/bar.min.js');
        expect(parsed.root).toBe('/');
        expect(parsed.dir).toBe('/foo');
        expect(parsed.base).toBe('bar.min.js');
        expect(parsed.ext).toBe('.js');
        expect(parsed.name).toBe('bar.min');
      });

      test('현재/상위 디렉토리', () => {
        const parsedCurrent = pathUtil.parse('./foo');
        expect(parsedCurrent.dir).toBe('.');
        expect(parsedCurrent.base).toBe('foo');

        const parsedParent = pathUtil.parse('../foo');
        expect(parsedParent.dir).toBe('..');
        expect(parsedParent.base).toBe('foo');
      });

      test('잘못된 입력 처리', () => {
        expect(() => pathUtil.parse(null as any)).toThrow(TypeError);
        expect(() => pathUtil.parse(undefined as any)).toThrow(TypeError);
        expect(() => pathUtil.parse(123 as any)).toThrow(TypeError);
      });
    });

    test('pathUtil 객체 구조', () => {
      expect(typeof pathUtil.normalize).toBe('function');
      expect(typeof pathUtil.isAbsolute).toBe('function');
      expect(typeof pathUtil.join).toBe('function');
      expect(typeof pathUtil.parse).toBe('function');
    });
  });
});
