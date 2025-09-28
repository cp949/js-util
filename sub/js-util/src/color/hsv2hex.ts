import { hsv2rgb } from './hsv2rgb.js';
import { rgb2hex } from './rgb2hex.js';

/**
 * Converts an HSV triplet to hex representation.
 * @param h Hue value in [0, 360]
 * @param s Saturation value in [0, 100]
 * @param v Brightness in [0, 100]
 * @returns Hex representation of the color
 */
export function hsv2hex(h: number, s: number, v: number) {
  const rgb = hsv2rgb(h, s, v);
  return rgb2hex(rgb.r, rgb.g, rgb.b);
}
