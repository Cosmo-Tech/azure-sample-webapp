import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import cypress from 'eslint-plugin-cypress';
import jest from 'eslint-plugin-jest';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import neostandard from 'neostandard';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});
const neostandardConfig = neostandard({ semi: true, noStyle: true });

export default [
  {
    ignores: [
      '**/build',
      '**/dist',
      '**/.docz',
      '**/.github',
      '**/node_modules',
      'cypress/commons/services/stubbing.js',
      'cypress/reports',
      'scripts/migration/src/*/templates',
    ],
  },
  ...neostandardConfig,
  ...compat.extends(
    'plugin:react/recommended',
    'plugin:cypress/recommended',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:jest/recommended'
  ),
  {
    plugins: {
      react,
      'react-hooks': fixupPluginRules(reactHooks),
      cypress,
      prettier,
      jest,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...cypress.environments.globals.globals,
        ...jest.environments.globals.globals,
      },

      ecmaVersion: 12,
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      react: {
        version: '18.3',
      },
    },

    rules: {
      'no-constant-binary-expression': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'cypress/assertion-before-screenshot': 'warn',
      'cypress/no-force': 'error',
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      semi: [2, 'always'],

      'max-len': [
        'error',
        {
          code: 120,
        },
      ],
    },
  },
  {
    files: ['cypress/**/*.js'],
    rules: {
      'jest/expect-expect': 0,
      'jest/valid-expect': 0,
      'jest/valid-expect-in-promise': 0,
    },
  },
];
