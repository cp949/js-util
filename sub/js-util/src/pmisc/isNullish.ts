export const isNullish = <T>(value: T | undefined | null): value is undefined | null =>
  value === null || value === undefined;

export const isNotNullish = <T>(value: T | undefined | null): value is NonNullable<T> =>
  !isNullish(value);

export const isNil = <T>(value: T | undefined | null): value is undefined | null =>
  value === null || value === undefined;

export const isNotNil = <T>(value: T | undefined | null): value is NonNullable<T> => !isNil(value);
