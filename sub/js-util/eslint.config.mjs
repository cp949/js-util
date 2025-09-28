import { config } from '@repo/eslint-config/base';

/** @type {import("eslint").Linter.Config} */
export default [
  {
    ignores: ['node_modules/', '.turbo/', 'scripts/', 'html/', 'dist/', 'coverage/'],
  },
  ...config,

  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['eslint.config.mjs'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
];
