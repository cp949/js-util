/**
 * 최소 공통 들여쓰기를 자동으로 계산합니다.
 * Removes the common leading whitespace (indentation) from every line in the input string.
 * Useful for handling multi-line strings with consistent but unwanted indentation.
 *
 * @param input - The multi-line string to process.
 * @returns The processed string with the common leading whitespace removed.
 *
 * @example
 * const text = `
 *     This is a line.
 *     This is another line.
 *         This line is indented more.
 * `;
 * console.log(trimIndent(text));
 * // Output:
 * // This is a line.
 * // This is another line.
 * //     This line is indented more.
 */
export function trimIndent(input: string): string {
  const lines = input.split('\n');
  const minIndent = calculateMinIndent(lines);

  return lines
    .map((line) => (line.startsWith(' '.repeat(minIndent)) ? line.slice(minIndent) : line))
    .join('\n')
    .trim();
}

/**
 * Calculates the minimum indentation of all non-empty lines in the input string.
 *
 * @param lines - An array of strings representing the lines of a multi-line string.
 * @returns The smallest number of leading spaces in non-empty lines.
 */
function calculateMinIndent(lines: string[]): number {
  let minIndent = Infinity;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.length > 0) {
      const leadingSpaces = line.match(/^ */)?.[0].length || 0;
      if (leadingSpaces < minIndent) {
        minIndent = leadingSpaces;
      }
    }
  }

  return minIndent === Infinity ? 0 : minIndent;
}
