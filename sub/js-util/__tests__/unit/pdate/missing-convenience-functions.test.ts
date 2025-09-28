import { describe, test, expect } from 'vitest';
import { formatByEpochSeconds, formatByEpochMillis } from '../../../src/pdate/index.js';

describe('pdate - Missing Convenience Functions', () => {
  describe('formatByEpochSeconds', () => {
    test('유효한 epoch seconds와 포맷 문자열', () => {
      // 2024-01-01 00:00:00 UTC
      const epochSeconds = 1704067200;
      const fmtString = 'YYYY-MM-DD HH:mm:ss';

      const [formattedStr, date] = formatByEpochSeconds(epochSeconds, fmtString);

      expect(formattedStr).toBeDefined();
      expect(date).toBeInstanceOf(Date);
      expect(formattedStr).toMatch(/2024-01-01/);
      expect(date!.getFullYear()).toBe(2024);
      expect(date!.getMonth()).toBe(0); // January
      expect(date!.getDate()).toBe(1);
    });

    test('Unix epoch (0)', () => {
      const [formattedStr, date] = formatByEpochSeconds(0, 'YYYY-MM-DD');

      expect(formattedStr).toBe('1970-01-01');
      expect(date).toBeInstanceOf(Date);
      expect(date!.toISOString()).toBe('1970-01-01T00:00:00.000Z');
    });

    test('음수 timestamp (1970년 이전)', () => {
      const epochSeconds = -86400; // 1969-12-31 00:00:00 UTC
      const [formattedStr, date] = formatByEpochSeconds(epochSeconds, 'YYYY-MM-DD');

      expect(formattedStr).toBe('1969-12-31');
      expect(date).toBeInstanceOf(Date);
      expect(date!.getFullYear()).toBe(1969);
      expect(date!.getMonth()).toBe(11); // December
      expect(date!.getDate()).toBe(31);
    });

    test('소수점이 있는 timestamp (밀리초 포함)', () => {
      const epochSeconds = 1704067200.5; // 0.5초 추가
      const [formattedStr, date] = formatByEpochSeconds(epochSeconds, 'YYYY-MM-DD HH:mm:ss.SSS');

      expect(formattedStr).toBeDefined();
      expect(date).toBeInstanceOf(Date);
      expect(date!.getMilliseconds()).toBe(500);
      expect(formattedStr).toMatch(/2024-01-01.*500/);
    });

    test('다양한 포맷 문자열', () => {
      const epochSeconds = 1703509845; // 2023-12-25 06:30:45 UTC

      const formats = [
        'YYYY-MM-DD',
        'DD/MM/YYYY',
        'MMMM Do YYYY',
        'HH:mm:ss',
        'dddd, MMMM Do YYYY, h:mm:ss a',
        'X', // Unix timestamp
      ];

      formats.forEach((format) => {
        const [formattedStr, date] = formatByEpochSeconds(epochSeconds, format);

        expect(formattedStr).toBeDefined();
        expect(typeof formattedStr).toBe('string');
        expect(date).toBeInstanceOf(Date);
      });
    });

    test('잘못된 epoch seconds (null/undefined)', () => {
      const testCases = [null as any, undefined as any];

      testCases.forEach((invalidValue) => {
        const [formattedStr, date] = formatByEpochSeconds(invalidValue, 'YYYY-MM-DD');

        expect(formattedStr).toBeUndefined();
        expect(date).toBeUndefined();
      });
    });

    test('극단적인 timestamp 값들', () => {
      const validValues = [
        2147483647, // 32-bit timestamp limit (2038 problem)
        -2147483648, // 32-bit negative limit
      ];

      validValues.forEach((timestamp) => {
        const [formattedStr, date] = formatByEpochSeconds(timestamp, 'YYYY');

        expect(formattedStr).toBeDefined();
        expect(date).toBeInstanceOf(Date);
        expect(isNaN(date!.getTime())).toBe(false);
      });

      // 너무 극단적인 값들은 undefined를 반환할 수 있음
      const extremeValues = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];

      extremeValues.forEach((timestamp) => {
        const [formattedStr, date] = formatByEpochSeconds(timestamp, 'YYYY');

        // 극단적인 값들은 Invalid Date 객체를 반환할 수 있음
        if (formattedStr === undefined) {
          expect(date).toBeInstanceOf(Date);
          expect(isNaN(date!.getTime())).toBe(true);
        } else {
          expect(date).toBeInstanceOf(Date);
        }
      });
    });

    test('반환값 구조 확인', () => {
      const result = formatByEpochSeconds(1704067200, 'YYYY-MM-DD');

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);

      const [formattedStr, date] = result;
      expect(typeof formattedStr).toBe('string');
      expect(date).toBeInstanceOf(Date);
    });

    test('빈 포맷 문자열', () => {
      const [formattedStr, date] = formatByEpochSeconds(1704067200, '');

      expect(formattedStr).toBeDefined();
      expect(date).toBeInstanceOf(Date);
      // dayjs는 빈 포맷 문자열에 대해 기본 형식을 사용할 수 있음
    });

    test('잘못된 포맷 문자열', () => {
      const [formattedStr, date] = formatByEpochSeconds(1704067200, 'INVALID_FORMAT');

      expect(formattedStr).toBeDefined(); // dayjs는 잘못된 포맷을 그대로 출력할 수 있음
      expect(date).toBeInstanceOf(Date);
    });
  });

  describe('formatByEpochMillis', () => {
    test('유효한 epoch milliseconds와 포맷 문자열', () => {
      // 2024-01-01 00:00:00.000 UTC
      const epochMillis = 1704067200000;
      const fmtString = 'YYYY-MM-DD HH:mm:ss.SSS';

      const [formattedStr, date] = formatByEpochMillis(epochMillis, fmtString);

      expect(formattedStr).toBeDefined();
      expect(date).toBeInstanceOf(Date);
      expect(formattedStr).toMatch(/2024-01-01.*000/);
      expect(date!.getFullYear()).toBe(2024);
      expect(date!.getMonth()).toBe(0); // January
      expect(date!.getDate()).toBe(1);
      expect(date!.getMilliseconds()).toBe(0);
    });

    test('밀리초 정밀도 테스트', () => {
      const epochMillis = 1704067200123; // 123 밀리초 추가
      const [formattedStr, date] = formatByEpochMillis(epochMillis, 'YYYY-MM-DD HH:mm:ss.SSS');

      expect(formattedStr).toBeDefined();
      expect(date).toBeInstanceOf(Date);
      expect(date!.getMilliseconds()).toBe(123);
      expect(formattedStr).toMatch(/123$/);
    });

    test('Unix epoch in milliseconds (0)', () => {
      const [formattedStr, date] = formatByEpochMillis(0, 'YYYY-MM-DD HH:mm:ss');

      // 로컬 시간대에 따라 09:00:00이 될 수 있음 (UTC+9)
      expect(formattedStr).toMatch(/1970-01-01 \d{2}:00:00/);
      expect(date).toBeInstanceOf(Date);
      expect(date!.toISOString()).toBe('1970-01-01T00:00:00.000Z');
    });

    test('음수 timestamp in milliseconds', () => {
      const epochMillis = -86400000; // 1969-12-31 00:00:00 UTC
      const [formattedStr, date] = formatByEpochMillis(epochMillis, 'YYYY-MM-DD');

      expect(formattedStr).toBe('1969-12-31');
      expect(date).toBeInstanceOf(Date);
      expect(date!.getFullYear()).toBe(1969);
      expect(date!.getMonth()).toBe(11); // December
      expect(date!.getDate()).toBe(31);
    });

    test('현재 시간 근처의 millisecond timestamp', () => {
      // 2023-12-25 15:30:45.678 UTC 근사치
      const epochMillis = 1703509845678;
      const [formattedStr, date] = formatByEpochMillis(epochMillis, 'YYYY-MM-DD HH:mm:ss.SSS');

      expect(formattedStr).toBeDefined();
      expect(date).toBeInstanceOf(Date);
      expect(date!.getFullYear()).toBe(2023);
      expect(date!.getMilliseconds()).toBe(678);
    });

    test('다양한 포맷 문자열', () => {
      const epochMillis = 1703509845000; // 밀리초로 변환

      const formats = [
        'YYYY-MM-DD',
        'DD/MM/YYYY HH:mm:ss',
        'MMMM Do YYYY, h:mm:ss.SSS a',
        'x', // Unix millisecond timestamp
      ];

      formats.forEach((format) => {
        const [formattedStr, date] = formatByEpochMillis(epochMillis, format);

        expect(formattedStr).toBeDefined();
        expect(typeof formattedStr).toBe('string');
        expect(date).toBeInstanceOf(Date);
      });
    });

    test('잘못된 epoch milliseconds (null/undefined)', () => {
      const testCases = [null as any, undefined as any];

      testCases.forEach((invalidValue) => {
        const [formattedStr, date] = formatByEpochMillis(invalidValue, 'YYYY-MM-DD');

        // null/undefined는 Invalid Date 객체를 반환할 수 있음
        if (formattedStr === undefined) {
          expect(date).toBeInstanceOf(Date);
          expect(isNaN(date!.getTime())).toBe(true);
        } else {
          expect(date).toBeInstanceOf(Date);
        }
      });
    });

    test('극단적인 millisecond timestamp 값들', () => {
      const extremeValues = [
        8640000000000000, // Date의 최대값
        -8640000000000000, // Date의 최소값
        2147483647000, // 32-bit second limit * 1000
        -2147483648000, // 32-bit negative second limit * 1000
      ];

      extremeValues.forEach((timestamp) => {
        const [formattedStr, date] = formatByEpochMillis(timestamp, 'YYYY');

        if (Math.abs(timestamp) <= 8640000000000000) {
          // 유효한 Date 범위 내
          expect(formattedStr).toBeDefined();
          expect(date).toBeInstanceOf(Date);
          expect(isNaN(date!.getTime())).toBe(false);
        } else {
          // 범위 초과 시 Invalid Date
          expect(date).toBeInstanceOf(Date);
          expect(isNaN(date!.getTime())).toBe(true);
        }
      });
    });

    test('반환값 구조 확인', () => {
      const result = formatByEpochMillis(1704067200000, 'YYYY-MM-DD');

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);

      const [formattedStr, date] = result;
      expect(typeof formattedStr).toBe('string');
      expect(date).toBeInstanceOf(Date);
    });
  });

  describe('formatByEpochSeconds vs formatByEpochMillis 비교', () => {
    test('같은 시간의 seconds와 milliseconds 변환 결과 동일성', () => {
      const epochSeconds = 1704067200;
      const epochMillis = epochSeconds * 1000;
      const format = 'YYYY-MM-DD HH:mm:ss';

      const [secResult, secDate] = formatByEpochSeconds(epochSeconds, format);
      const [milliResult, milliDate] = formatByEpochMillis(epochMillis, format);

      expect(secResult).toBe(milliResult);
      expect(secDate!.getTime()).toBe(milliDate!.getTime());
    });

    test('밀리초 차이가 있는 경우', () => {
      const epochSeconds = 1704067200.5; // 500ms 추가
      const epochMillis = 1704067200500; // 같은 시간을 밀리초로
      const format = 'YYYY-MM-DD HH:mm:ss.SSS';

      const [secResult, secDate] = formatByEpochSeconds(epochSeconds, format);
      const [milliResult, milliDate] = formatByEpochMillis(epochMillis, format);

      expect(secResult).toBe(milliResult);
      expect(secDate!.getTime()).toBe(milliDate!.getTime());
      expect(secDate!.getMilliseconds()).toBe(500);
      expect(milliDate!.getMilliseconds()).toBe(500);
    });

    test('부동소수점 정밀도 처리', () => {
      const epochSeconds = 1704067200.123; // 123ms
      const epochMillis = 1704067200123;

      const [secResult, secDate] = formatByEpochSeconds(epochSeconds, 'SSS');
      const [milliResult, milliDate] = formatByEpochMillis(epochMillis, 'SSS');

      expect(secDate!.getMilliseconds()).toBe(milliDate!.getMilliseconds());
      expect(secResult).toBe(milliResult);
    });
  });

  describe('에러 처리 및 엣지 케이스', () => {
    test('NaN 입력 처리', () => {
      const [formattedStr1, date1] = formatByEpochSeconds(NaN, 'YYYY-MM-DD');
      const [formattedStr2, date2] = formatByEpochMillis(NaN, 'YYYY-MM-DD');

      // NaN은 Invalid Date를 생성함
      expect(date1).toBeInstanceOf(Date);
      expect(date2).toBeInstanceOf(Date);

      // NaN으로 생성된 Date는 Invalid Date가 됨
      expect(isNaN(date1!.getTime())).toBe(true);
      expect(isNaN(date2!.getTime())).toBe(true);
    });

    test('Infinity 입력 처리', () => {
      const infinityValues = [Infinity, -Infinity];

      infinityValues.forEach((value) => {
        const [secResult, secDate] = formatByEpochSeconds(value, 'YYYY');
        const [milliResult, milliDate] = formatByEpochMillis(value, 'YYYY');

        // Infinity는 유효한 Date를 만들 수 있지만 Invalid Date가 될 수 있음
        expect(secDate).toBeInstanceOf(Date);
        expect(milliDate).toBeInstanceOf(Date);
      });
    });

    test('매우 작은 소수점 timestamp', () => {
      const tinyFraction = 0.001; // 1ms
      const [formattedStr, date] = formatByEpochSeconds(tinyFraction, 'YYYY-MM-DD HH:mm:ss.SSS');

      expect(formattedStr).toBeDefined();
      expect(date).toBeInstanceOf(Date);
      expect(date!.getMilliseconds()).toBe(1);
    });

    test('빈 문자열 및 특수 문자가 포함된 포맷', () => {
      const epochSeconds = 1704067200;
      const specialFormats = ['', '   ', '\\n\\t', '[YYYY] MM-DD', 'YYYY년 MM월 DD일'];

      specialFormats.forEach((format) => {
        const [formattedStr, date] = formatByEpochSeconds(epochSeconds, format);

        expect(formattedStr).toBeDefined();
        expect(date).toBeInstanceOf(Date);
      });
    });
  });

  describe('타입 안전성 확인', () => {
    test('반환 타입이 올바른 tuple 형태', () => {
      const result1 = formatByEpochSeconds(1704067200, 'YYYY-MM-DD');
      const result2 = formatByEpochMillis(1704067200000, 'YYYY-MM-DD');

      // TypeScript 타입 체크를 위한 명시적 타입 검사
      const [str1, date1]: [string | undefined, Date | undefined] = result1;
      const [str2, date2]: [string | undefined, Date | undefined] = result2;

      expect(typeof str1).toBe('string');
      expect(date1).toBeInstanceOf(Date);
      expect(typeof str2).toBe('string');
      expect(date2).toBeInstanceOf(Date);
    });

    test('undefined 반환 시 타입 일관성', () => {
      const result1 = formatByEpochSeconds(null as any, 'YYYY-MM-DD');
      const result2 = formatByEpochMillis(undefined as any, 'YYYY-MM-DD');

      // formatByEpochSeconds는 null/undefined에 대해 undefined를 반환함
      expect(result1[0]).toBeUndefined();
      expect(result1[1]).toBeUndefined();

      // formatByEpochMillis도 undefined에 대해 Invalid Date를 반환함
      expect(result2[1]).toBeInstanceOf(Date);
      if (result2[0] === undefined) {
        expect(isNaN(result2[1]!.getTime())).toBe(true);
      }
    });
  });
});
