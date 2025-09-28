export function isNotUndefined<T>(obj: T): obj is Exclude<T, undefined> {
  return obj !== undefined;
}
