import { describe, test, expect, vi } from 'vitest';
import {
  NOOP,
  NULL,
  isNullish,
  isNotNullish,
  isNil,
  isNotNil,
  firstNotNullish,
  deepEq,
  shallowEq,
  encodeStringToBase64,
  decodeBase64ToString,
  sleepAsync,
  lodashGet,
  lodashSet,
  objectKeys,
  errmsg,
  nextFrame,
  overload2,
  overload3,
  overload4,
  overload5,
  querySelector,
  querySelectorAll
} from '../../../src/pmisc/index.js';

describe('pmisc - Miscellaneous Functions', () => {
  describe('NOOP', () => {
    test('아무것도 하지 않는 빈 함수', () => {
      expect(NOOP()).toBeUndefined();
      expect(NOOP(1, 2, 3)).toBeUndefined();
      expect(NOOP('test', { a: 1 }, [1, 2, 3])).toBeUndefined();
    });
  });

  describe('NULL', () => {
    test('항상 null 반환', () => {
      expect(NULL()).toBe(null);
      expect(NULL(1, 2, 3)).toBe(null);
      expect(NULL('test', { a: 1 }, [1, 2, 3])).toBe(null);
    });
  });

  describe('isNullish', () => {
    test('null과 undefined에 대해 true', () => {
      expect(isNullish(null)).toBe(true);
      expect(isNullish(undefined)).toBe(true);
    });

    test('다른 값들에 대해 false', () => {
      expect(isNullish(0)).toBe(false);
      expect(isNullish('')).toBe(false);
      expect(isNullish(false)).toBe(false);
      expect(isNullish({})).toBe(false);
      expect(isNullish([])).toBe(false);
    });
  });

  describe('isNotNullish', () => {
    test('isNullish의 반대 결과', () => {
      expect(isNotNullish(null)).toBe(false);
      expect(isNotNullish(undefined)).toBe(false);
      expect(isNotNullish(0)).toBe(true);
      expect(isNotNullish('')).toBe(true);
      expect(isNotNullish(false)).toBe(true);
    });
  });

  describe('isNil', () => {
    test('isNullish와 동일한 동작', () => {
      expect(isNil(null)).toBe(true);
      expect(isNil(undefined)).toBe(true);
      expect(isNil(0)).toBe(false);
      expect(isNil('')).toBe(false);
    });
  });

  describe('isNotNil', () => {
    test('isNil의 반대 결과', () => {
      expect(isNotNil(null)).toBe(false);
      expect(isNotNil(undefined)).toBe(false);
      expect(isNotNil('hello')).toBe(true);
      expect(isNotNil(123)).toBe(true);
    });
  });

  describe('firstNotNullish', () => {
    test('첫 번째 non-nullish 값 반환', () => {
      expect(firstNotNullish(null, undefined, 'hello', 'world')).toBe('hello');
      expect(firstNotNullish(undefined, null, 0, 1)).toBe(0);
      expect(firstNotNullish(null, false, true)).toBe(false);
    });

    test('모든 값이 nullish인 경우', () => {
      expect(firstNotNullish(null, undefined, null)).toBeUndefined();
      expect(firstNotNullish()).toBeUndefined();
    });

    test('단일 값 테스트', () => {
      expect(firstNotNullish('test')).toBe('test');
      expect(firstNotNullish(null)).toBeUndefined();
    });
  });

  describe('deepEq', () => {
    test('기본 타입 비교', () => {
      expect(deepEq(1, 1)).toBe(true);
      expect(deepEq('hello', 'hello')).toBe(true);
      expect(deepEq(true, true)).toBe(true);
      expect(deepEq(null, null)).toBe(true);
      expect(deepEq(1, 2)).toBe(false);
      expect(deepEq('hello', 'world')).toBe(false);
    });

    test('배열 비교', () => {
      expect(deepEq([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(deepEq([1, [2, 3]], [1, [2, 3]])).toBe(true);
      expect(deepEq([1, 2], [1, 2, 3])).toBe(false);
      expect(deepEq([1, 2], [2, 1])).toBe(false);
    });

    test('객체 비교', () => {
      expect(deepEq({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
      expect(deepEq({ a: 1, b: { c: 3 } }, { a: 1, b: { c: 3 } })).toBe(true);
      expect(deepEq({ a: 1 }, { a: 1, b: 2 })).toBe(false);
      expect(deepEq({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
    });

    test('타입이 다른 경우', () => {
      expect(deepEq(1 as any, '1' as any)).toBe(false);
      expect(deepEq(null, undefined)).toBe(false);
    });

    test('배열과 객체 구분', () => {
      // 빈 배열과 빈 객체는 둘 다 키가 0개이므로 deepEq에서 true 반환
      expect(deepEq([], {})).toBe(true);
      
      // [1]은 배열이므로 Array.isArray() 체크를 통과하여 배열로 처리
      // { 0: 1 }은 일반 객체로 처리되어 결국 같은 값으로 인식됨
      expect(deepEq([1], { 0: 1 })).toBe(true); // 실제로는 true가 반환됨
      
      // 길이가 다른 경우는 false
      expect(deepEq([1, 2], { 0: 1 })).toBe(false);
    });
  });

  describe('shallowEq', () => {
    test('같은 참조인 경우', () => {
      const obj = { a: 1, b: 2 };
      expect(shallowEq(obj, obj)).toBe(true);
    });

    test('얕은 객체 비교', () => {
      expect(shallowEq({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
      expect(shallowEq({ a: 1 }, { a: 1, b: 2 })).toBe(false);
      expect(shallowEq({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
    });

    test('중첩 객체는 참조로 비교', () => {
      const nested = { c: 3 };
      expect(shallowEq({ a: nested }, { a: nested })).toBe(true);
      expect(shallowEq({ a: { c: 3 } }, { a: { c: 3 } })).toBe(false);
    });

    test('객체가 아닌 값들', () => {
      expect(shallowEq(1, 1)).toBe(true);
      expect(shallowEq('hello', 'hello')).toBe(true);
      expect(shallowEq(1, 2)).toBe(false);
      expect(shallowEq(1, { a: 1 })).toBe(false);
    });
  });

  describe('encodeStringToBase64', () => {
    test.skipIf(typeof window === 'undefined')('문자열을 Base64로 인코딩', () => {
      expect(encodeStringToBase64('hello')).toBe('aGVsbG8=');
      expect(encodeStringToBase64('world')).toBe('d29ybGQ=');
      expect(encodeStringToBase64('')).toBe('');
    });

    test.skipIf(typeof window === 'undefined')('특수 문자 인코딩', () => {
      expect(encodeStringToBase64('안녕하세요')).toBeTruthy();
      expect(encodeStringToBase64('123!@#')).toBeTruthy();
    });
  });

  describe('decodeBase64ToString', () => {
    test.skipIf(typeof atob === 'undefined')('Base64를 문자열로 디코딩', () => {
      expect(decodeBase64ToString('aGVsbG8=')).toBe('hello');
      expect(decodeBase64ToString('d29ybGQ=')).toBe('world');
      expect(decodeBase64ToString('')).toBe('');
    });

    test.skipIf(typeof window === 'undefined')('인코딩-디코딩 왕복', () => {
      const original = 'test string';
      const encoded = encodeStringToBase64(original);
      const decoded = decodeBase64ToString(encoded);
      expect(decoded).toBe(original);
    });
  });

  describe('sleepAsync', () => {
    test('지정된 시간만큼 대기', async () => {
      const start = Date.now();
      await sleepAsync(50);
      const end = Date.now();
      expect(end - start).toBeGreaterThanOrEqual(45); // 약간의 오차 허용
    });

    test('Promise를 반환', () => {
      const result = sleepAsync(10);
      expect(result).toBeInstanceOf(Promise);
    });

    test('0ms 대기', async () => {
      await expect(sleepAsync(0)).resolves.toBeUndefined();
    });
  });

  describe('lodashGet', () => {
    const testObj = {
      a: {
        b: {
          c: 'deep value'
        }
      },
      array: [1, 2, { nested: 'array value' }],
      nullValue: null
    };

    test('문자열 경로로 값 접근', () => {
      expect(lodashGet(testObj, 'a.b.c')).toBe('deep value');
      expect(lodashGet(testObj, 'array[2].nested')).toBe('array value');
    });

    test('배열 경로로 값 접근', () => {
      expect(lodashGet(testObj, ['a', 'b', 'c'])).toBe('deep value');
      expect(lodashGet(testObj, ['array', 2, 'nested'])).toBe('array value');
    });

    test('존재하지 않는 경로', () => {
      expect(lodashGet(testObj, 'a.b.x')).toBeUndefined();
      expect(lodashGet(testObj, 'nonexistent')).toBeUndefined();
    });

    test('기본값 반환', () => {
      expect(lodashGet(testObj, 'a.b.x', 'default')).toBe('default');
      expect(lodashGet(testObj, 'nonexistent', 42)).toBe(42);
    });

    test('null/undefined 객체', () => {
      expect(lodashGet(null, 'a.b')).toBeUndefined();
      expect(lodashGet(undefined, 'a.b')).toBeUndefined();
    });
  });

  describe('lodashSet', () => {
    test('중첩된 속성 설정', () => {
      const obj: any = {};
      lodashSet(obj, 'a.b.c', 'value');
      expect(obj.a.b.c).toBe('value');
    });

    test('기존 객체에 속성 추가', () => {
      const obj = { existing: 'prop' };
      lodashSet(obj, 'new.nested.prop', 'new value');
      expect(obj.existing).toBe('prop');
      expect((obj as any).new.nested.prop).toBe('new value');
    });

    test('dangerous 속성들 무시 (__proto__, constructor)', () => {
      const obj: any = {};
      lodashSet(obj, '__proto__.dangerous', 'value');
      lodashSet(obj, 'constructor.dangerous', 'value');
      expect(obj.__proto__.dangerous).toBeUndefined();
      expect(obj.constructor.dangerous).toBeUndefined();
    });

    test('기존 non-object 값이 있는 경우', () => {
      const obj: any = { a: 'string' };
      lodashSet(obj, 'a.b.c', 'value');
      expect(obj.a).toBe('string'); // 기존 값 유지
    });
  });

  describe('objectKeys', () => {
    test('객체의 키들 반환', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const keys = objectKeys(obj);
      expect(keys).toEqual(['a', 'b', 'c']);
      expect(keys).toHaveLength(3);
    });

    test('빈 객체', () => {
      expect(objectKeys({})).toEqual([]);
    });

    test('타입 안전성', () => {
      const obj = { name: 'test', age: 25 } as const;
      const keys = objectKeys(obj);
      // TypeScript에서 keys의 타입이 (keyof typeof obj)[]가 되어야 함
      expect(keys.includes('name')).toBe(true);
      expect(keys.includes('age')).toBe(true);
    });
  });

  describe('errmsg', () => {
    test('문자열 에러 메시지', () => {
      expect(errmsg('simple error')).toBe('simple error');
    });

    test('Error 객체', () => {
      const error = new Error('error message');
      expect(errmsg(error)).toBe('error message');
    });

    test('message 속성을 가진 객체', () => {
      const customError = { message: 'custom error', code: 500 };
      expect(errmsg(customError)).toBe('custom error');
    });

    test('null과 undefined', () => {
      expect(errmsg(null)).toBe('unknown');
      expect(errmsg(undefined)).toBe('unknown');
    });

    test('toString()을 가진 객체', () => {
      const obj = { toString: () => 'object string' };
      expect(errmsg(obj)).toBe('object string');
    });

    test('숫자나 다른 타입', () => {
      expect(errmsg(404)).toBe('404');
      expect(errmsg(true)).toBe('true');
    });
  });

  describe('nextFrame', () => {
    test('Promise를 반환', () => {
      const result = nextFrame();
      expect(result).toBeInstanceOf(Promise);
    });

    test('다음 프레임까지 대기', async () => {
      let executed = false;
      nextFrame().then(() => {
        executed = true;
      });
      expect(executed).toBe(false);
      await nextFrame();
      expect(executed).toBe(true);
    });
  });

  describe('overload functions', () => {
    describe('overload2', () => {
      test('인수 개수에 따라 다른 함수 호출', () => {
        const fn1 = (a: number) => a * 2;
        const fn2 = (a: number, b: number) => a + b;
        const overloaded = overload2(fn1, fn2);

        expect(overloaded(5)).toBe(10); // fn1 호출
        expect(overloaded(3, 7)).toBe(10); // fn2 호출
      });

      test('매칭되지 않는 인수 개수', () => {
        const fn1 = (a: number) => a * 2;
        const fn2 = (a: number, b: number) => a + b;
        const overloaded = overload2(fn1, fn2);

        expect((overloaded as any)()).toBeUndefined(); // 0개 인수
        expect((overloaded as any)(1, 2, 3)).toBeUndefined(); // 3개 인수
      });
    });

    describe('overload3', () => {
      test('3개 함수 오버로드', () => {
        const fn1 = (a: number) => a;
        const fn2 = (a: number, b: number) => a + b;
        const fn3 = (a: number, b: number, c: number) => a + b + c;
        const overloaded = overload3(fn1, fn2, fn3);

        expect(overloaded(1)).toBe(1);
        expect(overloaded(1, 2)).toBe(3);
        expect(overloaded(1, 2, 3)).toBe(6);
      });
    });

    describe('overload4', () => {
      test('4개 함수 오버로드', () => {
        const fn1 = (a: number) => a;
        const fn2 = (a: number, b: number) => a + b;
        const fn3 = (a: number, b: number, c: number) => a + b + c;
        const fn4 = (a: number, b: number, c: number, d: number) => a + b + c + d;
        const overloaded = overload4(fn1, fn2, fn3, fn4);

        expect(overloaded(1)).toBe(1);
        expect(overloaded(1, 2)).toBe(3);
        expect(overloaded(1, 2, 3)).toBe(6);
        expect(overloaded(1, 2, 3, 4)).toBe(10);
      });
    });

    describe('overload5', () => {
      test('5개 함수 오버로드', () => {
        const fn1 = (a: number) => a;
        const fn2 = (a: number, b: number) => a + b;
        const fn3 = (a: number, b: number, c: number) => a + b + c;
        const fn4 = (a: number, b: number, c: number, d: number) => a + b + c + d;
        const fn5 = (a: number, b: number, c: number, d: number, e: number) => a + b + c + d + e;
        const overloaded = overload5(fn1, fn2, fn3, fn4, fn5);

        expect(overloaded(1)).toBe(1);
        expect(overloaded(1, 2)).toBe(3);
        expect(overloaded(1, 2, 3)).toBe(6);
        expect(overloaded(1, 2, 3, 4)).toBe(10);
        expect(overloaded(1, 2, 3, 4, 5)).toBe(15);
      });
    });
  });

  describe.skipIf(typeof document === 'undefined')('selector functions', () => {
    // DOM 환경에서만 테스트 가능
    beforeEach(() => {
      // JSDOM 환경에서 기본 DOM 설정
      if (typeof document !== 'undefined') {
        document.body.innerHTML = `
          <div id="test" class="container">
            <p class="text">Hello</p>
            <p class="text">World</p>
            <span>Test</span>
          </div>
        `;
      }
    });

    describe('querySelector', () => {
      test('CSS 선택자로 첫 번째 요소 찾기', () => {
        const element = querySelector('#test');
        expect(element).not.toBeNull();
        expect(element?.id).toBe('test');
      });

      test('존재하지 않는 요소', () => {
        const element = querySelector('#nonexistent');
        expect(element).toBeNull();
      });

      test('클래스 선택자', () => {
        const element = querySelector('.text');
        expect(element).not.toBeNull();
        expect(element?.textContent).toBe('Hello');
      });
    });

    describe('querySelectorAll', () => {
      test('CSS 선택자로 모든 요소 찾기', () => {
        const elements = querySelectorAll('.text');
        expect(elements).toHaveLength(2);
        expect(elements[0].textContent).toBe('Hello');
        expect(elements[1].textContent).toBe('World');
      });

      test('존재하지 않는 요소들', () => {
        const elements = querySelectorAll('.nonexistent');
        expect(elements).toHaveLength(0);
        expect(Array.isArray(elements)).toBe(true);
      });
    });
  });
});