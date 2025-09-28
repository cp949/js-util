/**
 * 파일의 확장자를 추출한다
 * @param fileName
 * @param lowerCase 소문자로 변경할지 여부
 * @param withDot 점(.)을 포함할지 여부
 * @returns 파일명의 확장자를 리턴, 확장자가 없으면 null을 리턴
 */
export function fileExtension(fileName: string, lowerCase = false, withDot = false): string | null {
  if (fileName.indexOf('.') < 0) return null;

  // 단일 점은 특별 케이스 - 확장자 없음
  if (fileName === '.') return null;

  let ext = fileName.split('.').pop();
  if (lowerCase) {
    ext = ext?.toLowerCase();
  }

  if (withDot) {
    if (ext && ext.length > 0) {
      return '.' + ext;
    } else {
      return null;
    }
  } else {
    return ext !== undefined ? ext : null;
  }
}
