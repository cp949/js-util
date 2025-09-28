// /**
//  * HTML-safe compress white-spaces.
// * @param str - String to compress.
// * @returns String.
// */
// export function compressSpaces(str: string) {
// 	return str.replace(/(?!\u3000)\s+/gm, ' ');
// }

export function compressSpaces(str: string | undefined | null): string {
  return str === null || str === undefined
    ? ''
    : (str + '').replace(/[\s\uFEFF\u00a0\u3000]+/gm, ' ');
}
