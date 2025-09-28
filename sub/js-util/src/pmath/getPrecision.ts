export function getPrecision(value: number): number {
  const str = value.toString();
  let idx = str.indexOf('e+');
  if (idx < 0) {
    idx = str.indexOf('e-');
  }
  if (idx >= 0) {
    return parseInt(str.substring(idx + 2));
  }

  return str.split('.')[1]?.length || 0;
}
