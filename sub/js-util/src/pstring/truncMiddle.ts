/**
 * Configuration options for the `truncMiddle` function.
 */
type TruncateMiddleOptions = {
  /**
   * The maximum length of the truncated string, including the omission string.
   * If the string's length is less than or equal to this value, no truncation occurs.
   * @default 30
   */
  length?: number;

  /**
   * The string to insert in the middle to indicate truncation.
   * @default '...'
   */
  omission?: string;
};

/**
 * Truncates a string to a specified length by inserting an omission string in the middle.
 *
 * @param input - The string to truncate.
 * @param options - Configuration options for truncation.
 * @param options.length - The maximum length of the truncated string including the omission string. Default is 30.
 * @param options.omission - The string to indicate truncation. Default is `'...'`.
 * @returns The truncated string with the omission string in the middle if truncation occurs.
 *
 * @example
 * // Basic usage
 * truncMiddle("This is a long string that needs truncating.", { length: 20 });
 * // Output: "This is...ncating."
 *
 * @example
 * // Using a custom omission
 * truncMiddle("This is a long string that needs truncating.", { length: 20, omission: "[...]" });
 * // Output: "This i[...]cating."
 */
export function truncMiddle(input: string, options: TruncateMiddleOptions = {}): string {
  const {
    length = 30, // Default length is 30
    omission = '...', // Default omission is '...'
  } = options;

  if (input.length <= length) {
    return input;
  }

  const omissionLength = omission.length;
  if (omissionLength >= length) {
    return omission.slice(0, length); // If omission is longer than the allowed length
  }

  const keepLength = length - omissionLength; // Characters to keep on each side
  const startLength = Math.ceil(keepLength / 2);
  const endLength = Math.floor(keepLength / 2);

  const start = input.slice(0, startLength);
  const end = input.slice(input.length - endLength);

  return start + omission + end;
}

/*
// Example usage
const result = truncMiddle("This is a long string that needs to be truncated.", {
  length: 20,
  omission: '...',
});

console.log(result); // Output: "This is...uncated."
*/
