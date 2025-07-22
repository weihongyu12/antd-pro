const reactRules = require('eslint-config-airbnb/rules/react');

module.exports = {
  root: true,
  parserOptions: {
    project: [
      './tsconfig.json',
      './tsconfig.node.json',
    ],
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    // 'plugin:@typescript-eslint/recommended-type-checked',
    // 'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:@tanstack/query/recommended',
    'plugin:no-unsanitized/recommended-legacy',
  ],
  plugins: [
    'react-refresh',
  ],
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  rules: {
    'no-console': process.env.NODEV === 'production' ? 'error' : 'off',
    'react/react-in-jsx-scope': 'off',
    'react-refresh/only-export-components': 'error',
  },
  overrides: [
    {
      files: '*.tsx',
      rules: {
        'react/require-default-props': [reactRules.rules['react/require-default-props'][0], {
          ...reactRules.rules['react/require-default-props'][1],
          functions: 'defaultArguments',
        }],
      },
    },
  ],
};
