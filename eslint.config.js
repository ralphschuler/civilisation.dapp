import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';
import tseslint from 'typescript-eslint';

const storybookFlatRecommended = storybook.configs['flat/recommended'].map((config) =>
  config.files
    ? {
        ...config,
        rules: {
          ...config.rules,
          'storybook/no-renderer-packages': 'off',
        },
      }
    : config,
);

export default tseslint.config(
  {
    ignores: ['dist', 'storybook-static', 'coverage'],
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        projectService: false,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'no-empty-pattern': 'off',
      '@typescript-eslint/consistent-indexed-object-style': 'off',
    },
  },
  ...storybookFlatRecommended,
);
