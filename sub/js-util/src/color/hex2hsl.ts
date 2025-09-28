import { hex2hsv } from './hex2hsv.js';
import { hsv2hsl } from './hsv2hsl.js';
/**
 * convert hex to hsl
 * @param hex hex color
 * @returns hsl color {h:[0, 360], s:[0,100], l:[0,100]}
 */
export function hex2hsl(hex: string) {
  const { h, s, v } = hex2hsv(hex);
  return hsv2hsl(h, s, v);
}
