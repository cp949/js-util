// copy from https://github.com/sindresorhus/slugify/blob/main/index.js

import { escapeStringRegexp } from './escapeStringRegexp.js';
import { transliterate } from './transliterate.js';

const builtinOverridableReplacements: [string, string][] = [
  ['&', ' and '],
  ['🦄', ' unicorn '],
  ['♥', ' love '],
];

type SlugifyOptions = {
  separator?: string;
  lowercase?: boolean;
  decamelize?: boolean;
  customReplacements?: [string, string][];
  preserveLeadingUnderscore?: boolean;
  preserveTrailingDash?: boolean;
  preserveCharacters?: string[];
};

const decamelize = (string: string): string => {
  return string
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]{2,})([A-Z][a-z])/g, '$1 $2');
};

const removeMootSeparators = (string: string, separator: string): string => {
  const escapedSeparator = escapeStringRegexp(separator);

  return string
    .replace(new RegExp(`${escapedSeparator}{2,}`, 'g'), separator)
    .replace(new RegExp(`^${escapedSeparator}|${escapedSeparator}$`, 'g'), '');
};

const buildPatternSlug = (options: SlugifyOptions): RegExp => {
  let negationSetPattern = 'a-z0-9';
  negationSetPattern += options.lowercase ? '' : 'A-Z';

  if (options.preserveCharacters && options.preserveCharacters.length > 0) {
    for (const character of options.preserveCharacters) {
      if (character === options.separator) {
        throw new Error(
          `The separator character \`${options.separator}\` cannot be included in preserved characters: ${options.preserveCharacters}`,
        );
      }

      negationSetPattern += escapeStringRegexp(character);
    }
  }

  return new RegExp(`[^${negationSetPattern}]+`, 'g');
};

export default function slugify(str: string, options: SlugifyOptions = {}): string {
  options = {
    separator: '-',
    lowercase: true,
    decamelize: true,
    customReplacements: [],
    preserveLeadingUnderscore: false,
    preserveTrailingDash: false,
    preserveCharacters: [],
    ...options,
  };

  const shouldPrependUnderscore = options.preserveLeadingUnderscore && str.startsWith('_');
  const shouldAppendDash = options.preserveTrailingDash && str.endsWith('-');

  const customReplacements = options.customReplacements
    ? new Map([...builtinOverridableReplacements, ...options.customReplacements])
    : new Map(builtinOverridableReplacements);

  str = transliterate(str, { customReplacements });

  if (options.decamelize) {
    str = decamelize(str);
  }

  const patternSlug = buildPatternSlug(options);

  if (options.lowercase) {
    str = str.toLowerCase();
  }

  str = str.replace(/([a-zA-Z\d]+)'([ts])(\s|$)/g, '$1$2$3');
  str = str.replace(patternSlug, options.separator!);
  str = str.replace(/\\/g, '');

  if (options.separator) {
    str = removeMootSeparators(str, options.separator);
  }

  if (shouldPrependUnderscore) {
    str = `_${str}`;
  }

  if (shouldAppendDash) {
    str = `${str}-`;
  }

  return str;
}

export function slugifyWithCounter() {
  const occurrences = new Map<string, number>();

  const countable = (string: string, options?: SlugifyOptions): string => {
    const opts = { separator: '-', ...options };
    string = slugify(string, opts);

    if (!string) {
      return '';
    }

    const stringLower = string.toLowerCase();
    const numberless = occurrences.get(stringLower.replace(/(?:-\d+?)+?$/, '')) || 0;
    const counter = occurrences.get(stringLower);
    occurrences.set(stringLower, typeof counter === 'number' ? counter + 1 : 1);
    const newCounter = occurrences.get(stringLower) || 2;

    if (newCounter >= 2 || numberless > 2) {
      string = `${string}${opts.separator}${newCounter}`;
    }

    return string;
  };

  countable.reset = (): void => {
    occurrences.clear();
  };

  return countable;
}
