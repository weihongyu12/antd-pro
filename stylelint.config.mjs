export default {
  extends: [
    'stylelint-config-twbs-bootstrap',
  ],
  overrides: [
    {
      files: ['**/*.{jsx,tsx}'],
      customSyntax: 'postcss-styled-syntax',
      rules: {
        '@stylistic/no-empty-first-line': null,
        '@stylistic/no-eol-whitespace': null,
        '@stylistic/no-missing-end-of-source-newline': null,
      },
    },
  ],
};
