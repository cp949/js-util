/**
 * dataURL의 대략적인 크기를 바이트 단위로 계산합니다.
 * base64 인코딩된 문자열의 길이를 계산하여 크기를 반환.
 *
 * @param dataURL - dataURL
 * @returns dataURL의 크기
 */
export function getDataURLSize(dataURL: string): number {
  const parts = dataURL.split(',');
  if (parts.length !== 2) return 0;
  
  const base64 = parts[1];
  if (!base64) return 0;
  
  // base64 문자열 길이를 기반으로 대략적인 크기 계산
  const paddingCount = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  
  if (paddingCount > 0) {
    // 패딩이 있는 경우: 표준 공식
    return Math.floor(base64.length * 3 / 4) - paddingCount;
  } else {
    // 패딩이 없는 경우: 상향 추정 (ceil 사용)
    return Math.ceil(base64.length * 3 / 4);
  }
}
