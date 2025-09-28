export function roundf(value: number, fractionDigits = 0): number {
  if (fractionDigits <= 0) return Math.round(value);
  const w = Math.pow(10, fractionDigits);
  return Math.round(value * w) / w;
}

export function roundf1(value: number): number {
  return Math.round(value * 10) / 10;
}

export function roundf2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function roundf3(value: number): number {
  return Math.round(value * 1000) / 1000;
}

export function roundf4(value: number): number {
  return Math.round(value * 10000) / 10000;
}

export function roundf5(value: number): number {
  return Math.round(value * 100000) / 100000;
}

export function roundi(value: number, digits = 0): number {
  if (digits <= 0) return Math.round(value);
  const w = Math.pow(10, digits);
  return Math.round(value / w) * w;
}

export function roundi1(value: number): number {
  return Math.round(value / 10) * 10;
}

export function roundi2(value: number): number {
  return Math.round(value / 100) * 100;
}

export function roundi3(value: number): number {
  return Math.round(value / 1000) * 1000;
}

export function roundi4(value: number): number {
  return Math.round(value / 10000) * 10000;
}

export function roundi5(value: number): number {
  return Math.round(value / 100000) * 100000;
}
