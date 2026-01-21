import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { defineConfig } from '@rspack/cli';
import { rspack } from '@rspack/core';
import type { Configuration, RspackPluginInstance } from '@rspack/core';
import { ReactRefreshRspackPlugin } from '@rspack/plugin-react-refresh';
import { InjectManifest } from '@aaroon/workbox-rspack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import type * as Compression from 'compression-webpack-plugin';
import type * as ESLintPluginType from 'eslint-rspack-plugin';
import type * as NodePolyfillType from 'node-polyfill-webpack-plugin';

const require = createRequire(import.meta.url);

const CompressionPlugin = require('compression-webpack-plugin') as typeof Compression;
const ESLintPlugin = require('eslint-rspack-plugin') as typeof ESLintPluginType;
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin') as typeof NodePolyfillType;

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const isDev = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ['last 2 versions', '> 0.2%', 'not dead', 'Firefox ESR'];

const config: Configuration = {
  entry: {
    main: './src/main.tsx',
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
  },
  resolve: {
    extensions: ['...', '.ts', '.tsx', '.jsx'],
    alias: {
      '@': path.resolve(dirname, './src'),
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
      {
        test: /\.(jpe?g|png|gif|tif|webp|avif)$/i,
        enforce: 'pre',
        use: [
          {
            loader: ImageMinimizerPlugin.loader,
            options: {
              minimizer: {
                implementation: ImageMinimizerPlugin.imageminMinify,
                options: {
                  plugins: [
                    ['gifsicle', { optimizationLevel: 3, interlaced: true }],
                    ['jpegtran', { progressive: true }],
                    ['optipng', { optimizationLevel: 7 }],
                    // Svgo configuration here https://github.com/svg/svgo#configuration
                    [
                      'svgo',
                      {
                        plugins: [
                          {
                            name: 'preset-default',
                            params: {
                              overrides: {
                                removeViewBox: false,
                                addAttributesToSVGElement: {
                                  params: {
                                    attributes: [
                                      { xmlns: 'http://www.w3.org/2000/svg' },
                                    ],
                                  },
                                },
                              },
                            },
                          },
                        ],
                      },
                    ],
                  ],
                },
              },
              generator: [
                {
                  // 可以使用"?as=webp"生成器,生成 WebP 图片格式
                  preset: 'webp',
                  implementation: ImageMinimizerPlugin.imageminGenerate,
                  options: {
                    plugins: [['imagemin-webp', { quality: 100, lossless: true }]],
                  },
                },
                {
                  // 可以使用"?as=avif"生成器,生成 WebP 图片格式
                  preset: 'avif',
                  implementation: ImageMinimizerPlugin.sharpGenerate,
                  options: {
                    encodeOptions: {
                      avif: { lossless: false },
                    },
                  },
                },
              ],
            },
          },
        ],
        type: 'asset/resource',
      },
    ],
  },
  output: {
    filename: isProduction ? '[name].[contenthash:8].js' : undefined,
    clean: true,
    module: isProduction,
    chunkFormat: isProduction ? 'module' : undefined,
    chunkLoading: isProduction ? 'import' : undefined,
    workerChunkLoading: isProduction ? 'import' : undefined,
    crossOriginLoading: 'anonymous',
  },
  plugins: [
    new rspack.SubresourceIntegrityPlugin(),
    new rspack.HtmlRspackPlugin({
      template: './index.html',
      scriptLoading: isProduction ? 'module' : 'defer',
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    isDev ? new ReactRefreshRspackPlugin() : null,
    // brotli 预压缩
    isProduction ? new CompressionPlugin({
      filename: '[path][base].br[query]',
      algorithm: 'brotliCompress',
      test: /\.(html|js|css|svg|ico|xml|json|wasm|eot|otf|ttf|bmp|md)$/,
      compressionOptions: { level: 11 },
      minRatio: 1,
    }) as unknown as RspackPluginInstance : null,
    // gzip 预压缩
    isProduction ? new CompressionPlugin({
      filename: '[path][base].gz[query]',
      algorithm: 'gzip',
      test: /\.(html|js|css|svg|ico|xml|json|wasm|eot|otf|ttf|bmp|md)$/,
      compressionOptions: { level: 9 },
      minRatio: 1,
    }) as unknown as RspackPluginInstance : null,
    new ESLintPlugin() as unknown as RspackPluginInstance,

    new rspack.EnvironmentPlugin({
      PUBLIC_URL: '',
    }),

    new NodePolyfillPlugin() as unknown as RspackPluginInstance,
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
    outputModule: isProduction,
  },
  devtool: isDev ? 'eval-cheap-module-source-map' : false,
  lazyCompilation: false,
};

export default defineConfig(config);
