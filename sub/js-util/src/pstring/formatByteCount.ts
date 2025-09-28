export function formatByteCount(size: number): string {
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  if (size === 1) return '1 byte';
  if (size < 0) return size + ' bytes'; // Negative values stay in bytes

  let l = 0;
  let n = size;
  while (n >= 1024 && ++l) {
    n = n / 1024;
  }

  // Format the number without unnecessary decimals
  const formatted = n < 10 && l > 0 ? n.toFixed(1) : n.toFixed(0);
  // Remove .0 if it's a whole number
  const cleanFormatted = formatted.replace(/\.0$/, '');

  return cleanFormatted + ' ' + units[l];
}
