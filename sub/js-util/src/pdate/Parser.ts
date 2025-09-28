import dayjs from 'dayjs';

export class Parser {
  /**
   * Unix epoch seconds 를 파싱하여 Date 객체로 리턴
   *
   * @param seconds Unix epoch seconds
   * @returns 파싱 결과 Date 객체
   */
  static epochSeconds(seconds: number | undefined | null): Date | undefined {
    if (typeof seconds === 'undefined' || seconds === null) return undefined;
    return dayjs.unix(seconds).toDate();
  }

  /**
   * yyyymmddhhmiss 형태의 문자열을 파싱하여 Date 객체로 리턴
   *
   * @param dateStr yyyymmddhhmiss 문자열
   * @returns 파싱 결과 Date 객체
   */
  static yyyymmddhhmiss(dateStr: string | null | undefined): Date | undefined {
    if (!dateStr || dateStr.length < 14) return undefined;
    try {
      const yyyy = +dateStr.substring(0, 4);
      const mm = +dateStr.substring(4, 6) - 1;
      const dd = +dateStr.substring(6, 8);
      const hh = +dateStr.substring(8, 10);
      const mi = +dateStr.substring(10, 12);
      const ss = +dateStr.substring(12, 14);
      
      const date = new Date(yyyy, mm, dd, hh, mi, ss);
      
      // NaN 체크 또는 유효 범위 검증 후 로그 출력
      if (isNaN(yyyy) || isNaN(mm) || isNaN(dd) || isNaN(hh) || isNaN(mi) || isNaN(ss)) {
        console.log(`Invalid date values: ${dateStr}`);
      } else if (mm < 0 || mm > 11 || dd < 1 || dd > 31 || hh < 0 || hh > 23 || mi < 0 || mi > 59 || ss < 0 || ss > 59) {
        console.log(`Date out of range: ${dateStr}`);
      } else if (date.getFullYear() !== yyyy || date.getMonth() !== mm || date.getDate() !== dd) {
        // Date 객체가 유효한지 확인 (잘못된 날짜는 자동 조정됨)
        console.log(`Date auto-corrected: ${dateStr}`);
      }
      
      return date;
    } catch (e) {
      console.log(`Date parsing error: ${dateStr}`, e);
      return undefined;
    }
  }

  /**
   * yyyymmdd 형태의 문자열을 파싱하여 Date 객체로 리턴
   *
   * @param dateStr yyyymmdd 형태의 문자열
   * @returns 파싱 결과 Date 객체
   */
  static yyyymmdd(dateStr: string | null | undefined): Date | undefined {
    if (!dateStr || dateStr.length < 8) return undefined;
    try {
      const yyyy = +dateStr.substring(0, 4);
      const mm = +dateStr.substring(4, 6) - 1;
      const dd = +dateStr.substring(6, 8);

      const date = new Date(yyyy, mm, dd, 0, 0, 0);
      
      // NaN 체크 또는 유효 범위 검증 후 로그 출력
      if (isNaN(yyyy) || isNaN(mm) || isNaN(dd)) {
        console.log(`Invalid date values: ${dateStr}`);
      } else if (mm < 0 || mm > 11 || dd < 1 || dd > 31) {
        console.log(`Date out of range: ${dateStr}`);
      } else if (date.getFullYear() !== yyyy || date.getMonth() !== mm || date.getDate() !== dd) {
        // Date 객체가 유효한지 확인 (잘못된 날짜는 자동 조정됨)
        console.log(`Date auto-corrected: ${dateStr}`);
      }

      return date;
    } catch (e) {
      console.log(`Date parsing error: ${dateStr}`, e);
      return undefined;
    }
  }
}
