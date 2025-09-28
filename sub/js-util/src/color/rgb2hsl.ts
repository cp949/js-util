import { hsv2hsl } from './hsv2hsl.js';
import { rgb2hsv } from './rgb2hsv.js';

export function rgb2hsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const { h, s, v } = rgb2hsv(r, g, b);
  return hsv2hsl(h, s, v);
}
