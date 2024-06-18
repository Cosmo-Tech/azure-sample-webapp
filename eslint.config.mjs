import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import cypress from 'eslint-plugin-cypress';
import jest from 'eslint-plugin-jest';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

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
  ...fixupConfigRules(
    compat.extends(
      'plugin:react/recommended',
      'standard',
      'eslint:recommended',
      'plugin:jest/recommended',
      'plugin:cypress/recommended',
      'prettier',
      'plugin:prettier/recommended'
    )
  ),
  {
    plugins: {
      react: fixupPluginRules(react),
      'react-hooks': fixupPluginRules(reactHooks),
      jest: fixupPluginRules(jest),
      cypress: fixupPluginRules(cypress),
      prettier: fixupPluginRules(prettier),
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...jest.environments.globals.globals,
        ...cypress.environments.globals.globals,
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
        version: 'detect',
      },
    },

    rules: {
      'no-constant-binary-expression': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
      'cypress/no-assigning-return-values': 'error',
      'cypress/no-unnecessary-waiting': 'error',
      'cypress/assertion-before-screenshot': 'warn',
      'cypress/no-force': 'error',
      'cypress/no-async-tests': 'error',
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
  }
];
