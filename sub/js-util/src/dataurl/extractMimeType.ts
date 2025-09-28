/*
// 테스트 예시들
console.log(extractMimeType("data:image/png;base64,..."));  // "image/png"
console.log(extractMimeType("data:image/jpeg;..."));       // "image/jpeg"
console.log(extractMimeType("data:;base64,..."));          // undefined (MIME 타입 없음)
console.log(extractMimeType("data:,base64,..."));          // undefined (MIME 타입 없음)
console.log(extractMimeType("data:image/png"));            // undefined (잘못된 포맷)
console.log(extractMimeType("not-a-data-url"));            // undefined (잘못된 포맷)
console.log(extractMimeType(""));                          // undefined (빈 문자열)

*/
export function extractMimeType(dataURL: string): string | undefined {
  // 입력 검증
  if (typeof dataURL !== 'string' || !dataURL) {
    return undefined;
  }

  // "data:"로 시작하는지 확인
  if (!dataURL.startsWith('data:')) {
    return undefined;
  }

  // 콤마 위치 찾기 (데이터와 헤더 구분)
  const commaIndex = dataURL.indexOf(',');
  if (commaIndex === -1) {
    return undefined;
  }

  // "data:"와 "," 사이의 헤더 부분 추출
  const header = dataURL.substring(5, commaIndex); // "data:" 다음부터 ","까지

  if (!header) {
    // 빈 헤더의 경우 undefined 반환 (주석 예시와 일치)
    return undefined;
  }

  // 세미콜론으로 분리하여 MIME 타입 추출
  const parts = header.split(';');
  const mimeType = parts[0].trim();

  // MIME 타입이 빈 문자열이면 undefined
  if (!mimeType) {
    return undefined;
  }

  return mimeType;
}
