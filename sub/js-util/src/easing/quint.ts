export const quintIn = (x: number) => x * x * x * x * x;
export const quintOut = (x: number) => 1 - Math.pow(1 - x, 5);
export const quintInOut = (x: number) =>
  x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
