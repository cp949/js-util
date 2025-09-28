/**
 * 주어진 dataURL의 base64 인코딩 여부를 확인합니다.
 *
 * @param dataURL - dataURL
 * @returns
 */
export function isBase64DataURL(dataURL: string): boolean {
  // ;base64, 문자열을 포함하는지 확인.
  return dataURL.includes(';base64,');
}
