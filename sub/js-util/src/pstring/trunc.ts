/**
 * Configuration options for the `truncate` function.
 */
type TruncateOptions = {
  /**
   * The maximum length of the truncated string, including the omission string.
   * If the string's length is less than or equal to this value, no truncation occurs.
   * @default 30
   */
  length?: number;

  /**
   * The string to append to the truncated result to indicate that truncation occurred.
   * @default '...'
   */
  omission?: string;

  /**
   * A string or RegExp used to determine the point at which to truncate.
   * If specified, truncation occurs before the match closest to the end of the truncated string.
   */
  separator?: RegExp | string;
};

/**
 * Truncates a string to a specified length, optionally adding a custom omission string
 * and truncating at a specific separator.
 *
 * @param input - The string to truncate.
 * @param options - Configuration options for truncation.
 * @param options.length - The maximum length of the truncated string including the omission string. Default is 30.
 * @param options.omission - The string to indicate truncation. Default is `'...'`.
 * @param options.separator - A string or RegExp to truncate the string at. If specified, truncation happens before this match.
 * @returns The truncated string with the omission string appended if truncation occurs.
 *
 * @example
 * // Basic usage
 * trunc("This is a long string that needs truncating.", { length: 20 });
 * // Output: "This is a long..."
 *
 * @example
 * // Using a custom omission
 * trunc("This is a long string that needs truncating.", { length: 20, omission: " [cut]" });
 * // Output: "This is a long [cut]"
 *
 * @example
 * // Using a separator
 * trunc("This is a long string that needs truncating.", { length: 20, separator: " " });
 * // Output: "This is a long..."
 *
 * @example
 * // Using a regular expression separator
 * trunc("This is a long string that needs truncating.", { length: 20, separator: /\s/ });
 * // Output: "This is a long..."
 */
export function trunc(input: string, options: TruncateOptions = {}): string {
  const {
    length = 30, // Default length is 30
    omission = '...', // Default omission is '...'
    separator,
  } = options;

  if (input.length <= length) {
    return input;
  }

  const maxLength = length - omission.length;
  if (maxLength <= 0) {
    return omission; // If omission is longer than the allowed length
  }

  let truncated = input.slice(0, maxLength);

  if (separator) {
    const separatorPattern = typeof separator === 'string' ? separator : new RegExp(separator);
    const match = truncated.match(separatorPattern);
    if (match) {
      truncated = truncated.slice(0, match.index);
    }
  }

  return truncated + omission;
}
