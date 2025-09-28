// copy from https://github.com/sindresorhus/transliterate/blob/main/index.js

import { builtinReplacements } from './_builtinReplacements.js';
import { escapeStringRegexp } from './escapeStringRegexp.js';

const doCustomReplacements = (str: string, replacements: Map<string, string>) => {
  for (const [key, value] of replacements) {
    // TODO: Use `String#replaceAll()` when targeting Node.js 16.
    str = str.replace(new RegExp(escapeStringRegexp(key), 'g'), value);
  }

  return str;
};

interface Options {
  /**
	Add your own custom replacements.

	The replacements are run on the original string before any other transformations.

	This only overrides a default replacement if you set an item with the same key.

	@default []

	@example
	```
	import transliterate from '@sindresorhus/transliterate';

	transliterate('Я люблю единорогов', {
		customReplacements: [
			['единорогов', '🦄']
		]
	})
	//=> 'Ya lyublyu 🦄'
	```
	*/
  readonly customReplacements?: ReadonlyArray<[string, string]> | Map<string, string>;
}

export function transliterate(str: string, options: Options) {
  options = {
    customReplacements: [],
    ...options,
  };

  const customReplacements = options.customReplacements
    ? new Map([...builtinReplacements, ...options.customReplacements])
    : new Map(builtinReplacements);

  str = str.normalize();
  str = doCustomReplacements(str, customReplacements);
  str = str
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .normalize();

  return str;
}
