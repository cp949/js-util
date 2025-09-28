export function isEmpty(str: string | undefined | null): boolean {
  return typeof str === 'string' ? str.length === 0 : true;
}
