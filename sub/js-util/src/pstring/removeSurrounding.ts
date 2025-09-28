export function removeSurrounding(str: string, prefix: string, suffix?: string): string {
  if (str.length === 0 || prefix.length === 0) {
    return str;
  }
  if (typeof suffix === 'undefined') {
    suffix = prefix;
  } else {
    if (suffix.length === 0) {
      suffix = prefix;
    }
  }
  if (str.length < prefix.length + suffix.length) {
    return str;
  }
  if (str.startsWith(prefix) && str.endsWith(suffix)) {
    return str.substring(prefix.length, str.length - suffix.length);
  }
  return str;
}
