export function isArrayEqual(arr1: any, arr2: any): boolean {
  return (
    Array.isArray(arr1) &&
    Array.isArray(arr2) &&
    arr1.length === arr2.length &&
    arr1.every((it, idx) => it === arr2[idx])
  );
}
