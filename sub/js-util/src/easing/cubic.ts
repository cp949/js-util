export const cubicIn = (x: number) => x * x * x;
export const cubicOut = (x: number) => 1 - Math.pow(1 - x, 3);
export const cubicInOut = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
