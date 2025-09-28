export function isElement(obj: any): obj is Element {
  return !!(obj && obj.nodeType == 1);
}
