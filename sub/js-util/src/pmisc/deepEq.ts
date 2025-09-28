export function deepEq<T>(a: T, b: T): boolean {
  if (a === b) {
    return true; // 같은 참조를 가리키면 true
  }

  const t1 = typeof a;
  const t2 = typeof b;
  if (t1 !== t2) {
    // 타입이 다르면 false
    return false;
  }

  if (t1 !== 'object' || a === null || b === null) {
    return false; // 하나가 null이거나 객체가 아닌 경우 false
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    return a.every((item, index) => deepEq(item, b[index]));
  }

  const aKeys = Object.keys(a as any) as Array<keyof T>;
  const bKeys = Object.keys(b as any) as Array<keyof T>;

  if (aKeys.length !== bKeys.length) {
    return false; // 속성의 개수가 다르면 false
  }

  return aKeys.every((key) => deepEq((a as any)[key], (b as any)[key]));
}
