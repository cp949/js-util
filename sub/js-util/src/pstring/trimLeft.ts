export function trimLeft(str: string | undefined | null): string {
  return str === null || str === undefined
    ? ''
    : (str + '').replace(/^[\s\uFEFF\u00a0\u3000]+/g, '');
}
