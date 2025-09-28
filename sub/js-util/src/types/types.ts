export type TypeValidator = (input: unknown, ...args: any[]) => boolean;
export interface KeyValidator {
  keyValidator: TypeValidator;
}
export interface ValueValidator {
  valueValidator: TypeValidator;
}
export interface ErrorMessage {
  message: string | undefined;
}
export type TypeGuardOptions = Partial<ValueValidator & KeyValidator>;
export type TypeAssertionOptions = TypeGuardOptions & Partial<ErrorMessage>;
export type TypeGuard<T, O extends TypeGuardOptions | undefined = undefined> = (
  input: unknown,
  options?: O,
) => input is T;
export type TypeAssertion<T, O extends TypeAssertionOptions | undefined = undefined> = (
  input: unknown,
  options?: O,
) => asserts input is T;
export type TypedArray =
  | Uint8Array
  | Uint8ClampedArray
  | Uint16Array
  | Uint32Array
  | Int8Array
  | Int16Array
  | Int32Array
  | BigUint64Array
  | BigInt64Array
  | Float32Array
  | Float64Array;
export type TypedGeneratorFunction<Y, R, N> = (...args: any[]) => Generator<Y, R, N>;
