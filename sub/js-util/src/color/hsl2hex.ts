import { hsl2rgb } from './hsl2rgb.js';
import { rgb2hex } from './rgb2hex.js';

/**
 * convert hsl to hex
 * @param h Hue [0, 360]
 * @param s Saturation  [0, 100]
 * @param v Brightness  [0, 100]
 * @returns hex color
 */
export function hsl2hex(h: number, s: number, v: number) {
  const rgb = hsl2rgb(h, s, v);
  return rgb2hex(rgb.r, rgb.g, rgb.b);
}
