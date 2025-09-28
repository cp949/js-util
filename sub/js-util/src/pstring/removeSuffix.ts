/**
 * 문자열의 끝부분이 suffix인 경우 제거한다.
 * 문자열의 끝부분이 suffix가 아닌 경우 원본 문자열을 리턴한다.
 *
 * @param str 대상 문자열
 * @param suffix - 제거할 문자열
 * @param repeat - 반복적으로 제거할지 여부
 * @returns suffix가 제거된 문자열
 */
export function removeSuffix(str: string, suffix: string, repeat = false): string {
  if (str.length === 0 || suffix.length === 0) {
    return str;
  }

  if (repeat) {
    let s = str;
    while (s.endsWith(suffix)) {
      s = s.substring(0, s.length - suffix.length);
    }
    return s;
  }

  if (str.endsWith(suffix)) {
    return str.substring(0, str.length - suffix.length);
  }
  return str;
}
