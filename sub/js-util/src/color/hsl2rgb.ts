import { hsl2hsv } from './hsl2hsv.js';
import { hsv2rgb } from './hsv2rgb.js';

export function hsl2rgb(h: number, s: number, l: number) {
  const hsv = hsl2hsv(h, s, l);
  return hsv2rgb(hsv.h, hsv.s, hsv.v);
}
