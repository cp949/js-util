export const quadIn = (x: number) => x * x;
export const quadOut = (x: number) => 1 - (1 - x) * (1 - x);
export const quadInOut = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
