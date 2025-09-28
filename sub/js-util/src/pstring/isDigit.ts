export function isDigit(str: string | undefined | null): str is string {
  if (!str) return false;
  const regexp = /^[0-9]+$/;
  return regexp.test(str);
}
