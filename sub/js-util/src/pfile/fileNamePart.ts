export function fileNamePart(fileName: string): string {
  const dotIdx = fileName.lastIndexOf('.');
  if (dotIdx < 0) return fileName;
  
  // 단일 점은 특별 케이스 - 전체가 파일명
  if (fileName === '.') return fileName;
  
  return fileName.substring(0, dotIdx);
}
