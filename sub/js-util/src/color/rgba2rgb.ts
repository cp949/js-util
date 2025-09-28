export function rgba2rgb(
  r: number,
  g: number,
  b: number,
  a: number,
): { r: number; g: number; b: number } {
  a = a / 100;

  return {
    r: Math.round((1 - a) * 255 + a * r),
    g: Math.round((1 - a) * 255 + a * g),
    b: Math.round((1 - a) * 255 + a * b),
  };
}
