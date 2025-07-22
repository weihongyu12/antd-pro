/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from '@rspack/cli';
import { rspack, experiments } from '@rspack/core';
import { ReactRefreshRspackPlugin } from '@rspack/plugin-react-refresh';
import { InjectManifest } from '@aaroon/workbox-rspack-plugin';

const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const ESLintPlugin = require('eslint-rspack-plugin');

const { SubresourceIntegrityPlugin } = experiments;

const isDev = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ['last 2 versions', '> 0.2%', 'not dead', 'Firefox ESR'];

export default defineConfig({
  entry: {
    main: './src/main.tsx',
  },
  resolve: {
    extensions: ['...', '.ts', '.tsx', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: 'asset',
      },
      {
        test: /\.(js|ts)$/,
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                },
              },
              env: { targets },
            },
          },
        ],
      },
      {
        test: /\.(jsx|tsx)$/,
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                    development: isDev,
                    refresh: isDev,
                  },
                },
              },
              env: { targets },
            },
          },
          { loader: 'babel-loader' },
        ],
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          {
            loader: 'sass-loader',
            options: {
              api: 'modern-compiler',
              implementation: require.resolve('sass-embedded'),
            },
          },
        ],
        type: 'css/auto',
      },
    ],
  },
  output: {
    crossOriginLoading: 'anonymous',
  },
  plugins: [
    new SubresourceIntegrityPlugin(),
    new rspack.HtmlRspackPlugin({
      template: './index.html',
    }),
    isProduction ? new InjectManifest({
      swSrc: './src/service-worker.ts',
      dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
      exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE/],
      // Bump up the default maximum size (2mb) that's precached,
      // to make lazy-loading failure scenarios less likely.
      // See https://github.com/cra-template/pwa/issues/13#issuecomment-722667270
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
    }) : null,
    isDev ? new ReactRefreshRspackPlugin() : null,
    // brotli 预压缩
    isProduction ? new CompressionPlugin({
      filename: '[path][base].br[query]',
      algorithm: 'brotliCompress',
      test: /\.(html|js|css|svg|ico|xml|json|wasm|eot|otf|ttf|bmp|md)$/,
      compressionOptions: { level: 11 },
      minRatio: 1,
    }) : null,
    // gzip 预压缩
    isProduction ? new CompressionPlugin({
      filename: '[path][base].gz[query]',
      algorithm: 'gzip',
      test: /\.(html|js|css|svg|ico|xml|json|wasm|eot|otf|ttf|bmp|md)$/,
      compressionOptions: { level: 9 },
      minRatio: 1,
    }) : null,
    new ESLintPlugin(),

    new rspack.EnvironmentPlugin({
      PUBLIC_URL: '',
    }),
  ].filter(Boolean),
  optimization: {
    minimizer: [
      new rspack.SwcJsMinimizerRspackPlugin(),
      new rspack.LightningCssMinimizerRspackPlugin({
        minimizerOptions: { targets },
      }),
    ],
  },
  experiments: {
    css: true,
  },
});
