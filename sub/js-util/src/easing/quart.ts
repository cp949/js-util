export const quartIn = (x: number) => x * x * x * x;
export const quartOut = (x: number) => 1 - Math.pow(1 - x, 4);
export const quartInOut = (x: number) =>
  x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
