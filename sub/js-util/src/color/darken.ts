import { blend } from './blend.js';

/**
 * Darkens a given rgb colour
 * @param rgb color
 * @param factor blend factor [0, 1]
 * @returns result rgb
 */
export function darken(
  rgb: { r: number; g: number; b: number },
  factor: number,
): { r: number; g: number; b: number } {
  factor = Math.max(Math.min(factor, 1), 0);
  const black = { r: 0, g: 0, b: 0 };
  return blend(black, rgb, factor);
}
