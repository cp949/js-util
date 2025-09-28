export function pluck<T, K extends keyof T>(array: ReadonlyArray<T>, key: K): T[K][] {
  return array.map((element) => element[key]);
}
