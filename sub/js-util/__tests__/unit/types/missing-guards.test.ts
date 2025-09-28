import { describe, test, expect } from 'vitest';
import { isError } from '../../../src/types/guards/isError.js';
import { isElement } from '../../../src/types/guards/isElement.js';
import { isFunction } from '../../../src/types/guards/isFunction.js';
import { isGenerator } from '../../../src/types/guards/isGenerator.js';
import { isGeneratorFunction } from '../../../src/types/guards/isGeneratorFunction.js';
import { isIterable } from '../../../src/types/guards/isIterable.js';
import { isIterator } from '../../../src/types/guards/isIterator.js';
import { isMap } from '../../../src/types/guards/isMap.js';
import { isNotNil } from '../../../src/types/guards/isNotNil.js';
import { isNotNull } from '../../../src/types/guards/isNotNull.js';
import { isPlainObject } from '../../../src/types/guards/isPlainObject.js';
import { isPromise } from '../../../src/types/guards/isPromise.js';
import { isRecord } from '../../../src/types/guards/isRecord.js';
import { isSet } from '../../../src/types/guards/isSet.js';
import { isTypedArray } from '../../../src/types/guards/isTypedArray.js';
import { isWeakMap } from '../../../src/types/guards/isWeakMap.js';
import { isWeakSet } from '../../../src/types/guards/isWeakSet.js';

describe('types - Missing Type Guards', () => {
  describe('isError', () => {
    test('should return true for Error objects', () => {
      expect(isError(new Error('test'))).toBe(true);
      expect(isError(new TypeError('test'))).toBe(true);
      expect(isError(new ReferenceError('test'))).toBe(true);
    });

    test('should return false for non-Error objects', () => {
      expect(isError(null)).toBe(false);
      expect(isError(undefined)).toBe(false);
      expect(isError({})).toBe(false);
      expect(isError('error')).toBe(false);
      expect(isError(123)).toBe(false);
    });
  });

  describe('isElement', () => {
    test('should return true for DOM elements', () => {
      const div = document.createElement('div');
      expect(isElement(div)).toBe(true);
      
      const span = document.createElement('span');
      expect(isElement(span)).toBe(true);
    });

    test('should return false for non-elements', () => {
      expect(isElement(null)).toBe(false);
      expect(isElement(undefined)).toBe(false);
      expect(isElement({})).toBe(false);
      expect(isElement('div')).toBe(false);
      expect(isElement(document.createTextNode('text'))).toBe(false);
    });
  });

  describe('isFunction', () => {
    test('should return true for regular functions', () => {
      expect(isFunction(function() {})).toBe(true);
      expect(isFunction(() => {})).toBe(true);
      expect(isFunction(Array.isArray)).toBe(true);
    });

    test('should return false for non-functions', () => {
      expect(isFunction(null)).toBe(false);
      expect(isFunction(undefined)).toBe(false);
      expect(isFunction({})).toBe(false);
      expect(isFunction('function')).toBe(false);
      expect(isFunction(123)).toBe(false);
    });
  });

  describe('isGenerator', () => {
    test('should return true for generator objects', () => {
      function* genFn() { yield 1; }
      const gen = genFn();
      expect(isGenerator(gen)).toBe(true);
    });

    test('should return false for non-generators', () => {
      expect(isGenerator(null)).toBe(false);
      expect(isGenerator(undefined)).toBe(false);
      expect(isGenerator({})).toBe(false);
      expect(isGenerator(function* () {})).toBe(false); // generator function, not generator
    });
  });

  describe('isGeneratorFunction', () => {
    test('should return true for generator functions', () => {
      function* genFn() { yield 1; }
      expect(isGeneratorFunction(genFn)).toBe(true);
    });

    test('should return false for non-generator functions', () => {
      expect(isGeneratorFunction(null)).toBe(false);
      expect(isGeneratorFunction(undefined)).toBe(false);
      expect(isGeneratorFunction({})).toBe(false);
      expect(isGeneratorFunction(function() {})).toBe(false);
      expect(isGeneratorFunction(() => {})).toBe(false);
    });
  });

  describe('isIterable', () => {
    test('should return true for iterable objects', () => {
      expect(isIterable([])).toBe(true);
      expect(isIterable('string')).toBe(true);
      expect(isIterable(new Set())).toBe(true);
      expect(isIterable(new Map())).toBe(true);
    });

    test('should return false for non-iterable objects', () => {
      expect(isIterable(null)).toBe(false);
      expect(isIterable(undefined)).toBe(false);
      expect(isIterable({})).toBe(false);
      expect(isIterable(123)).toBe(false);
    });
  });

  describe('isIterator', () => {
    test('should return true for iterator objects', () => {
      const arr = [1, 2, 3];
      const iterator = arr[Symbol.iterator]();
      expect(isIterator(iterator)).toBe(true);
    });

    test('should return false for non-iterator objects', () => {
      expect(isIterator(null)).toBe(false);
      expect(isIterator(undefined)).toBe(false);
      expect(isIterator({})).toBe(false);
      expect(isIterator([])).toBe(false); // array is iterable, not iterator
    });
  });

  describe('isMap', () => {
    test('should return true for Map objects', () => {
      expect(isMap(new Map())).toBe(true);
      const map = new Map();
      map.set('key', 'value');
      expect(isMap(map)).toBe(true);
    });

    test('should return false for non-Map objects', () => {
      expect(isMap(null)).toBe(false);
      expect(isMap(undefined)).toBe(false);
      expect(isMap({})).toBe(false);
      expect(isMap([])).toBe(false);
      expect(isMap(new Set())).toBe(false);
    });
  });

  describe('isNotNil', () => {
    test('should return true for non-null/undefined values', () => {
      expect(isNotNil(0)).toBe(true);
      expect(isNotNil('')).toBe(true);
      expect(isNotNil(false)).toBe(true);
      expect(isNotNil({})).toBe(true);
      expect(isNotNil([])).toBe(true);
    });

    test('should return false for null/undefined', () => {
      expect(isNotNil(null)).toBe(false);
      expect(isNotNil(undefined)).toBe(false);
    });
  });

  describe('isNotNull', () => {
    test('should return true for non-null values', () => {
      expect(isNotNull(undefined)).toBe(true);
      expect(isNotNull(0)).toBe(true);
      expect(isNotNull('')).toBe(true);
      expect(isNotNull({})).toBe(true);
    });

    test('should return false for null', () => {
      expect(isNotNull(null)).toBe(false);
    });
  });

  describe('isPlainObject', () => {
    test('should return true for plain objects', () => {
      expect(isPlainObject({})).toBe(true);
      expect(isPlainObject({ a: 1 })).toBe(true);
      expect(isPlainObject(Object.create(null))).toBe(true);
    });

    test('should return false for non-plain objects', () => {
      expect(isPlainObject(null)).toBe(false);
      expect(isPlainObject(undefined)).toBe(false);
      expect(isPlainObject([])).toBe(false);
      expect(isPlainObject(new Date())).toBe(false);
      expect(isPlainObject(function() {})).toBe(false);
    });
  });

  describe('isPromise', () => {
    test('should return true for Promise objects', () => {
      expect(isPromise(Promise.resolve())).toBe(true);
      expect(isPromise(Promise.reject().catch(() => {}))).toBe(true);
      expect(isPromise(new Promise(() => {}))).toBe(true);
    });

    test('should return false for non-Promise objects', () => {
      expect(isPromise(null)).toBe(false);
      expect(isPromise(undefined)).toBe(false);
      expect(isPromise({})).toBe(false);
      expect(isPromise('string')).toBe(false);
      expect(isPromise(123)).toBe(false);
    });

    test('should return true for thenable objects (by design)', () => {
      expect(isPromise({ then: () => {} })).toBe(true); // thenable objects are considered Promise-like
    });
  });

  describe('isRecord', () => {
    test('should return true for record objects', () => {
      expect(isRecord({})).toBe(true);
      expect(isRecord({ key: 'value' })).toBe(true);
    });

    test('should return false for non-record objects', () => {
      expect(isRecord(null)).toBe(false);
      expect(isRecord(undefined)).toBe(false);
      expect(isRecord([])).toBe(false);
      expect(isRecord('string')).toBe(false);
    });
  });

  describe('isSet', () => {
    test('should return true for Set objects', () => {
      expect(isSet(new Set())).toBe(true);
      const set = new Set([1, 2, 3]);
      expect(isSet(set)).toBe(true);
    });

    test('should return false for non-Set objects', () => {
      expect(isSet(null)).toBe(false);
      expect(isSet(undefined)).toBe(false);
      expect(isSet({})).toBe(false);
      expect(isSet([])).toBe(false);
      expect(isSet(new Map())).toBe(false);
    });
  });

  describe('isTypedArray', () => {
    test('should return true for typed arrays', () => {
      expect(isTypedArray(new Int8Array())).toBe(true);
      expect(isTypedArray(new Uint8Array())).toBe(true);
      expect(isTypedArray(new Int16Array())).toBe(true);
      expect(isTypedArray(new Uint32Array())).toBe(true);
      expect(isTypedArray(new Float32Array())).toBe(true);
      expect(isTypedArray(new Float64Array())).toBe(true);
    });

    test('should return false for non-typed arrays', () => {
      expect(isTypedArray(null)).toBe(false);
      expect(isTypedArray(undefined)).toBe(false);
      expect(isTypedArray({})).toBe(false);
      expect(isTypedArray([])).toBe(false); // regular array
    });
  });

  describe('isWeakMap', () => {
    test('should return true for WeakMap objects', () => {
      expect(isWeakMap(new WeakMap())).toBe(true);
    });

    test('should return false for non-WeakMap objects', () => {
      expect(isWeakMap(null)).toBe(false);
      expect(isWeakMap(undefined)).toBe(false);
      expect(isWeakMap({})).toBe(false);
      expect(isWeakMap(new Map())).toBe(false);
    });
  });

  describe('isWeakSet', () => {
    test('should return true for WeakSet objects', () => {
      expect(isWeakSet(new WeakSet())).toBe(true);
    });

    test('should return false for non-WeakSet objects', () => {
      expect(isWeakSet(null)).toBe(false);
      expect(isWeakSet(undefined)).toBe(false);
      expect(isWeakSet({})).toBe(false);
      expect(isWeakSet(new Set())).toBe(false);
    });
  });
});