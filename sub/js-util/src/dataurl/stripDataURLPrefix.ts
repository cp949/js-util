/**
 * dataURL에서 MIME 타입과 인코딩 정보를 제거하고 순수한 base64 데이터만 반환합니다.
 * @param dataURL - dataURL
 * @returns 순수 base64 URL
 */
export function stripDataURLPrefix(dataURL: string): string | undefined {
  if (!dataURL.startsWith('data:')) {
    return undefined;
  }
  
  const commaIndex = dataURL.indexOf(',');
  if (commaIndex === -1) {
    return undefined;
  }
  
  return dataURL.substring(commaIndex + 1);
}
