export function substringAfter(
  str: string,
  delimiter: string,
  missingDelimiterValue?: string,
): string {
  if (str.length === 0 || delimiter.length === 0) {
    return missingDelimiterValue ? missingDelimiterValue : str;
  }
  const idx = str.indexOf(delimiter);
  if (idx < 0) {
    return missingDelimiterValue ? missingDelimiterValue : str;
  }
  return str.substring(idx + delimiter.length);
}

export function substringAfterLast(
  str: string,
  delimiter: string,
  missingDelimiterValue?: string,
): string {
  if (str.length === 0 || delimiter.length === 0) {
    return missingDelimiterValue ? missingDelimiterValue : str;
  }
  const idx = str.lastIndexOf(delimiter);
  if (idx < 0) {
    return missingDelimiterValue ? missingDelimiterValue : str;
  }
  return str.substring(idx + delimiter.length);
}
