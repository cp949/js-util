/**
 * Generates a string for `base` by add a number until it's unique amongst a set of predefined names.
 */
export function generateUniqueString(base: string, existingNames: Set<string>) {
  let i = 1;
  if (!existingNames.has(base)) {
    return base;
  }
  const newBase = base.replace(/\d+$/, '');
  let suggestion = newBase;
  while (existingNames.has(suggestion)) {
    suggestion = newBase + String(i);
    i += 1;
  }
  return suggestion;
}
