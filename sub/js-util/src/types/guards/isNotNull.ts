/**
 * @remarks
 * This guard checks that the value is not null, use isNotNil to also
 * exclude undefined
 * @category Type Guard
 */
export function isNotNull<T>(input: T | null): input is T {
  return input !== null;
}
