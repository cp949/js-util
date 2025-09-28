import { describe, test, expect } from 'vitest';
import { encodeUrl } from '../../../src/pstring/encodeUrl.js';
import { escapeXml } from '../../../src/pstring/escapeXml.js';
import { trimIndent } from '../../../src/pstring/trimIndent.js';
import { trimMargin } from '../../../src/pstring/trimMargin.js';
import { trunc } from '../../../src/pstring/trunc.js';
import { removeSurrounding } from '../../../src/pstring/removeSurrounding.js';
import { sanitizeHref } from '../../../src/pstring/sanitizeHref.js';
import { limitMaxLength } from '../../../src/pstring/limitMaxLength.js';

describe('pstring - Advanced String Functions', () => {
  describe('encodeUrl', () => {
    test('should preserve already encoded URLs', () => {
      expect(encodeUrl('http://[::1]:8080/foo/bar')).toBe('http://[::1]:8080/foo/bar');
      expect(encodeUrl('http:\\\\localhost\\foo\\bar.html')).toBe('http:\\\\localhost\\foo\\bar.html');
    });

    test('should encode special characters', () => {
      expect(encodeUrl('http://localhost/\nsnow.html')).toBe('http://localhost/%0Asnow.html');
      expect(encodeUrl('http://localhost/\fsnow.html')).toBe('http://localhost/%0Csnow.html');
    });

    test('should encode control characters', () => {
      expect(encodeUrl('/\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f'))
        .toBe('/%00%01%02%03%04%05%06%07%08%09%0A%0B%0C%0D%0E%0F');
    });

    test('should preserve valid characters', () => {
      expect(encodeUrl('/\x60\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6a\x6b\x6c\x6d\x6e\x6f'))
        .toBe('/%60abcdefghijklmno');
    });

    test('should preserve valid percent encoding', () => {
      expect(encodeUrl('http://localhost/%F0snow.html')).toBe('http://localhost/%F0snow.html');
    });

    test('should encode invalid percent sequences', () => {
      expect(encodeUrl('http://localhost/%foo%bar%zap%'))
        .toBe('http://localhost/%25foo%bar%25zap%25');
    });

    test('should handle Unicode characters', () => {
      expect(encodeUrl('http://localhost/\uD83D\uDC7B snow.html'))
        .toBe('http://localhost/%F0%9F%91%BB%20snow.html');
    });

    test('should handle unpaired surrogate characters', () => {
      expect(encodeUrl('http://localhost/\uD83Dfoo\uDC7B <\uDC7B\uD83D>.html'))
        .toBe('http://localhost/%EF%BF%BDfoo%EF%BF%BD%20%3C%EF%BF%BD%EF%BF%BD%3E.html');
    });

    test('should handle empty and edge cases', () => {
      expect(encodeUrl('')).toBe('');
      expect(encodeUrl('/')).toBe('/');
      expect(encodeUrl('http://')).toBe('http://');
    });
  });

  describe('escapeXml', () => {
    test('should escape basic XML characters', () => {
      expect(escapeXml('<hello>')).toBe('&lt;hello&gt;');
      expect(escapeXml('&amp;')).toBe('&amp;amp;');
      expect(escapeXml('"quoted"')).toBe('&quot;quoted&quot;');
      expect(escapeXml("'single'")).toBe('&apos;single&apos;');
    });

    test('should escape all XML characters together', () => {
      expect(escapeXml('<tag attr="value" attr2=\'value2\'>&content;</tag>'))
        .toBe('&lt;tag attr=&quot;value&quot; attr2=&apos;value2&apos;&gt;&amp;content;&lt;/tag&gt;');
    });

    test('should handle empty and normal text', () => {
      expect(escapeXml('')).toBe('');
      expect(escapeXml('normal text')).toBe('normal text');
      expect(escapeXml('123456')).toBe('123456');
    });

    test('should handle mixed content', () => {
      expect(escapeXml('Hello & "World" <test>')).toBe('Hello &amp; &quot;World&quot; &lt;test&gt;');
    });
  });

  describe('trimIndent', () => {
    test('should remove common indentation', () => {
      const text = `
    This is a line.
    This is another line.
        This line is indented more.
`;
      const expected = `This is a line.
This is another line.
    This line is indented more.`;
      expect(trimIndent(text)).toBe(expected);
    });

    test('should handle mixed indentation', () => {
      const text = `  line 1
  line 2
    line 3 indented
  line 4`;
      const expected = `line 1
line 2
  line 3 indented
line 4`;
      expect(trimIndent(text)).toBe(expected);
    });

    test('should handle no common indentation', () => {
      const text = `line 1
  line 2
    line 3`;
      expect(trimIndent(text)).toBe(text.trim());
    });

    test('should handle empty lines', () => {
      const text = `  line 1

  line 2
  
  line 3`;
      const expected = `line 1

line 2

line 3`;
      expect(trimIndent(text)).toBe(expected);
    });

    test('should handle single line', () => {
      expect(trimIndent('    single line')).toBe('single line');
      expect(trimIndent('no indent')).toBe('no indent');
    });

    test('should handle empty string', () => {
      expect(trimIndent('')).toBe('');
      expect(trimIndent('   ')).toBe('');
    });
  });

  describe('trimMargin', () => {
    test('should remove margin with default pipe character', () => {
      const text = `
    |This is a line.
    |This is another line.
    |    This line is indented more.
`;
      const expected = `This is a line.
This is another line.
    This line is indented more.`;
      expect(trimMargin(text)).toBe(expected);
    });

    test('should remove margin with custom character', () => {
      const text = `
    >This is a line.
    >This is another line.
    >    This line is indented more.
`;
      const expected = `This is a line.
This is another line.
    This line is indented more.`;
      expect(trimMargin(text, '>')).toBe(expected);
    });

    test('should handle lines without margin character', () => {
      const text = `
    |Line with margin
    Line without margin
    |Another line with margin
`;
      const expected = `Line with margin
    Line without margin
Another line with margin`;
      expect(trimMargin(text)).toBe(expected);
    });

    test('should handle empty and edge cases', () => {
      expect(trimMargin('')).toBe('');
      expect(trimMargin('|single')).toBe('single');
      expect(trimMargin('no margin')).toBe('no margin');
    });

    test('should handle multiple margin characters in line', () => {
      const text = '    |first|second|third';
      expect(trimMargin(text)).toBe('first|second|third');
    });
  });

  describe('trunc', () => {
    test('should truncate with default options', () => {
      const longText = 'This is a very long string that should be truncated';
      const result = trunc(longText);
      expect(result).toBe('This is a very long string ...');
      expect(result.length).toBe(30);
    });

    test('should not truncate short strings', () => {
      const shortText = 'Short text';
      expect(trunc(shortText)).toBe(shortText);
      expect(trunc(shortText, { length: 50 })).toBe(shortText);
    });

    test('should use custom length', () => {
      const text = 'This is a test string';
      expect(trunc(text, { length: 10 })).toBe('This is...');
      expect(trunc(text, { length: 15 })).toBe('This is a te...');
    });

    test('should use custom omission', () => {
      const text = 'This is a test string';
      expect(trunc(text, { length: 15, omission: ' [cut]' })).toBe('This is a [cut]');
      expect(trunc(text, { length: 10, omission: '***' })).toBe('This is***');
    });

    test('should handle separator string', () => {
      const text = 'This is a long string that needs truncating';
      expect(trunc(text, { length: 20, separator: ' ' })).toBe('This...');
    });

    test('should handle separator RegExp', () => {
      const text = 'This is a long string that needs truncating';
      expect(trunc(text, { length: 20, separator: /\s/ })).toBe('This...');
    });

    test('should handle edge cases', () => {
      expect(trunc('', { length: 10 })).toBe('');
      expect(trunc('test', { length: 3, omission: '.....' })).toBe('.....');
      expect(trunc('test', { length: 0 })).toBe('...');
    });
  });

  describe('removeSurrounding', () => {
    test('should remove same prefix and suffix', () => {
      expect(removeSurrounding('"hello"', '"')).toBe('hello');
      expect(removeSurrounding("'world'", "'")).toBe('world');
      expect(removeSurrounding('(test)', '(', ')')).toBe('test');
    });

    test('should remove different prefix and suffix', () => {
      expect(removeSurrounding('<hello>', '<', '>')).toBe('hello');
      expect(removeSurrounding('[world]', '[', ']')).toBe('world');
      expect(removeSurrounding('{test}', '{', '}')).toBe('test');
    });

    test('should handle missing surrounding characters', () => {
      expect(removeSurrounding('hello', '"')).toBe('hello');
      expect(removeSurrounding('"hello', '"')).toBe('"hello');
      expect(removeSurrounding('hello"', '"')).toBe('hello"');
      expect(removeSurrounding('<hello', '<', '>')).toBe('<hello');
    });

    test('should handle edge cases', () => {
      expect(removeSurrounding('', '"')).toBe('');
      expect(removeSurrounding('a', 'a')).toBe('a'); // Single character can't be removed by same prefix/suffix
      expect(removeSurrounding('ab', 'a', 'b')).toBe('');
      expect(removeSurrounding('abc', 'ab')).toBe('abc');
    });

    test('should handle undefined suffix', () => {
      expect(removeSurrounding('"hello"', '"', undefined)).toBe('hello');
      expect(removeSurrounding('*test*', '*', undefined)).toBe('test');
    });

    test('should handle empty prefix or suffix', () => {
      expect(removeSurrounding('hello', '')).toBe('hello');
      expect(removeSurrounding('hello', 'h', '')).toBe('hello');
    });
  });

  describe('sanitizeHref', () => {
    test('should add default protocol to domain', () => {
      expect(sanitizeHref('example.com')).toBe('http://example.com');
      expect(sanitizeHref('google.com')).toBe('http://google.com');
    });

    test('should add custom protocol', () => {
      expect(sanitizeHref('example.com', 'https://')).toBe('https://example.com');
      expect(sanitizeHref('api.test.com', 'https://')).toBe('https://api.test.com');
    });

    test('should preserve existing protocols', () => {
      expect(sanitizeHref('https://example.com')).toBe('https://example.com');
      expect(sanitizeHref('http://example.com')).toBe('http://example.com');
      expect(sanitizeHref('mailto:test@example.com')).toBe('mailto:test@example.com');
      expect(sanitizeHref('tel:+1234567890')).toBe('tel:+1234567890');
      expect(sanitizeHref('sms:+1234567890')).toBe('sms:+1234567890');
    });

    test('should preserve relative paths', () => {
      expect(sanitizeHref('/about')).toBe('/about');
      expect(sanitizeHref('/path/to/page')).toBe('/path/to/page');
    });

    test('should preserve anchors', () => {
      expect(sanitizeHref('#section')).toBe('#section');
      expect(sanitizeHref('#top')).toBe('#top');
    });

    test('should trim whitespace', () => {
      expect(sanitizeHref('  example.com  ')).toBe('http://example.com');
      expect(sanitizeHref('\t/about\n')).toBe('/about');
    });

    test('should encode special characters', () => {
      expect(sanitizeHref('example.com/path with spaces')).toBe('http://example.com/path%20with%20spaces');
      expect(sanitizeHref('test.com/한글')).toContain('http://test.com/');
    });
  });

  describe('limitMaxLength', () => {
    test('should limit string to specified length', () => {
      expect(limitMaxLength('hello world', 5)).toBe('hello');
      expect(limitMaxLength('test', 10)).toBe('test');
      expect(limitMaxLength('exactly', 7)).toBe('exactly');
    });

    test('should handle null and undefined', () => {
      expect(limitMaxLength(null, 5)).toBe('');
      expect(limitMaxLength(undefined, 5)).toBe('');
    });

    test('should handle empty string', () => {
      expect(limitMaxLength('', 5)).toBe('');
    });

    test('should handle zero and negative lengths', () => {
      expect(limitMaxLength('hello', 0)).toBe('');
      expect(limitMaxLength('hello', -1)).toBe('');
    });

    test('should handle edge cases', () => {
      expect(limitMaxLength('a', 1)).toBe('a');
      expect(limitMaxLength('ab', 1)).toBe('a');
    });
  });
});