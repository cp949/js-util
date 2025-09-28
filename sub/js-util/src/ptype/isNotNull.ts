export function isNotNull<T>(obj: T): obj is Exclude<T, null> {
  return obj !== null;
}
