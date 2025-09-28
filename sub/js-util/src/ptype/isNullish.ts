export function isNullish(obj: unknown): obj is null | undefined {
  return typeof obj === 'undefined' || obj === null;
}
