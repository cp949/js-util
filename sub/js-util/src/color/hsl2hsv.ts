/**
 * convert hsl to hsv
 * @param h [0, 360]
 * @param s [0, 100]
 * @param l [0, 100]
 * @returns hsv color
 */
export function hsl2hsv(h: number, s: number, l: number): { h: number; s: number; v: number } {
  s *= (l < 50 ? l : 100 - l) / 100;

  return {
    h: h,
    s: ((2 * s) / (l + s)) * 100,
    v: l + s,
  };
}
