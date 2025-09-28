export function errmsg(err: any): string {
  if (typeof err === 'undefined' || err === null) return 'unknown';
  if (typeof err === 'string') return err;
  if (typeof err['message'] === 'string') {
    return err['message'];
  }
  return err.toString();
}
