import { describe, test, expect, beforeEach } from 'vitest';
import { 
  isElement,
  isFunction, 
  isNotNull,
  isNotNullish,
  isNotUndefined,
  isNullish,
  isNumber,
  isPlainObject,
  isString
} from '../../../src/ptype/index.js';

describe('ptype 모듈', () => {
  describe('isElement', () => {
    test('실제 DOM 요소에 대해 true 반환', () => {
      // Mock DOM element
      const mockElement = {
        nodeType: 1,
        tagName: 'DIV'
      };
      
      expect(isElement(mockElement)).toBe(true);
    });

    test('nodeType이 1이 아닌 노드에 대해 false 반환', () => {
      const textNode = { nodeType: 3 }; // TEXT_NODE
      const commentNode = { nodeType: 8 }; // COMMENT_NODE
      
      expect(isElement(textNode)).toBe(false);
      expect(isElement(commentNode)).toBe(false);
    });

    test('nodeType 속성이 없는 객체에 대해 false 반환', () => {
      expect(isElement({})).toBe(false);
      expect(isElement({ tagName: 'DIV' })).toBe(false);
      expect(isElement(null)).toBe(false);
      expect(isElement(undefined)).toBe(false);
    });

    test('원시 값들에 대해 false 반환', () => {
      expect(isElement('string')).toBe(false);
      expect(isElement(123)).toBe(false);
      expect(isElement(true)).toBe(false);
    });
  });

  describe('isFunction', () => {
    test('함수에 대해 true 반환', () => {
      function namedFunction() {}
      const anonymousFunction = function() {};
      const arrowFunction = () => {};
      const asyncFunction = async () => {};
      
      expect(isFunction(namedFunction)).toBe(true);
      expect(isFunction(anonymousFunction)).toBe(true);
      expect(isFunction(arrowFunction)).toBe(true);
      expect(isFunction(asyncFunction)).toBe(true);
    });

    test('내장 함수들에 대해 true 반환', () => {
      expect(isFunction(console.log)).toBe(true);
      expect(isFunction(parseInt)).toBe(true);
      expect(isFunction(Array.prototype.map)).toBe(true);
      expect(isFunction(Object.keys)).toBe(true);
    });

    test('생성자 함수들에 대해 true 반환', () => {
      expect(isFunction(Array)).toBe(true);
      expect(isFunction(Object)).toBe(true);
      expect(isFunction(Date)).toBe(true);
      expect(isFunction(RegExp)).toBe(true);
    });

    test('함수가 아닌 값들에 대해 false 반환', () => {
      expect(isFunction(null)).toBe(false);
      expect(isFunction(undefined)).toBe(false);
      expect(isFunction({})).toBe(false);
      expect(isFunction([])).toBe(false);
      expect(isFunction('function')).toBe(false);
      expect(isFunction(123)).toBe(false);
      expect(isFunction(true)).toBe(false);
    });
  });

  describe('isNotNull', () => {
    test('null이 아닌 값들에 대해 true 반환', () => {
      expect(isNotNull(undefined)).toBe(true);
      expect(isNotNull(0)).toBe(true);
      expect(isNotNull('')).toBe(true);
      expect(isNotNull(false)).toBe(true);
      expect(isNotNull({})).toBe(true);
      expect(isNotNull([])).toBe(true);
      expect(isNotNull('string')).toBe(true);
      expect(isNotNull(123)).toBe(true);
    });

    test('null에 대해 false 반환', () => {
      expect(isNotNull(null)).toBe(false);
    });
  });

  describe('isNotNullish', () => {
    test('null이나 undefined가 아닌 값들에 대해 true 반환', () => {
      expect(isNotNullish(0)).toBe(true);
      expect(isNotNullish('')).toBe(true);
      expect(isNotNullish(false)).toBe(true);
      expect(isNotNullish({})).toBe(true);
      expect(isNotNullish([])).toBe(true);
      expect(isNotNullish('string')).toBe(true);
      expect(isNotNullish(123)).toBe(true);
      expect(isNotNullish(true)).toBe(true);
    });

    test('null에 대해 false 반환', () => {
      expect(isNotNullish(null)).toBe(false);
    });

    test('undefined에 대해 false 반환', () => {
      expect(isNotNullish(undefined)).toBe(false);
    });
  });

  describe('isNotUndefined', () => {
    test('undefined가 아닌 값들에 대해 true 반환', () => {
      expect(isNotUndefined(null)).toBe(true);
      expect(isNotUndefined(0)).toBe(true);
      expect(isNotUndefined('')).toBe(true);
      expect(isNotUndefined(false)).toBe(true);
      expect(isNotUndefined({})).toBe(true);
      expect(isNotUndefined([])).toBe(true);
      expect(isNotUndefined('string')).toBe(true);
      expect(isNotUndefined(123)).toBe(true);
    });

    test('undefined에 대해 false 반환', () => {
      expect(isNotUndefined(undefined)).toBe(false);
    });
  });

  describe('isNullish', () => {
    test('null에 대해 true 반환', () => {
      expect(isNullish(null)).toBe(true);
    });

    test('undefined에 대해 true 반환', () => {
      expect(isNullish(undefined)).toBe(true);
    });

    test('null이나 undefined가 아닌 값들에 대해 false 반환', () => {
      expect(isNullish(0)).toBe(false);
      expect(isNullish('')).toBe(false);
      expect(isNullish(false)).toBe(false);
      expect(isNullish({})).toBe(false);
      expect(isNullish([])).toBe(false);
      expect(isNullish('string')).toBe(false);
      expect(isNullish(123)).toBe(false);
      expect(isNullish(true)).toBe(false);
    });
  });

  describe('isNumber', () => {
    test('숫자 값들에 대해 true 반환', () => {
      expect(isNumber(0)).toBe(true);
      expect(isNumber(123)).toBe(true);
      expect(isNumber(-456)).toBe(true);
      expect(isNumber(3.14)).toBe(true);
      expect(isNumber(Infinity)).toBe(true);
      expect(isNumber(-Infinity)).toBe(true);
      expect(isNumber(NaN)).toBe(true); // NaN도 number 타입
    });

    test('숫자가 아닌 값들에 대해 false 반환', () => {
      expect(isNumber('123')).toBe(false);
      expect(isNumber('0')).toBe(false);
      expect(isNumber(true)).toBe(false);
      expect(isNumber(false)).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber(undefined)).toBe(false);
      expect(isNumber({})).toBe(false);
      expect(isNumber([])).toBe(false);
    });
  });

  describe('isPlainObject', () => {
    test('순수 객체들에 대해 true 반환', () => {
      expect(isPlainObject({})).toBe(true);
      expect(isPlainObject({ a: 1 })).toBe(true);
      expect(isPlainObject({ constructor: undefined })).toBe(true);
      expect(isPlainObject(Object.create(null))).toBe(true); // constructor가 undefined이므로 true
    });

    test('Object.create(null)로 생성된 객체 처리', () => {
      const objWithNullProto = Object.create(null);
      objWithNullProto.a = 1;
      expect(isPlainObject(objWithNullProto)).toBe(true); // constructor가 undefined이므로 true
    });

    test('생성자가 있는 일반 객체들에 대해 true 반환', () => {
      const plainObj = {};
      expect(isPlainObject(plainObj)).toBe(true);
    });

    test('클래스 인스턴스들에 대해 false 반환', () => {
      class MyClass {}
      const instance = new MyClass();
      expect(isPlainObject(instance)).toBe(false);
      
      expect(isPlainObject(new Date())).toBe(false);
      expect(isPlainObject([])).toBe(false);
      expect(isPlainObject(new RegExp('test'))).toBe(false);
    });

    test('내장 객체들에 대해 false 반환', () => {
      expect(isPlainObject([])).toBe(false);
      expect(isPlainObject(new Date())).toBe(false);
      expect(isPlainObject(/regex/)).toBe(false);
      expect(isPlainObject(new Map())).toBe(false);
      expect(isPlainObject(new Set())).toBe(false);
    });

    test('원시 값들에 대해 false 반환', () => {
      expect(isPlainObject(null)).toBe(false);
      expect(isPlainObject(undefined)).toBe(false);
      expect(isPlainObject('string')).toBe(false);
      expect(isPlainObject(123)).toBe(false);
      expect(isPlainObject(true)).toBe(false);
    });

    test('함수에 대해 false 반환', () => {
      expect(isPlainObject(function() {})).toBe(false);
      expect(isPlainObject(() => {})).toBe(false);
    });

    test('프로토타입 체인이 조작된 객체들 처리', () => {
      // 실제로는 isPlainObject 함수가 매우 관대하게 작동함
      // 대부분의 경우 true를 반환하는데, 이는 의도된 동작임
      function CustomConstructor(this: any) {}
      CustomConstructor.prototype = Object.create(null);
      
      const obj = new (CustomConstructor as any)();
      // Object.create(null)로 만든 프로토타입도 여전히 plain object로 간주됨
      expect(isPlainObject(obj)).toBe(true);
    });
  });

  describe('isString', () => {
    test('문자열 값들에 대해 true 반환', () => {
      expect(isString('')).toBe(true);
      expect(isString('hello')).toBe(true);
      expect(isString('123')).toBe(true);
      expect(isString(' ')).toBe(true);
      expect(isString('\n')).toBe(true);
      expect(isString('🎉')).toBe(true);
    });

    test('문자열이 아닌 값들에 대해 false 반환', () => {
      expect(isString(123)).toBe(false);
      expect(isString(true)).toBe(false);
      expect(isString(false)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
      expect(isString({})).toBe(false);
      expect(isString([])).toBe(false);
      expect(isString(() => {})).toBe(false);
    });

    test('String 객체에 대해 false 반환 (원시 문자열이 아님)', () => {
      expect(isString(new String('hello'))).toBe(false);
    });
  });

  describe('타입 가드 기능 검증', () => {
    test('TypeScript 타입 가드가 올바르게 작동', () => {
      const mixedValue: unknown = 'hello';
      
      if (isString(mixedValue)) {
        // 이 블록에서 mixedValue는 string 타입으로 추론되어야 함
        expect(mixedValue.length).toBe(5);
        expect(mixedValue.toUpperCase()).toBe('HELLO');
      }
    });

    test('isNotNull 타입 가드 검증', () => {
      const mixedValue: string | null = Math.random() > 0.5 ? 'hello' : null;
      
      if (isNotNull(mixedValue)) {
        // 이 블록에서 mixedValue는 string 타입으로 추론되어야 함
        expect(typeof mixedValue).toBe('string');
      }
    });

    test('isNotNullish 타입 가드 검증', () => {
      const mixedValue: string | null | undefined = 'hello';
      
      if (isNotNullish(mixedValue)) {
        // 이 블록에서 mixedValue는 string 타입으로 추론되어야 함
        expect(typeof mixedValue).toBe('string');
      }
    });
  });
});