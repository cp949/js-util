/**
 * 주어진 문자열이 유효한 dataURL인지 검사합니다.
 * data:로 시작하고 MIME 타입 및 인코딩 형식이 있는지 검사.
 *
 * @param dataURL - dataURL
 * @returns
 */
export function isValidDataURL(dataURL: string): boolean {
  if (typeof dataURL !== 'string' || !dataURL.startsWith('data:')) return false;

  const commaIndex = dataURL.indexOf(',');
  if (commaIndex === -1) return false;

  const headerPart = dataURL.slice(5, commaIndex); // "data:" 이후부터 ","까지

  // 빈 헤더도 유효 (기본적으로 text/plain으로 해석됨)
  if (headerPart.length === 0) return true;

  // MIME 타입 형식 검증: type/subtype (필수) + 파라미터 (선택)
  const parts = headerPart.split(';');
  const mimeType = parts[0].trim();

  // 첫 번째 부분이 빈 문자열이면 무효 (예: data:;base64,)
  if (!mimeType) return false;

  // MIME 타입이 type/subtype 형식인지 검사 (RFC 2045에 따라 + 기호도 허용)
  const mimeTypePattern =
    /^[a-zA-Z][a-zA-Z0-9][a-zA-Z0-9!#$&\-^_+]*\/[a-zA-Z0-9][a-zA-Z0-9!#$&\-^_+]*$/;
  if (!mimeTypePattern.test(mimeType)) return false;

  // 파라미터들 검사 (선택사항)
  for (let i = 1; i < parts.length; i++) {
    const param = parts[i].trim();

    // base64 지시자는 특별히 허용
    if (param === 'base64') continue;

    // 다른 파라미터는 key=value 형식이어야 함
    const paramPattern = /^[a-zA-Z0-9\-_]+=(?:[a-zA-Z0-9\-_]+|"[^"]*")$/;
    if (!paramPattern.test(param)) return false;
  }

  return true;
}
