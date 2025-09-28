export const circIn = (x: number) => 1 - Math.sqrt(1 - Math.pow(x, 2));
export const circOut = (x: number) => Math.sqrt(1 - Math.pow(x - 1, 2));
export const circInOut = (x: number) => {
  return x < 0.5
    ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
    : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
};
