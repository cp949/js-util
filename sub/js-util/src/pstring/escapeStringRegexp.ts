// copy from https://github.com/sindresorhus/escape-string-regexp

/**
 * Escape RegExp special characters
 * @param str 
 * @returns 
 @example
 escapeStringRegexp('How much $ for a 🦄?')  =>  'How much \\$ for a 🦄\\?'
 */
export function escapeStringRegexp(str: string) {
  // Escape characters with special meaning either inside or outside character sets.
  // Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
  return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
}
