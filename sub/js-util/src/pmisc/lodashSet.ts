/**
 *
 * @param obj
 * @param path
 * @param value
 * @example
const obj = {}
lodashSet(obj, 'a.b.c', 1)
console.log(obj.a.b.c)
 */
export function lodashSet(obj: any, path: string, value: unknown) {
  const len = path.length;
  let i = 0;
  let l = 0;
  let prop = '';

  while (i < len) {
    if (path[i] === '.') {
      prop = path.slice(l, i);
      switch (prop.length) {
        case 9:
          if (prop === '__proto__' || prop === 'prototype') {
            return;
          }
          break;
        case 11:
          if (prop === 'constructor') {
            return;
          }
          break;
      }
      switch (typeof obj[prop]) {
        case 'object':
          obj = obj[prop];
          break;
        case 'undefined':
          obj = obj[prop] = {};
          break;
        default:
          return;
      }
      l = ++i;
      continue;
    }
    i++;
  }
  obj[path.slice(l, i)] = value;
}
