export const objectKeys = <T extends Record<PropertyKey, unknown>>(o: T): (keyof T)[] =>
  Object.keys(o);
