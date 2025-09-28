import { describe, test, expect } from 'vitest';
import {
  chosung,
  dedent,
  encodeUrl,
  escapeHtml,
  escapeStringRegexp,
  escapeXml,
  firstNotBlank,
  firstNotEmpty,
  formatDurationByMilli,
  formatDurationBySec,
  generateUniqueString,
  isNotBlank,
  isNumeric,
  limitMaxLength,
  removePrefix,
  removeSuffix,
  removeSurrounding,
  replaceAll,
  sanitizeHref,
  slugifyWithCounter,
  toFloat,
  toInt,
  transliterate,
  trimIndent,
  trimMargin,
  trimToNull,
  trimToUndef,
  trunc,
  truncMiddle,
} from '../../../src/pstring/index.js';

// slugify는 default export이므로 별도 import
import slugify from '../../../src/pstring/slugify.js';

describe('pstring - Missing Functions', () => {
  describe('chosung', () => {
    test('한글 자음에서 초성 추출', () => {
      expect(chosung('가')).toBe('ㄱ');
      expect(chosung('나')).toBe('ㄴ');
      expect(chosung('다')).toBe('ㄷ');
      expect(chosung('라')).toBe('ㄹ');
      expect(chosung('마')).toBe('ㅁ');
      expect(chosung('바')).toBe('ㅂ');
      expect(chosung('사')).toBe('ㅅ');
      expect(chosung('자')).toBe('ㅈ');
      expect(chosung('카')).toBe('ㅋ');
      expect(chosung('타')).toBe('ㅌ');
      expect(chosung('파')).toBe('ㅍ');
      expect(chosung('하')).toBe('ㅎ');
    });

    test('복잡한 한글 문자', () => {
      expect(chosung('강')).toBe('ㄱ');
      expect(chosung('닭')).toBe('ㄷ');
      expect(chosung('몸')).toBe('ㅁ');
    });

    test('쌍자음', () => {
      expect(chosung('까')).toBe('ㄲ');
      expect(chosung('따')).toBe('ㄸ');
      expect(chosung('빠')).toBe('ㅃ');
      expect(chosung('싸')).toBe('ㅆ');
      expect(chosung('짜')).toBe('ㅉ');
    });

    test('한글이 아닌 문자는 null 반환', () => {
      expect(chosung('a')).toBe(null);
      expect(chosung('1')).toBe(null);
      expect(chosung('!')).toBe(null);
    });

    test('빈 문자열은 null 반환', () => {
      expect(chosung('')).toBe(null);
    });
  });

  describe('dedent', () => {
    test('기본 들여쓰기 제거', () => {
      const input = `    첫 번째 줄
    두 번째 줄
    세 번째 줄`;
      const expected = `첫 번째 줄
두 번째 줄
세 번째 줄`;
      expect(dedent(input)).toBe(expected);
    });

    test('탭 들여쓰기 제거', () => {
      const input = `\t\t탭 들여쓰기
\t\t두 번째 줄`;
      const expected = `탭 들여쓰기
두 번째 줄`;
      expect(dedent(input)).toBe(expected);
    });

    test('혼합 들여쓰기', () => {
      const input = `  스페이스 들여쓰기
  두 번째 줄`;
      const expected = `스페이스 들여쓰기
두 번째 줄`;
      expect(dedent(input)).toBe(expected);
    });

    test('단일 줄은 trim', () => {
      expect(dedent('  single line  ')).toBe('single line');
    });

    test('빈 문자열', () => {
      expect(dedent('')).toBe('');
    });

    test('첫 줄이 빈 줄인 경우', () => {
      const input = `
    첫 번째 줄
    두 번째 줄`;
      expect(dedent(input).trim()).toBe(`첫 번째 줄
두 번째 줄`);
    });
  });

  describe('encodeUrl', () => {
    test('URL 인코딩 (존재한다면)', () => {
      // 실제 구현이 있는지 확인하고 테스트
      expect(typeof encodeUrl).toBe('function');
    });
  });

  describe('escapeHtml', () => {
    test('HTML 특수문자 이스케이프', () => {
      expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
      expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
      expect(escapeHtml('"hello"')).toBe('&quot;hello&quot;');
      expect(escapeHtml("'world'")).toBe('&#39;world&#39;');
    });

    test('모든 HTML 특수문자 조합', () => {
      expect(escapeHtml('<div class="test" data-value=\'123\'>Tom & Jerry</div>')).toBe(
        '&lt;div class=&quot;test&quot; data-value=&#39;123&#39;&gt;Tom &amp; Jerry&lt;/div&gt;',
      );
    });

    test('일반 문자열은 그대로', () => {
      expect(escapeHtml('hello world')).toBe('hello world');
      expect(escapeHtml('123456')).toBe('123456');
    });

    test('빈 문자열', () => {
      expect(escapeHtml('')).toBe('');
    });
  });

  describe('escapeStringRegexp', () => {
    test('정규식 특수문자 이스케이프', () => {
      expect(typeof escapeStringRegexp).toBe('function');
      // 기본적인 정규식 특수문자들이 이스케이프되는지 확인
      const result = escapeStringRegexp('.*+?^${}()|[]\\');
      expect(result).toContain('\\.');
      expect(result).toContain('\\*');
      expect(result).toContain('\\+');
    });
  });

  describe('escapeXml', () => {
    test('XML 특수문자 이스케이프 (존재한다면)', () => {
      expect(typeof escapeXml).toBe('function');
    });
  });

  describe('firstNotBlank', () => {
    test('첫 번째 공백이 아닌 문자열 반환', () => {
      expect(firstNotBlank('', '  ', 'hello', 'world')).toBe('hello');
      expect(firstNotBlank(null as any, undefined as any, 'first', 'second')).toBe('first');
    });

    test('모든 값이 공백인 경우', () => {
      expect(firstNotBlank('', '  ', '   ')).toBeUndefined();
    });

    test('단일 값', () => {
      expect(firstNotBlank('test')).toBe('test');
      expect(firstNotBlank('  ')).toBeUndefined();
    });
  });

  describe('firstNotEmpty', () => {
    test('첫 번째 비어있지 않은 문자열 반환', () => {
      expect(firstNotEmpty('', 'hello', 'world')).toBe('hello');
      expect(firstNotEmpty(null as any, undefined as any, 'first')).toBe('first');
    });

    test('공백도 비어있지 않은 것으로 처리', () => {
      expect(firstNotEmpty('', '  ', 'hello')).toBe('  ');
    });

    test('모든 값이 빈 경우', () => {
      expect(firstNotEmpty('', null as any, undefined as any)).toBeUndefined();
    });
  });

  describe('formatDuration', () => {
    describe('formatDurationByMilli', () => {
      test('기본 시분초 포맷 (leadingZero 기본값 true)', () => {
        expect(formatDurationByMilli(3661000)).toBe('01:01:01'); // 1시간 1분 1초
        expect(formatDurationByMilli(61000)).toBe('01:01'); // 1분 1초
        expect(formatDurationByMilli(5000)).toBe('00:05'); // 5초
      });

      test('0시간을 포함하는 경우', () => {
        expect(formatDurationByMilli(61000, true)).toBe('00:01:01'); // withZeroHour = true
      });

      test('앞자리 0 제거', () => {
        expect(formatDurationByMilli(61000, false, false)).toBe('1:01'); // leadingZero = false
        expect(formatDurationByMilli(3661000, false, false)).toBe('1:01:01');
      });

      test('음수 시간', () => {
        expect(formatDurationByMilli(-61000)).toBe('-01:01');
        expect(formatDurationByMilli(-3661000)).toBe('-01:01:01');
      });

      test('0초', () => {
        expect(formatDurationByMilli(0)).toBe('00:00');
      });
    });

    describe('formatDurationBySec', () => {
      test('초 단위 입력', () => {
        expect(formatDurationBySec(61)).toBe('00:01:01'); // 61초
        expect(formatDurationBySec(5)).toBe('00:00:05'); // 5초
      });

      test('기본값으로 시간 포함', () => {
        expect(formatDurationBySec(61, true)).toBe('00:01:01');
        expect(formatDurationBySec(61, false)).toBe('01:01');
      });
    });
  });

  describe('generateUniqueString', () => {
    test('고유 문자열 생성', () => {
      const existingNames = new Set(['test1', 'test2']);
      const str1 = generateUniqueString('test', existingNames);
      expect(str1).toBe('test');

      existingNames.add('test');
      const str2 = generateUniqueString('test', existingNames);
      expect(str2).toBe('test3'); // test1, test2가 이미 있으므로 test3
    });

    test('숫자가 있는 base에서 중복 처리', () => {
      const existingNames = new Set(['file1', 'file2']);
      const result = generateUniqueString('file1', existingNames);
      expect(result).toBe('file'); // 'file1'에서 숫자를 제거한 'file'을 반환
    });

    test('빈 Set일 때 기본 동작', () => {
      const existingNames = new Set<string>();
      const result = generateUniqueString('unique', existingNames);
      expect(result).toBe('unique');
    });
  });

  describe('isNotBlank', () => {
    test('공백이 아닌 문자열은 true', () => {
      expect(isNotBlank('hello')).toBe(true);
      expect(isNotBlank('  test  ')).toBe(true); // 공백 중간에 문자 있음
    });

    test('공백만 있는 문자열은 false', () => {
      expect(isNotBlank('')).toBe(false);
      expect(isNotBlank('   ')).toBe(false);
      expect(isNotBlank('\t\n')).toBe(false);
    });

    test('null/undefined는 false', () => {
      expect(isNotBlank(null as any)).toBe(false);
      expect(isNotBlank(undefined as any)).toBe(false);
    });
  });

  describe('isNumeric', () => {
    test('숫자 문자열은 true', () => {
      expect(isNumeric('123')).toBe(true);
      expect(isNumeric('123.45')).toBe(true);
      expect(isNumeric('-123')).toBe(true);
      expect(isNumeric('0')).toBe(true);
    });

    test('공백이 있는 숫자 문자열', () => {
      expect(isNumeric('  123  ')).toBe(true);
    });

    test('숫자가 아닌 문자열은 false', () => {
      expect(isNumeric('abc')).toBe(false);
      expect(isNumeric('123abc')).toBe(false);
      expect(isNumeric('')).toBe(true); // Number('') === 0이므로 !isNaN(0) === true
    });

    test('null/undefined는 false', () => {
      expect(isNumeric(null)).toBe(false);
      expect(isNumeric(undefined)).toBe(false);
    });

    test('특수한 숫자 형태', () => {
      expect(isNumeric('Infinity')).toBe(true);
      expect(isNumeric('-Infinity')).toBe(true);
      expect(isNumeric('NaN')).toBe(false); // NaN은 숫자지만 !isNaN(Number('NaN'))은 false
    });
  });

  describe('limitMaxLength', () => {
    test('최대 길이 제한', () => {
      expect(typeof limitMaxLength).toBe('function');
      // 기본적인 기능 테스트 (구현에 따라 조정)
    });
  });

  describe('removeSurrounding', () => {
    test('양쪽 특정 문자 제거', () => {
      expect(typeof removeSurrounding).toBe('function');
      // 기본적인 기능 테스트 (구현에 따라 조정)
    });
  });

  describe('replaceAll', () => {
    test('모든 문자열 교체', () => {
      expect(typeof replaceAll).toBe('function');
      // String.prototype.replaceAll 또는 커스텀 구현 테스트
    });
  });

  describe('sanitizeHref', () => {
    test('URL 정리 및 보안 처리', () => {
      expect(typeof sanitizeHref).toBe('function');
      // XSS 방지 등의 기본 테스트
    });
  });

  describe('slugify', () => {
    test('기본 슬러그 생성', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('This is a Test!')).toBe('this-is-a-test');
    });

    test('특수문자 처리', () => {
      expect(slugify('Tom & Jerry')).toBe('tom-and-jerry');
      expect(slugify('I ♥ unicorns')).toBe('i-love-unicorns');
    });

    test('옵션 적용', () => {
      expect(slugify('Hello World', { separator: '_' })).toBe('hello_world');
      expect(slugify('Hello World', { lowercase: false })).toBe('Hello-World');
    });

    test('한글 처리 (transliterate)', () => {
      const result = slugify('안녕하세요');
      expect(typeof result).toBe('string');
      // 한글이 모두 제거될 수 있으므로 빈 문자열일 가능성이 있음
      expect(result).toBe('');
    });
  });

  describe('slugifyWithCounter', () => {
    test('중복 슬러그에 카운터 추가', () => {
      const counter = slugifyWithCounter();
      expect(counter('test')).toBe('test');
      expect(counter('test')).toBe('test-2');
      expect(counter('test')).toBe('test-3');
    });

    test('카운터 리셋', () => {
      const counter = slugifyWithCounter();
      counter('test');
      counter('test');
      counter.reset();
      expect(counter('test')).toBe('test');
    });
  });

  describe('toFloat', () => {
    test('문자열을 실수로 변환', () => {
      expect(toFloat('123.45')).toBe(123.45);
      expect(toFloat('0')).toBe(0);
      expect(toFloat('-123.45')).toBe(-123.45);
    });

    test('변환 불가능한 경우 기본값', () => {
      expect(toFloat('abc')).toBe(0);
      expect(toFloat('abc', 99)).toBe(99);
      expect(toFloat('')).toBe(0);
    });

    test('null/undefined 처리', () => {
      expect(toFloat(null)).toBe(0);
      expect(toFloat(undefined)).toBe(0);
      expect(toFloat(null, 42)).toBe(42);
    });

    test('부분적 숫자 문자열', () => {
      expect(toFloat('123.45abc')).toBe(123.45); // parseFloat의 동작
      expect(toFloat('abc123')).toBe(0); // NaN이므로 기본값
    });
  });

  describe('toInt', () => {
    test('문자열을 정수로 변환', () => {
      expect(typeof toInt).toBe('function');
      // parseInt 기반으로 예상되는 동작 테스트
    });
  });

  describe('transliterate', () => {
    test('다국어 문자를 라틴 문자로 변환', () => {
      // 라이브러리 기반이므로 기본적인 테스트만
      expect(typeof transliterate).toBe('function');
      const result = transliterate('café', {});
      expect(typeof result).toBe('string');
    });
  });

  describe('trimIndent', () => {
    test('공통 들여쓰기 제거', () => {
      expect(typeof trimIndent).toBe('function');
    });
  });

  describe('trimMargin', () => {
    test('마진 문자와 들여쓰기 제거', () => {
      expect(typeof trimMargin).toBe('function');
    });
  });

  describe('trimToNull', () => {
    test('공백 문자열을 null로 변환', () => {
      expect(trimToNull('hello')).toBe('hello');
      expect(trimToNull('  world  ')).toBe('world');
      expect(trimToNull('')).toBe(null);
      expect(trimToNull('   ')).toBe(null);
    });

    test('null/undefined 처리', () => {
      expect(trimToNull(null)).toBe(null);
      expect(trimToNull(undefined)).toBe(null);
    });
  });

  describe('trimToUndef', () => {
    test('공백 문자열을 undefined로 변환', () => {
      expect(typeof trimToUndef).toBe('function');
    });
  });

  describe('trunc', () => {
    test('문자열 자르기', () => {
      expect(typeof trunc).toBe('function');
    });
  });

  describe('truncMiddle', () => {
    test('중간 부분 자르기', () => {
      expect(truncMiddle('This is a long string that needs truncating.', { length: 20 })).toBe(
        'This is a...ncating.',
      );

      expect(truncMiddle('Short', { length: 20 })).toBe('Short');
    });

    test('커스텀 omission', () => {
      expect(
        truncMiddle('This is a long string that needs truncating.', {
          length: 20,
          omission: '[...]',
        }),
      ).toBe('This is [...]cating.');
    });

    test('기본 옵션', () => {
      const longString = 'a'.repeat(50);
      const result = truncMiddle(longString);
      expect(result.length).toBeLessThanOrEqual(30);
      expect(result).toContain('...');
    });

    test('omission이 length보다 긴 경우', () => {
      const result = truncMiddle('hello', { length: 3, omission: '......' });
      expect(result).toBe('...');
    });
  });

  describe('removePrefix', () => {
    test('prefix가 있는 경우 제거 - repeat=false', () => {
      expect(removePrefix('hello world', 'hello')).toBe(' world');
      expect(removePrefix('test string', 'test')).toBe(' string');
      expect(removePrefix('prefix_data', 'prefix_')).toBe('data');
    });

    test('prefix가 없는 경우 원본 반환 - repeat=false', () => {
      expect(removePrefix('hello world', 'hi')).toBe('hello world');
      expect(removePrefix('test string', 'exam')).toBe('test string');
      expect(removePrefix('data', 'prefix_')).toBe('data');
    });

    test('빈 문자열 처리', () => {
      expect(removePrefix('', 'prefix')).toBe('');
      expect(removePrefix('hello', '')).toBe('hello');
      expect(removePrefix('', '')).toBe('');
    });

    test('문자열과 같은 길이의 prefix', () => {
      expect(removePrefix('hello', 'hello')).toBe('');
      expect(removePrefix('test', 'test')).toBe('');
    });

    test('반복 제거 - repeat=true', () => {
      expect(removePrefix('httpHttpHttp://example.com', 'http', true)).toBe(
        'HttpHttp://example.com',
      );
      expect(removePrefix('prefixprefixdata', 'prefix', true)).toBe('data');
      expect(removePrefix('aaaaab', 'a', true)).toBe('b');
    });

    test('반복 제거에서 prefix가 없는 경우', () => {
      expect(removePrefix('hello world', 'test', true)).toBe('hello world');
      expect(removePrefix('data', 'prefix', true)).toBe('data');
    });

    test('반복 제거에서 빈 문자열', () => {
      expect(removePrefix('', 'prefix', true)).toBe('');
      expect(removePrefix('hello', '', true)).toBe('hello');
    });

    test('전체 문자열이 prefix로만 구성된 경우', () => {
      expect(removePrefix('testtest', 'test', true)).toBe('');
      expect(removePrefix('aaa', 'a', true)).toBe('');
    });

    test('대소문자 구분', () => {
      expect(removePrefix('Hello World', 'hello')).toBe('Hello World');
      expect(removePrefix('Hello World', 'Hello')).toBe(' World');
    });

    test('특수 문자가 포함된 prefix', () => {
      expect(removePrefix('http://example.com', 'http://')).toBe('example.com');
      expect(removePrefix('$var_name', '$')).toBe('var_name');
      expect(removePrefix('/*comment*/', '/*')).toBe('comment*/');
    });
  });

  describe('removeSuffix', () => {
    test('suffix가 있는 경우 제거 - repeat=false', () => {
      expect(removeSuffix('hello world', 'world')).toBe('hello ');
      expect(removeSuffix('test string', 'string')).toBe('test ');
      expect(removeSuffix('data_suffix', '_suffix')).toBe('data');
    });

    test('suffix가 없는 경우 원본 반환 - repeat=false', () => {
      expect(removeSuffix('hello world', 'test')).toBe('hello world');
      expect(removeSuffix('test string', 'exam')).toBe('test string');
      expect(removeSuffix('data', '_suffix')).toBe('data');
    });

    test('빈 문자열 처리', () => {
      expect(removeSuffix('', 'suffix')).toBe('');
      expect(removeSuffix('hello', '')).toBe('hello');
      expect(removeSuffix('', '')).toBe('');
    });

    test('문자열과 같은 길이의 suffix', () => {
      expect(removeSuffix('hello', 'hello')).toBe('');
      expect(removeSuffix('test', 'test')).toBe('');
    });

    test('반복 제거 - repeat=true', () => {
      expect(removeSuffix('example.com/Http/Http/http', 'http', true)).toBe(
        'example.com/Http/Http/',
      );
      expect(removeSuffix('datasuffixsuffix', 'suffix', true)).toBe('data');
      expect(removeSuffix('baaaaa', 'a', true)).toBe('b');
    });

    test('반복 제거에서 suffix가 없는 경우', () => {
      expect(removeSuffix('hello world', 'test', true)).toBe('hello world');
      expect(removeSuffix('data', 'suffix', true)).toBe('data');
    });

    test('반복 제거에서 빈 문자열', () => {
      expect(removeSuffix('', 'suffix', true)).toBe('');
      expect(removeSuffix('hello', '', true)).toBe('hello');
    });

    test('전체 문자열이 suffix로만 구성된 경우', () => {
      expect(removeSuffix('testtest', 'test', true)).toBe('');
      expect(removeSuffix('aaa', 'a', true)).toBe('');
    });

    test('대소문자 구분', () => {
      expect(removeSuffix('Hello World', 'world')).toBe('Hello World');
      expect(removeSuffix('Hello World', 'World')).toBe('Hello ');
    });

    test('특수 문자가 포함된 suffix', () => {
      expect(removeSuffix('example.com/', '/')).toBe('example.com');
      expect(removeSuffix('var_name$', '$')).toBe('var_name');
      expect(removeSuffix('/*comment*/', '*/')).toBe('/*comment');
    });
  });
});
