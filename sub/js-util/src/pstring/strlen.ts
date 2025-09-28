export function strlen(str: string | undefined | null): number {
  return str === null || str === undefined ? 0 : str.length;
}
