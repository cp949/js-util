export function fuzzyCeil(value: number, epsilon = 0.0001): number {
  return Math.ceil(value - epsilon);
}

export function fuzzyEquals(a: number, b: number, epsilon = 0.0001): boolean {
  return Math.abs(a - b) < epsilon;
}

export function fuzzyFloor(value: number, epsilon = 0.0001): number {
  return Math.floor(value + epsilon);
}

export function fuzzyGreaterThan(a: number, b: number, epsilon = 0.0001): boolean {
  return a > b - epsilon;
}

export function fuzzyLessThan(a: number, b: number, epsilon = 0.0001): boolean {
  return a < b + epsilon;
}
