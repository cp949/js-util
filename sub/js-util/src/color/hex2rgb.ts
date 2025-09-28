/**
 * hex 컬러 문자열을 r,g,b로 변환
 * @param hex hex 컬러 문자열
 * @returns {r:number, g:number, b:number} 객체 [0, 255]
 */
export function hex2rgb(hex: string): { r: number; g: number; b: number } {
  if (hex[0] === '#') hex = hex.substring(1);

  if (hex.length === 3) {
    return {
      r: parseInt(hex[0] + hex[0], 16),
      g: parseInt(hex[1] + hex[1], 16),
      b: parseInt(hex[2] + hex[2], 16),
    };
  }

  return {
    r: parseInt(hex.substr(0, 2), 16),
    g: parseInt(hex.substr(2, 2), 16),
    b: parseInt(hex.substr(4, 2), 16),
  };
}
