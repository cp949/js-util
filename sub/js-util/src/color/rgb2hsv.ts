/**
 *
 * @param r Red color [0, 255]
 * @param g Green color [0, 255]
 * @param b Blue color [0, 255]
 * @returns HSV 컬러값을 리턴, h는 [0,360], s는 [0, 100], v는 [0, 100]
 */
export function rgb2hsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  let h;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  if (delta === 0) {
    h = 0;
  } else if (r === max) {
    h = ((g - b) / delta) % 6;
  } else if (g === max) {
    h = (b - r) / delta + 2;
  } else {
    h = (r - g) / delta + 4;
  }

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  const s = Math.round((max === 0 ? 0 : delta / max) * 100);

  const v = Math.round((max / 255) * 100);

  return { h, s, v };
}
