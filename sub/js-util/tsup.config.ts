import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  return {
    dts: true,
    format: ['esm', 'cjs'],
    minify: !options.watch,
    entry: {
      index: 'src/index.ts',
      'base64/index': 'src/base64/index.ts',
      'browser/index': 'src/browser/index.ts',
      'array/index': 'src/parray/index.ts',
      'file/index': 'src/pfile/index.ts',
      'date/index': 'src/pdate/index.ts',
      'math/index': 'src/pmath/index.ts',
      'misc/index': 'src/pmisc/index.ts',
      'http/index': 'src/phttp/index.ts',
      'color/index': 'src/color/index.ts',
      'dataurl/index': 'src/dataurl/index.ts',
      'dom/index': 'src/dom/index.ts',
      'fn/index': 'src/fn/index.ts',
      'random/index': 'src/prandom/index.ts',
      'basex/index': 'src/basex/index.ts',
      'string/index': 'src/pstring/index.ts',
      'types/index': 'src/types/index.ts',
      'usermedia/index': 'src/pusermedia/index.ts',
      'web/index': 'src/pweb/index.ts',
      'easing/index': 'src/easing/index.ts',
      'eventemitter/index': 'src/eventemitter/index.ts',
      'uint8-array/index': 'src/uint8-array/index.ts',
    },
    target: 'es2022',
    splitting: true,
    sourcemap: true,
    clean: false,
  };
});
