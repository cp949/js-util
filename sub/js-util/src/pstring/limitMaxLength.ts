export function limitMaxLength(text: string | null | undefined, len: number): string {
  if (typeof text !== 'string') {
    return '';
  }
  if (text.length === 0) return '';
  return text.substring(0, len);
}
