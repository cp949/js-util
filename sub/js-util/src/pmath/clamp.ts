export function clamp(value: number, min: number, max: number): number {
  if (min > max) {
    return clamp(value, max, min);
  }
  return Math.min(Math.max(value, min), max);
}

export function atLeast(v: number, min: number): number {
  if (v < min) return min;
  return v;
}

export function atMost(v: number, max: number): number {
  if (v > max) return max;
  return v;
}

export function atLeastZero(v: number): number {
  return atLeast(v, 0);
}

export function clampZeroToOne(v: number): number {
  return clamp(v, 0, 1);
}
