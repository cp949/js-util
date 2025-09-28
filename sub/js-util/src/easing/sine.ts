export const sineIn = (x: number) => 1 - Math.cos((x * Math.PI) / 2);
export const sineOut = (x: number) => Math.sin((x * Math.PI) / 2);
export const sineInOut = (x: number) => -(Math.cos(Math.PI * x) - 1) / 2;
