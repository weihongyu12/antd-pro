/// <reference lib="webworker" />

// 这个 Service Worker 可以自定义！
// 请查看 https://developers.google.com/web/tools/workbox/modules
// 获取可用的 Workbox 模块列表，或添加任何其他代码
// 如果您不想使用 Service Worker，也可以删除此文件，Workbox 构建步骤将被跳过

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

clientsClaim();

// 预缓存构建过程生成的所有资源
// 它们的 URL 被注入到下面的 manifest 变量中
// 即使您决定不使用预缓存，此变量也必须出现在您的 Service Worker 文件中的某个位置
// 请参阅 https://cra.link/PWA
// eslint-disable-next-line no-underscore-dangle
precacheAndRoute(self.__WB_MANIFEST);

// 设置 App Shell 风格的路由，以便所有导航请求都通过您的 index.html 壳来满足
// 了解更多请访问 https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = /\/[^/?][^./?]*\.[^/]+$/;
registerRoute(
  // 返回 false 以豁免请求不被 index.html 满足
  ({ request, url }: { request: Request; url: URL }) => {
    // 如果这不是导航请求，则跳过
    if (request.mode !== 'navigate') {
      return false;
    }

    // 如果这是以 /_ 开头的 URL，则跳过
    if (url.pathname.startsWith('/_')) {
      return false;
    }

    // 如果这看起来像是资源 URL，因为它包含文件扩展名，则跳过
    if (fileExtensionRegexp.test(url.pathname)) {
      return false;
    }

    // 返回 true 表示我们要使用处理器
    return true;
  },
  createHandlerBoundToURL(`${process.env.PUBLIC_URL}/index.html`),
);

// 一个运行时缓存路由示例，用于处理未被预缓存处理的请求
// 在这种情况下，同源的 .png 请求，如 public/ 中的那些
registerRoute(
  // 根据需要添加其他文件扩展名或路由条件
  ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.png'),
  // 根据需要自定义此策略，例如，更改为 CacheFirst
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      // 确保一旦此运行时缓存达到最大大小，最近最少使用的图像将被移除
      new ExpirationPlugin({ maxEntries: 50 }),
    ],
  }),
);

// 这允许 Web 应用通过 registration.waiting.postMessage({type: 'SKIP_WAITING'}) 触发跳过等待
self.addEventListener('message', (event) => {
  if (event.data && (event.data as { type: string }).type === 'SKIP_WAITING') {
    self.skipWaiting().catch((error: unknown) => {
      console.error('跳过等待错误:', error);
    });
  }
});

// 任何其他自定义 Service Worker 逻辑都可以放在这里
