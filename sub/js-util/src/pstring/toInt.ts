export function toInt(str: string | undefined | null, defVal = 0): number {
  if (str === null || typeof str === 'undefined') return defVal;
  try {
    const v = parseInt(str, 10);
    if (isNaN(v)) return defVal;
    return v;
  } catch (e) {
    return defVal;
  }
}
