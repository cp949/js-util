/**
 * JSON.stringify()의 커스텀 버전
 * Infinity/NaN을 null 대신 0으로 설정한다.
 * @param obj 대상 객체
 * @returns JSON 문자열
 */
export function stringify(obj: any): string {
  return JSON.stringify(obj, (_key, value) => {
    if (typeof value === 'number' && (value === Infinity || value === -Infinity || isNaN(value))) {
      return 0;
    }
    return value;
  });
}
