/**
 * Blend two rgb colours with the factor being the weight given to the first colour
 * @param rgb1 first color {r:[0,255], g:[0,255], b:[0,255]}
 * @param rgb2 second color {r:[0,255], g:[0,255], b:[0,255]}
 * @param factor blend factor [0, 1]
 * @returns blend result rgb
 */
export function blend(
  rgb1: { r: number; g: number; b: number },
  rgb2: { r: number; g: number; b: number },
  factor: number,
): { r: number; g: number; b: number } {
  const f = Math.max(Math.min(factor, 1), 0);
  return {
    r: Math.round(rgb2.r + (rgb1.r - rgb2.r) * f),
    g: Math.round(rgb2.g + (rgb1.g - rgb2.g) * f),
    b: Math.round(rgb2.b + (rgb1.b - rgb2.b) * f),
  };
}
