export const expoIn = (x: number) => (x === 0 ? 0 : Math.pow(2, 10 * x - 10));
export const expoOut = (x: number) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x));
export const expoInOut = (x: number) => {
  return x === 0
    ? 0
    : x === 1
      ? 1
      : x < 0.5
        ? Math.pow(2, 20 * x - 10) / 2
        : (2 - Math.pow(2, -20 * x + 10)) / 2;
};
