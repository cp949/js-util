import { rgb2hex } from './rgb2hex.js';
import { rgba2rgb } from './rgba2rgb.js';

export function rgba2hex(r: number, g: number, b: number, a: number): string {
  const rgb = rgba2rgb(r, g, b, a);
  return rgb2hex(rgb.r, rgb.g, rgb.b);
}
