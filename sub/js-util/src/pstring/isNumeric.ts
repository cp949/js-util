// /^\s*-?\d+(\.\d+)?\s*$/.test(str);

export function isNumeric(str: string | undefined | null): str is string {
  if (str === null || typeof str === 'undefined') return false;

  return !isNaN(Number(str));
}
