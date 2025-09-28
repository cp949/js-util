/**
 * 문자열의 앞부분이 prefix인 경우 제거한다.
 * 문자열의 앞부분이 prefix가 아닌 경우 원본 문자열을 리턴한다.
 *
 * @param str - 대상 문자열
 * @param prefix - 제거할 문자열
 * @param repeat - 반복적으로 제거할지 여부
 * @returns prefix가 제거된 문자열
 */
export function removePrefix(str: string, prefix: string, repeat = false): string {
  if (str.length === 0 || prefix.length === 0) {
    return str;
  }

  if (repeat) {
    let s = str;
    while (s.startsWith(prefix)) {
      s = s.substring(prefix.length);
    }
    return s;
  }

  if (str.startsWith(prefix)) {
    return str.substring(prefix.length);
  }
  return str;
}
