export function isNotNil<T>(object: T): object is Exclude<T, null | undefined> {
  return object !== null && object !== undefined;
}
