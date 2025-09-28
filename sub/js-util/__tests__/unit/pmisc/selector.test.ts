import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { querySelector, querySelectorAll, xpathSelector } from '../../../src/pmisc/selector.js';

// Mock DOM environment
const mockElement = {
  querySelector: (selector: string) => {
    if (selector === '.found') return { id: 'found-element' };
    if (selector === '#test') return { id: 'test-element' };
    return null;
  },
  querySelectorAll: (selector: string) => {
    if (selector === '.multiple') return [
      { id: 'element1' },
      { id: 'element2' },
      { id: 'element3' }
    ];
    if (selector === '.single') return [{ id: 'single-element' }];
    return [];
  }
} as any;

const mockDocument = {
  querySelector: mockElement.querySelector,
  querySelectorAll: mockElement.querySelectorAll
} as any;

const mockXPathEvaluator = {
  createExpression: (path: string) => ({
    evaluate: (root: any, resultType: number) => ({
      snapshotLength: path === '//div' ? 2 : 0,
      snapshotItem: (index: number) => {
        if (path === '//div') {
          return index === 0 ? { tagName: 'DIV', id: 'div1' } : { tagName: 'DIV', id: 'div2' };
        }
        return null;
      }
    })
  })
};

describe('pmisc - Selector Functions', () => {
  beforeEach(() => {
    // Mock global objects for testing
    global.document = mockDocument;
    global.XPathEvaluator = vi.fn(() => mockXPathEvaluator) as any;
    global.XPathResult = { ORDERED_NODE_SNAPSHOT_TYPE: 7 } as any;
  });

  afterEach(() => {
    // Clean up mocks
    delete (global as any).document;
    delete (global as any).XPathEvaluator;
    delete (global as any).XPathResult;
  });

  describe('querySelector', () => {
    test('should find element with default document root', () => {
      const result = querySelector('.found');
      expect(result).toEqual({ id: 'found-element' });
    });

    test('should find element with custom root', () => {
      const result = querySelector('#test', mockElement);
      expect(result).toEqual({ id: 'test-element' });
    });

    test('should return null when element not found', () => {
      const result = querySelector('.not-found');
      expect(result).toBeNull();
    });

    test('should handle empty selector', () => {
      const result = querySelector('');
      expect(result).toBeNull();
    });
  });

  describe('querySelectorAll', () => {
    test('should find multiple elements', () => {
      const result = querySelectorAll('.multiple');
      expect(result).toEqual([
        { id: 'element1' },
        { id: 'element2' },
        { id: 'element3' }
      ]);
    });

    test('should find single element as array', () => {
      const result = querySelectorAll('.single');
      expect(result).toEqual([{ id: 'single-element' }]);
    });

    test('should return empty array when no elements found', () => {
      const result = querySelectorAll('.not-found');
      expect(result).toEqual([]);
    });

    test('should work with custom root', () => {
      const result = querySelectorAll('.multiple', mockElement);
      expect(result).toEqual([
        { id: 'element1' },
        { id: 'element2' },
        { id: 'element3' }
      ]);
    });
  });

  describe('xpathSelector', () => {
    test('should find elements with XPath', () => {
      const result = xpathSelector('//div');
      expect(result).toEqual([
        { tagName: 'DIV', id: 'div1' },
        { tagName: 'DIV', id: 'div2' }
      ]);
    });

    test('should return empty array for no matches', () => {
      const result = xpathSelector('//span');
      expect(result).toEqual([]);
    });

    test('should work with custom root', () => {
      const result = xpathSelector('//div', mockElement);
      expect(result).toEqual([
        { tagName: 'DIV', id: 'div1' },
        { tagName: 'DIV', id: 'div2' }
      ]);
    });

    test('should handle empty XPath', () => {
      const result = xpathSelector('');
      expect(result).toEqual([]);
    });
  });
});