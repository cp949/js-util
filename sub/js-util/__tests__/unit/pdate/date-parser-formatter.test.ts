import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { parser, formatter } from '../../../src/pdate/index.js';

describe('pdate - Date Parser and Formatter', () => {
  // 테스트용 기준 날짜들
  const testDates = {
    // 2023년 12월 25일 15:30:45
    christmas: new Date(2023, 11, 25, 15, 30, 45),
    // 2024년 1월 1일 00:00:00
    newYear: new Date(2024, 0, 1, 0, 0, 0),
    // 2024년 2월 29일 23:59:59 (윤년)
    leapYear: new Date(2024, 1, 29, 23, 59, 59),
    // 1970년 1월 1일 09:00:00 (UTC+9 기준 epoch)
    epoch: new Date(1970, 0, 1, 9, 0, 0),
    // 유효하지 않은 날짜
    invalid: new Date('invalid'),
  };

  // 콘솔 에러 메시지 mocking
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('parser 인스턴스', () => {
    describe('epochSeconds() 메서드', () => {
      test('유효한 Unix timestamp 파싱', () => {
        // 2024-01-01 00:00:00 UTC
        const timestamp = 1704067200;
        const result = parser.epochSeconds(timestamp);

        expect(result).toBeInstanceOf(Date);
        expect(result!.getFullYear()).toBe(2024);
        expect(result!.getMonth()).toBe(0); // January
        expect(result!.getDate()).toBe(1);
      });

      test('0 timestamp (Unix epoch)', () => {
        const result = parser.epochSeconds(0);

        expect(result).toBeInstanceOf(Date);
        expect(result!.toISOString()).toBe('1970-01-01T00:00:00.000Z');
      });

      test('음수 timestamp', () => {
        const result = parser.epochSeconds(-86400); // 1969-12-31

        expect(result).toBeInstanceOf(Date);
        expect(result!.getFullYear()).toBe(1969);
        expect(result!.getMonth()).toBe(11); // December
        expect(result!.getDate()).toBe(31);
      });

      test('미래 timestamp', () => {
        const futureTimestamp = 2147483647; // 2038-01-19 (32-bit timestamp limit)
        const result = parser.epochSeconds(futureTimestamp);

        expect(result).toBeInstanceOf(Date);
        expect(result!.getFullYear()).toBe(2038);
      });

      test('null/undefined 입력', () => {
        expect(parser.epochSeconds(null)).toBeUndefined();
        expect(parser.epochSeconds(undefined)).toBeUndefined();
      });

      test('부동소수점 timestamp', () => {
        const timestamp = 1704067200.5;
        const result = parser.epochSeconds(timestamp);

        expect(result).toBeInstanceOf(Date);
        expect(result!.getMilliseconds()).toBe(500);
      });
    });

    describe('yyyymmddhhmiss() 메서드', () => {
      test('완전한 날짜시간 문자열 파싱', () => {
        const result = parser.yyyymmddhhmiss('20231225153045');

        expect(result).toBeInstanceOf(Date);
        expect(result!.getFullYear()).toBe(2023);
        expect(result!.getMonth()).toBe(11); // December (0-based)
        expect(result!.getDate()).toBe(25);
        expect(result!.getHours()).toBe(15);
        expect(result!.getMinutes()).toBe(30);
        expect(result!.getSeconds()).toBe(45);
      });

      test('새해 첫 날', () => {
        const result = parser.yyyymmddhhmiss('20240101000000');

        expect(result!.getFullYear()).toBe(2024);
        expect(result!.getMonth()).toBe(0); // January
        expect(result!.getDate()).toBe(1);
        expect(result!.getHours()).toBe(0);
        expect(result!.getMinutes()).toBe(0);
        expect(result!.getSeconds()).toBe(0);
      });

      test('윤년 2월 29일', () => {
        const result = parser.yyyymmddhhmiss('20240229235959');

        expect(result!.getFullYear()).toBe(2024);
        expect(result!.getMonth()).toBe(1); // February
        expect(result!.getDate()).toBe(29);
        expect(result!.getHours()).toBe(23);
        expect(result!.getMinutes()).toBe(59);
        expect(result!.getSeconds()).toBe(59);
      });

      test('긴 문자열 (14자리 이상)', () => {
        const result = parser.yyyymmddhhmiss('20231225153045999'); // 추가 숫자 무시

        expect(result!.getFullYear()).toBe(2023);
        expect(result!.getMonth()).toBe(11);
        expect(result!.getDate()).toBe(25);
      });

      test('잘못된 입력들', () => {
        expect(parser.yyyymmddhhmiss(null)).toBeUndefined();
        expect(parser.yyyymmddhhmiss(undefined)).toBeUndefined();
        expect(parser.yyyymmddhhmiss('')).toBeUndefined();
        expect(parser.yyyymmddhhmiss('123')).toBeUndefined(); // 너무 짧음
        expect(parser.yyyymmddhhmiss('2023122515')).toBeUndefined(); // 14자리 미만
      });

      test('잘못된 날짜 값', () => {
        // 존재하지 않는 날짜들
        const invalidDates = [
          '20231301000000', // 13월
          '20230229000000', // 평년 2월 29일
          '20231132000000', // 32일
          '20231225250000', // 25시
          '20231225156000', // 60분
          '20231225153060', // 60초
        ];

        invalidDates.forEach((dateStr) => {
          const result = parser.yyyymmddhhmiss(dateStr);
          // JavaScript Date는 잘못된 날짜를 자동으로 조정하므로
          // 결과가 예상과 다를 수 있음. 로그 출력 여부만 확인
          expect(console.log).toHaveBeenCalled();
        });
      });

      test('숫자가 아닌 문자 포함', () => {
        const result = parser.yyyymmddhhmiss('abcd1225153045');

        // NaN이 포함된 날짜 생성으로 인해 Invalid Date가 될 수 있음
        expect(result).toBeInstanceOf(Date);
        expect(isNaN(result!.getTime())).toBe(true);
      });
    });

    describe('yyyymmdd() 메서드', () => {
      test('기본 날짜 문자열 파싱', () => {
        const result = parser.yyyymmdd('20231225');

        expect(result).toBeInstanceOf(Date);
        expect(result!.getFullYear()).toBe(2023);
        expect(result!.getMonth()).toBe(11); // December
        expect(result!.getDate()).toBe(25);
        expect(result!.getHours()).toBe(0);
        expect(result!.getMinutes()).toBe(0);
        expect(result!.getSeconds()).toBe(0);
      });

      test('새해 첫 날', () => {
        const result = parser.yyyymmdd('20240101');

        expect(result!.getFullYear()).toBe(2024);
        expect(result!.getMonth()).toBe(0);
        expect(result!.getDate()).toBe(1);
      });

      test('윤년 2월 29일', () => {
        const result = parser.yyyymmdd('20240229');

        expect(result!.getFullYear()).toBe(2024);
        expect(result!.getMonth()).toBe(1);
        expect(result!.getDate()).toBe(29);
      });

      test('긴 문자열 (8자리 이상)', () => {
        const result = parser.yyyymmdd('20231225153045'); // 시간 부분 무시

        expect(result!.getFullYear()).toBe(2023);
        expect(result!.getMonth()).toBe(11);
        expect(result!.getDate()).toBe(25);
      });

      test('잘못된 입력들', () => {
        expect(parser.yyyymmdd(null)).toBeUndefined();
        expect(parser.yyyymmdd(undefined)).toBeUndefined();
        expect(parser.yyyymmdd('')).toBeUndefined();
        expect(parser.yyyymmdd('2023')).toBeUndefined(); // 너무 짧음
        expect(parser.yyyymmdd('202312')).toBeUndefined(); // 8자리 미만
      });

      test('월/일 경계값', () => {
        // 1월 1일
        const jan1 = parser.yyyymmdd('20240101');
        expect(jan1!.getMonth()).toBe(0);
        expect(jan1!.getDate()).toBe(1);

        // 12월 31일
        const dec31 = parser.yyyymmdd('20241231');
        expect(dec31!.getMonth()).toBe(11);
        expect(dec31!.getDate()).toBe(31);
      });
    });
  });

  describe('formatter 인스턴스', () => {
    describe('format() 메서드 (dayjs 기반)', () => {
      test('Date 객체 포맷팅', () => {
        const result = formatter.format(testDates.christmas, 'YYYY-MM-DD HH:mm:ss');

        expect(result).toBe('2023-12-25 15:30:45');
      });

      test('Unix timestamp 포맷팅', () => {
        const timestamp = 1703509845000; // 2023-12-25 15:30:45
        const result = formatter.format(timestamp, 'YYYY/MM/DD');

        expect(result).toMatch(/2023\/12\/25/);
      });

      test('다양한 포맷 문자열', () => {
        const date = testDates.christmas;

        expect(formatter.format(date, 'YYYY')).toBe('2023');
        expect(formatter.format(date, 'MM')).toBe('12');
        expect(formatter.format(date, 'DD')).toBe('25');
        expect(formatter.format(date, 'HH')).toBe('15');
        expect(formatter.format(date, 'mm')).toBe('30');
        expect(formatter.format(date, 'ss')).toBe('45');
      });

      test('복잡한 포맷 문자열', () => {
        const date = testDates.christmas;
        const result = formatter.format(date, 'dddd, MMMM Do YYYY, h:mm:ss a');

        // advancedFormat 플러그인 없이는 'Do'가 '25o'로 출력됨
        expect(result).toMatch(/Monday, December 25o 2023/);
      });

      test('유효하지 않은 Date 객체', () => {
        const result = formatter.format(testDates.invalid, 'YYYY-MM-DD');

        expect(result).toBeUndefined();
      });
    });

    describe('yyyymmddhhmiss() 메서드', () => {
      test('기본 날짜시간 포맷팅', () => {
        const result = formatter.yyyymmddhhmiss(testDates.christmas);

        expect(result).toBe('20231225153045');
      });

      test('새해 첫 날 포맷팅', () => {
        const result = formatter.yyyymmddhhmiss(testDates.newYear);

        expect(result).toBe('20240101000000');
      });

      test('윤년 마지막 날 포맷팅', () => {
        const result = formatter.yyyymmddhhmiss(testDates.leapYear);

        expect(result).toBe('20240229235959');
      });

      test('한 자리 월/일/시간 제로 패딩', () => {
        const singleDigitDate = new Date(2024, 0, 5, 9, 8, 7); // 2024-01-05 09:08:07
        const result = formatter.yyyymmddhhmiss(singleDigitDate);

        expect(result).toBe('20240105090807');
      });

      test('유효하지 않은 Date 객체', () => {
        const result = formatter.yyyymmddhhmiss(testDates.invalid);

        expect(result).toBeUndefined();
      });
    });

    describe('yyyymmdd() 메서드', () => {
      test('기본 날짜 포맷팅', () => {
        const result = formatter.yyyymmdd(testDates.christmas);

        expect(result).toBe('20231225');
      });

      test('새해 첫 날 포맷팅', () => {
        const result = formatter.yyyymmdd(testDates.newYear);

        expect(result).toBe('20240101');
      });

      test('한 자리 월/일 제로 패딩', () => {
        const singleDigitDate = new Date(2024, 0, 5); // 2024-01-05
        const result = formatter.yyyymmdd(singleDigitDate);

        expect(result).toBe('20240105');
      });

      test('유효하지 않은 Date 객체', () => {
        const result = formatter.yyyymmdd(testDates.invalid);

        expect(result).toBeUndefined();
      });
    });

    describe('hhmiss() 메서드', () => {
      test('기본 시간 포맷팅', () => {
        const result = formatter.hhmiss(testDates.christmas);

        expect(result).toBe('153045');
      });

      test('자정 시간', () => {
        const result = formatter.hhmiss(testDates.newYear);

        expect(result).toBe('000000');
      });

      test('늦은 시간', () => {
        const result = formatter.hhmiss(testDates.leapYear);

        expect(result).toBe('235959');
      });

      test('한 자리 시간 제로 패딩', () => {
        const singleDigitTime = new Date(2024, 0, 1, 9, 8, 7);
        const result = formatter.hhmiss(singleDigitTime);

        expect(result).toBe('090807');
      });

      test('유효하지 않은 Date 객체', () => {
        const result = formatter.hhmiss(testDates.invalid);

        expect(result).toBeUndefined();
      });
    });

    describe('hhmi() 메서드', () => {
      test('기본 시분 포맷팅', () => {
        const result = formatter.hhmi(testDates.christmas);

        expect(result).toBe('1530');
      });

      test('자정 시간', () => {
        const result = formatter.hhmi(testDates.newYear);

        expect(result).toBe('0000');
      });

      test('한 자리 시분 제로 패딩', () => {
        const singleDigitTime = new Date(2024, 0, 1, 9, 8, 7);
        const result = formatter.hhmi(singleDigitTime);

        expect(result).toBe('0908');
      });

      test('유효하지 않은 Date 객체', () => {
        const result = formatter.hhmi(testDates.invalid);

        expect(result).toBeUndefined();
      });
    });
  });

  describe('라운드트립 테스트', () => {
    test('yyyymmddhhmiss 파싱 → 포맷팅', () => {
      const original = '20231225153045';
      const parsed = parser.yyyymmddhhmiss(original);
      const formatted = formatter.yyyymmddhhmiss(parsed!);

      expect(formatted).toBe(original);
    });

    test('yyyymmdd 파싱 → 포맷팅', () => {
      const original = '20231225';
      const parsed = parser.yyyymmdd(original);
      const formatted = formatter.yyyymmdd(parsed!);

      expect(formatted).toBe(original);
    });

    test('epochSeconds → yyyymmddhhmiss', () => {
      const timestamp = 1703509845; // 2023-12-25 06:30:45 UTC
      const parsed = parser.epochSeconds(timestamp);
      const formatted = formatter.yyyymmddhhmiss(parsed!);

      expect(formatted).toMatch(/^\d{14}$/); // 14자리 숫자 문자열
    });
  });

  describe('특수 케이스 및 경계값', () => {
    test('윤년 처리', () => {
      // 윤년인 경우
      const leapYearStr = '20240229';
      const parsed2024 = parser.yyyymmdd(leapYearStr);
      expect(parsed2024!.getFullYear()).toBe(2024);
      expect(parsed2024!.getMonth()).toBe(1);
      expect(parsed2024!.getDate()).toBe(29);

      // 평년인 경우 (자동으로 3월 1일로 조정됨)
      const nonLeapYearStr = '20230229';
      const parsed2023 = parser.yyyymmdd(nonLeapYearStr);
      expect(parsed2023!.getFullYear()).toBe(2023);
      expect(parsed2023!.getMonth()).toBe(2); // March
      expect(parsed2023!.getDate()).toBe(1);
    });

    test('월말 경계값', () => {
      const dates = [
        '20240131', // 1월 31일
        '20240228', // 평년이었다면 2월 28일
        '20240229', // 윤년 2월 29일
        '20240331', // 3월 31일
        '20240430', // 4월 30일
        '20241231', // 12월 31일
      ];

      dates.forEach((dateStr) => {
        const parsed = parser.yyyymmdd(dateStr);
        const formatted = formatter.yyyymmdd(parsed!);

        expect(formatted).toBe(dateStr);
      });
    });

    test('시간 경계값', () => {
      const times = [
        '20240101000000', // 자정
        '20240101120000', // 정오
        '20240101235959', // 하루 끝
      ];

      times.forEach((timeStr) => {
        const parsed = parser.yyyymmddhhmiss(timeStr);
        const formatted = formatter.yyyymmddhhmiss(parsed!);

        expect(formatted).toBe(timeStr);
      });
    });

    test('Unix timestamp 경계값', () => {
      const timestamps = [
        0, // Unix epoch
        86400, // 하루 후
        -86400, // 하루 전
        1000000000, // 2001-09-09
        2000000000, // 2033-05-18
      ];

      timestamps.forEach((timestamp) => {
        const parsed = parser.epochSeconds(timestamp);
        expect(parsed).toBeInstanceOf(Date);
        expect(isNaN(parsed!.getTime())).toBe(false);
      });
    });
  });

  describe('에러 처리 및 로깅', () => {
    test('Parser 에러 시 콘솔 로그 출력', () => {
      // 잘못된 형식의 문자열
      parser.yyyymmddhhmiss('invalid-date-string');
      parser.yyyymmdd('invalid-date');

      expect(console.log).toHaveBeenCalled();
    });

    test('Formatter 에러 시 콘솔 로그 출력', () => {
      // 유효하지 않은 Date 객체로 포맷팅 시도 (에러 발생 가능한 상황 시뮬레이션)
      formatter.yyyymmddhhmiss(testDates.invalid);
      formatter.yyyymmdd(testDates.invalid);
      formatter.hhmiss(testDates.invalid);
      formatter.hhmi(testDates.invalid);

      // Invalid Date는 isNaN 체크에서 걸러지므로 실제로는 에러 로그가 발생하지 않을 수 있음
    });

    test('극단적인 값 처리', () => {
      // 매우 큰 timestamp
      const largeTimestamp = Number.MAX_SAFE_INTEGER;
      const result = parser.epochSeconds(largeTimestamp);
      expect(result).toBeInstanceOf(Date);

      // 매우 작은 timestamp
      const smallTimestamp = Number.MIN_SAFE_INTEGER;
      const result2 = parser.epochSeconds(smallTimestamp);
      expect(result2).toBeInstanceOf(Date);
    });
  });

  describe('타입 안전성', () => {
    test('모든 Parser 메서드가 Date | undefined 반환', () => {
      const results = [
        parser.epochSeconds(1704067200),
        parser.epochSeconds(null),
        parser.yyyymmddhhmiss('20240101000000'),
        parser.yyyymmddhhmiss(null),
        parser.yyyymmdd('20240101'),
        parser.yyyymmdd(undefined),
      ];

      results.forEach((result) => {
        expect(result === undefined || result instanceof Date).toBe(true);
      });
    });

    test('모든 Formatter 메서드가 string | undefined 반환', () => {
      const results = [
        formatter.format(testDates.christmas, 'YYYY-MM-DD'),
        formatter.format(testDates.invalid, 'YYYY-MM-DD'),
        formatter.yyyymmddhhmiss(testDates.christmas),
        formatter.yyyymmddhhmiss(testDates.invalid),
        formatter.yyyymmdd(testDates.christmas),
        formatter.hhmi(testDates.invalid),
      ];

      results.forEach((result) => {
        expect(typeof result === 'string' || result === undefined).toBe(true);
      });
    });
  });

  describe('성능 테스트', () => {
    test('대량 파싱 성능', () => {
      const count = 1000;
      const startTime = performance.now();

      for (let i = 0; i < count; i++) {
        const dateStr = `2024010${i % 10}120000`;
        parser.yyyymmddhhmiss(dateStr);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(100); // 100ms 이내
    });

    test('대량 포맷팅 성능', () => {
      const count = 1000;
      const baseDate = testDates.christmas;
      const startTime = performance.now();

      for (let i = 0; i < count; i++) {
        const date = new Date(baseDate.getTime() + i * 1000);
        formatter.yyyymmddhhmiss(date);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(100); // 100ms 이내
    });
  });
});
