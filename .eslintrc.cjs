// eslint-disable-next-line max-len
/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-var-requires */
const reactPlugin = require('eslint-config-airbnb/rules/react');

const parserOptions = {
  project: [
    './tsconfig.json',
    './tsconfig.node.json',
  ],
};

const settings = {
  'import/resolver': {
    typescript: {
      project: './tsconfig.json',
    },
  },
};

const extendsConfig = [
  'airbnb',
  'airbnb-typescript',
  // 仅 Next.js 项目需要引入
  // 'plugin:@next/next/recommended',
  'plugin:react-hooks/recommended-latest',
  'plugin:no-unsanitized/recommended-legacy',
  'plugin:@typescript-eslint/recommended-type-checked',
  'plugin:react-perf/recommended',
  'plugin:@tanstack/query/recommended',
  // 以下为实验性功能
  'plugin:@typescript-eslint/stylistic-type-checked',
  'plugin:unicorn/recommended',
  // 'plugin:tailwindcss/recommended',
  'plugin:promise/recommended',
  'plugin:regexp/recommended',
  'plugin:jsdoc/recommended-typescript',
  'plugin:eslint-comments/recommended',
];

const plugins = [
  'risxss',
  'react-refresh',
];

const rules = {
  // React 17+ 不用再引入 React
  'react/react-in-jsx-scope': 'off',
  'react/jsx-uses-react': 'off',
  // 常见的缩写是众所周知且易于阅读的
  'unicorn/prevent-abbreviations': 'off',
  // Airbnb 更喜欢使用 forEach
  'unicorn/no-array-for-each': 'off',
  // null 在项目中是常见场景
  'unicorn/no-null': 'off',
  // airbnb风格指南要求"基本文件名应该完全匹配其默认导出的名称"
  'unicorn/filename-case': 'off',
  // RisXSS 规则,预防 XSS 攻击
  'risxss/catch-potential-xss-react': 'error',
  'react-refresh/only-export-components': 'error',
  // 以下规则不适合 Ant Design
  '@typescript-eslint/no-floating-promises': 'off',
};

module.exports = {
  root: true,
  parserOptions: {
    ...parserOptions,
  },
  extends: [
    ...extendsConfig,
  ],
  settings: {
    ...settings,
  },
  plugins: [
    ...plugins,
  ],
  rules: {
    ...rules,
  },

  overrides: [
    {
      files: '*.tsx',
      parserOptions: {
        ...parserOptions,
      },
      extends: [
        ...extendsConfig,
      ],
      settings: {
        ...settings,
      },
      plugins: [
        ...plugins,
      ],
      rules: {
        ...rules,
        'react/require-default-props': [
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          reactPlugin.rules['react/require-default-props'][0],
          {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            ...reactPlugin.rules['react/require-default-props'][1],
            functions: 'defaultArguments',
          },
        ],
      },
    },
    {
      files: [
        '.eslintrc.cjs',
        'babel.config.cjs',
        'rspack.config.ts',
        'jest.config.ts',
        '*.config.js',
        '*.config.ts',
        '*.config.mjs',
      ],
      parserOptions: {
        ...parserOptions,
      },
      extends: [
        ...extendsConfig,
        'plugin:n/recommended',
      ],
      settings: {
        ...settings,
      },
      plugins: [
        ...plugins,
      ],
      rules: {
        ...rules,
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
          },
        ],
        'unicorn/prefer-module': 'off',
      },
    },
  ],
};
