import path from 'node:path';

import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import { configs, plugins, rules } from 'eslint-config-airbnb-extended';
import unicorn from 'eslint-plugin-unicorn';
import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import noUnsanitized from 'eslint-plugin-no-unsanitized';
import promise from 'eslint-plugin-promise';
import regexp from 'eslint-plugin-regexp';
import jsdoc from 'eslint-plugin-jsdoc';

import reactHooks from 'eslint-plugin-react-hooks';
import reactPerf from 'eslint-plugin-react-perf';
import tanstackQuery from '@tanstack/eslint-plugin-query';
import reactRefresh from 'eslint-plugin-react-refresh';
import risXss from 'eslint-plugin-risxss';

import node from 'eslint-plugin-n';

const gitignorePath = path.resolve('.', '.gitignore');

const jsConfig = defineConfig([
  // ESLint recommended config
  {
    name: 'js/config',
    ...js.configs.recommended,
  },
  // Stylistic plugin
  plugins.stylistic,
  // Import X plugin
  plugins.importX,
  // Airbnb base recommended config
  ...configs.base.recommended,

  unicorn.configs.recommended,
  promise.configs['flat/recommended'],
  regexp.configs.recommended,
  comments.recommended,
  noUnsanitized.configs.recommended,

  {
    rules: {
      // 常见的缩写是众所周知且易于阅读的
      'unicorn/prevent-abbreviations': 'off',
      // Airbnb 更喜欢使用 forEach
      'unicorn/no-array-for-each': 'off',
      // null 在项目中是常见场景
      'unicorn/no-null': 'off',
      // airbnb风格指南要求"基本文件名应该完全匹配其默认导出的名称"
      'unicorn/filename-case': 'off',
    },
  },

  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    ...jsdoc.configs['flat/recommended'],
  },
]);

const reactConfig = defineConfig([
  // React plugin
  plugins.react,
  // React hooks plugin
  plugins.reactHooks,
  // React JSX A11y plugin
  plugins.reactA11y,
  // Airbnb React recommended config
  ...configs.react.recommended,

  reactHooks.configs.flat['recommended-latest'],
  reactPerf.configs.flat.recommended,
  ...tanstackQuery.configs['flat/recommended'],
  reactRefresh.configs.recommended,

  {
    rules: {
      // React 17+ 不用再引入 React
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
    },
  },

  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      risxss: risXss,
    },
    rules: {
      'risxss/catch-potential-xss-react': 'error',
    },
  },
]);

const typescriptConfig = defineConfig([
  // TypeScript ESLint plugin
  plugins.typescriptEslint,
  // Airbnb base TypeScript config
  ...configs.base.typescript,
  // Airbnb React TypeScript config
  ...configs.react.typescript,

  {
    files: ['**/*.{ts,tsx}'], // 只对 TS 文件
    ...jsdoc.configs['flat/recommended-typescript'],
  },

  {
    files: ['**/*.tsx'],
    rules: {
      // 以下规则不适合 Ant Design
      '@typescript-eslint/no-floating-promises': 'off',

      'react/require-default-props': [
        rules?.react?.base?.rules['react/require-default-props'][0],
        {
          ...rules?.react?.base?.rules['react/require-default-props'][1],
          functions: 'defaultArguments',
        },
      ],
    },
  },
]);

const nodeConfig = defineConfig([
  {
    files: [
      'babel.config.cjs',
      'rspack.config.ts',
      'jest.config.ts',
      '*.config.js',
      '*.config.ts',
      '*.config.mjs',
    ],
    ...node.configs['flat/recommended-script'],
    rules: {
      'import-x/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
        },
      ],
    },
  },
]);

export default defineConfig([
  // Ignore files and folders listed in .gitignore
  includeIgnoreFile(gitignorePath),
  // JavaScript config
  ...jsConfig,
  // React config
  ...reactConfig,
  // TypeScript config
  ...typescriptConfig,
  // Node.js config
  ...nodeConfig,
]);
