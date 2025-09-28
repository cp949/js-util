import { hex2rgb } from './hex2rgb.js';
import { rgb2hsv } from './rgb2hsv.js';

/**
 * convert hex to hsv
 * @param hex hex color
 * @returns hsv color {h:[0, 360], s:[0,100], v:[0,100]}
 */
export function hex2hsv(hex: string) {
  const { r, g, b } = hex2rgb(hex);
  return rgb2hsv(r, g, b);
}
