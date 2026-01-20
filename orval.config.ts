import { defineConfig } from 'orval';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
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
