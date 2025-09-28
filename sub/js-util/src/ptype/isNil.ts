export function isNil(obj: unknown): obj is null | undefined {
  return typeof obj === 'undefined' || obj === null;
}
