export function toFloat(str: string | undefined | null, defVal = 0): number {
  if (str === null || typeof str === 'undefined') return defVal;
  try {
    const v = parseFloat(str);
    if (isNaN(v)) return defVal;
    return v;
  } catch (e) {
    return defVal;
  }
}
