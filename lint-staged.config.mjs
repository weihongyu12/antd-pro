/**
 * Lint staged configuration
 */
export default {
  '**/*.{js,ts,jsx,tsx}': [
    'pnpm run fix',
  ],
  '**/*.{css,scss,sass,tsx,jsx}': [
    'pnpm run lint:css',
  ],
};
