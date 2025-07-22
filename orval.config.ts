// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: './oneapi.json',
    output: {
      client: 'react-query',
      target: './src/services/index.ts',
      schemas: 'src/services/models',
      override: {
        mutator: {
          path: './src/services/mutator/custom-instance.ts',
          name: 'fetchInstance',
        },
      },
    },
  },
});
