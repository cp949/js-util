import { describe, test, expect, vi } from 'vitest';
import { isHTMLElement, isEvent, isImageData } from '../../../src/types/index.js';

describe('DOM/Browser TypeGuards', () => {
  describe('isHTMLElement', () => {
    test('HTMLElement 검증', () => {
      // jsdom이 없는 node 환경에서는 HTMLElement이 없을 수 있음
      if (typeof HTMLElement !== 'undefined') {
        const div = document.createElement('div');
        expect(isHTMLElement(div)).toBe(true);
      }
    });

    test('HTMLElement가 아닌 값들은 false', () => {
      expect(isHTMLElement('div')).toBe(false);
      expect(isHTMLElement({})).toBe(false);
      expect(isHTMLElement(null)).toBe(false);
    });

    test('브라우저가 아닌 환경에서 false 반환', () => {
      // HTMLElement가 정의되지 않은 환경 (node.js)
      const mockElement = { tagName: 'DIV' };
      expect(isHTMLElement(mockElement)).toBe(false);
    });
  });

  describe('isEvent', () => {
    test('Event 객체 검증', () => {
      if (typeof Event !== 'undefined') {
        const event = new Event('click');
        expect(isEvent(event)).toBe(true);
      }
    });

    test('Event가 아닌 값들은 false', () => {
      expect(isEvent('click')).toBe(false);
      expect(isEvent({ type: 'click' })).toBe(false);
      expect(isEvent(null)).toBe(false);
    });
  });

  describe('isImageData', () => {
    test('ImageData 객체 검증', () => {
      if (typeof ImageData !== 'undefined') {
        const imageData = new ImageData(100, 100);
        expect(isImageData(imageData)).toBe(true);
      }
    });

    test('ImageData가 아닌 값들은 false', () => {
      expect(isImageData({ width: 100, height: 100 })).toBe(false);
      expect(isImageData(null)).toBe(false);
      expect(isImageData(undefined)).toBe(false);
    });

    test('브라우저가 아닌 환경에서 false 반환', () => {
      const mockImageData = {
        width: 100,
        height: 100,
        data: new Uint8ClampedArray(40000),
      };
      expect(isImageData(mockImageData)).toBe(false);
    });
  });
});
