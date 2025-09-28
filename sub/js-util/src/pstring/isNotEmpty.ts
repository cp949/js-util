export function isNotEmpty(str: string | undefined | null): str is string {
  if (typeof str === 'string') return str.length > 0;
  return false;
}
