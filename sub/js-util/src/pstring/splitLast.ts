/**
 * 문자열을 마지막으로 발견된 구분자로 split 한다.
 *
 * @param text - 대상 문자열
 * @param separator - 구분자
 * @returns 분리된 두 개의 문자열을 크기가 2인 배열로 리턴한다. 구분자가 발견되지 않으면 배열의 두번째 요소는 null이다.
 * @example
 * splitLast('foo.tar.gz', '.') ==> ['foo.tar', 'gz']
 * splitLast('foo', '.') => ['foo', null]
 * splitLast('foo.', '.') => ['foo', '']
 */
export function splitLast(text: string, separator: string): [string, string | null] {
  const index = text.lastIndexOf(separator);
  if (index >= 0) {
    return [text.substring(0, index), text.substring(index + 1)];
  }
  return [text, null];
}
