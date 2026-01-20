// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://cra.link/PWA

const isLocalhost = Boolean(
  globalThis.location.hostname === 'localhost'
    // [::1] is the IPv6 localhost address.
    || globalThis.location.hostname === '[::1]'
    // 127.0.0.0/8 are considered localhost for IPv4.
    || /^127(?:\.(?:25[0-5]|2[0-4]\d|[01]?\d{1,2})){3}$/.test(globalThis.location.hostname),
);

interface Config {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
}

/**
 * 注册有效的 Service Worker
 * @param swUrl Service Worker 脚本的 URL 地址
 * @param config 包含 onSuccess 和 onUpdate 回调的配置对象
 */
async function registerValidSW(swUrl: string, config?: Config) {
  try {
    const registration = await navigator.serviceWorker.register(swUrl);

    registration.addEventListener('updatefound', () => {
      const installingWorker = registration.installing;
      if (installingWorker == null) {
        return;
      }
      installingWorker.addEventListener('statechange', () => {
        if (installingWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // At this point, the updated precached content has been fetched,
            // but the previous service worker will still serve the older
            // content until all client tabs are closed.
            console.log('New content is available and will be used when all tabs for this page are closed.');

            if (config?.onUpdate) {
              config.onUpdate(registration);
            }
          } else {
            // At this point, everything has been precached.
            // It's the perfect time to display a
            // "Content is cached for offline use." message.
            console.log('Content is cached for offline use.');

            // Execute callback
            if (config?.onSuccess) {
              config.onSuccess(registration);
            }
          }
        }
      });
    });
  } catch (error) {
    console.error('Error during service worker registration:', error);
  }
}

/**
 * 检查 Service Worker 是否有效
 * @param swUrl Service Worker 脚本的 URL 地址
 * @param config 包含回调函数的配置对象
 */
async function checkValidServiceWorker(swUrl: string, config?: Config) {
  try {
    // Check if the service worker can be found. If it can't reload the page.
    const response = await fetch(swUrl, {
      headers: { 'Service-Worker': 'script' },
    });

    // Ensure service worker exists, and that we really are getting a JS file.
    const contentType = response.headers.get('content-type');

    // 如果 SW 不存在或不是 JS，注销并刷新页面
    if (
      response.status === 404
        || (contentType != null && !contentType.includes('javascript'))
    ) {
      // No service worker found. Probably a different app. Reload the page.
      const registration = await navigator.serviceWorker.ready;
      await registration.unregister();
      globalThis.location.reload();
    } else {
      // Service worker found. Proceed as normal.
      await registerValidSW(swUrl, config);
    }
  } catch {
    console.log('No internet connection found. App is running in offline mode.');
  }
}

/**
 * 暴露的注册函数，用于启动 Service Worker 注册流程
 * @param config 可选的配置对象，用于处理注册成功或更新后的回调
 */
export function register(config?: Config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.PUBLIC_URL!, globalThis.location.href);
    if (publicUrl.origin !== globalThis.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebook/create-react-app/issues/2374
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    window.addEventListener('load', async () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // This is running on localhost. Let's check if a service worker still exists or not.
        await checkValidServiceWorker(swUrl, config);

        try {
          // Add some additional logging to localhost, pointing developers to the
          // service worker/PWA documentation.
          await navigator.serviceWorker.ready;
          console.log('This web app is being served cache-first by a service worker.');
        } catch (error) {
          console.error('Service worker ready error:', error);
        }
      } else {
        // Is not localhost. Just register service worker
        await registerValidSW(swUrl, config);
      }
    });
  }
}

/**
 * 注销 Service Worker
 */
export async function unregister() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.unregister();
    } catch (error) {
      console.error(error);
    }
  }
}
