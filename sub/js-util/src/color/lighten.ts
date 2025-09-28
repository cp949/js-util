import { blend } from './blend.js';

/**
 * Lightens a given rgb colour
 * @param rgb color
 * @param factor blend factor [0, 1]
 * @returns result rgb
 */
export function lighten(
  rgb: { r: number; g: number; b: number },
  factor: number,
): { r: number; g: number; b: number } {
  factor = Math.max(Math.min(factor, 1), 0);
  const white = { r: 255, g: 255, b: 255 };
  return blend(white, rgb, factor);
}
