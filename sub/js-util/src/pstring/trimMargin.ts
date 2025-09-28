/**
 * 특정 기호('|' 기본값)를 기준으로 마진을 제거합니다.
 *
 * Removes all whitespace before a specified margin character (default is `|`) on each line.
 * This is particularly useful for formatting multi-line strings with clear markers for alignment.
 *
 * @param input - The multi-line string to process.
 * @param marginChar - The character that indicates the start of meaningful content in each line.
 *                     Defaults to the pipe character (`|`).
 * @returns The processed string with the whitespace before the margin character removed.
 *
 * @example
 * const text = `
 *     |This is a line.
 *     |This is another line.
 *     |    This line is indented more.
 * `;
 * console.log(trimMargin(text));
 * // Output:
 * // This is a line.
 * // This is another line.
 * //     This line is indented more.
 *
 * @example
 * const textWithCustomMargin = `
 *     >This is a line.
 *     >This is another line.
 *     >    This line is indented more.
 * `;
 * console.log(trimMargin(textWithCustomMargin, ">"));
 * // Output:
 * // This is a line.
 * // This is another line.
 * //     This line is indented more.
 */
export function trimMargin(input: string, marginChar: string = '|'): string {
  return input
    .split('\n')
    .map((line) => {
      const marginIndex = line.indexOf(marginChar);
      if (marginIndex !== -1) {
        return line.slice(marginIndex + 1);
      }
      return line;
    })
    .join('\n')
    .trim();
}
