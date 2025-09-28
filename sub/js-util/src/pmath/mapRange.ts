export const mapRange = (v: number, l1: number, h1: number, l2: number, h2: number): number => {
  if (h1 === l1) return l2;
  return l2 + ((v - l1) / (h1 - l1)) * (h2 - l2);
};
