// 这段可选代码用于注册 Service Worker
// register() 默认情况下不会被调用

// 这能让应用在后续访问时加载更快，并提供离线功能。但这也意味着开发者（和用户）
// 只有在关闭所有打开的页面标签后才能看到部署的更新，因为之前缓存的资源会在后台更新。

// 要了解更多关于此模型的好处以及如何选择加入的说明，请阅读 https://cra.link/PWA

const isLocalhost = Boolean(
  globalThis.location.hostname === 'localhost'
    // [::1] 是 IPv6 本地主机地址
    || globalThis.location.hostname === '[::1]'
    // 127.0.0.0/8 被视为 IPv4 的本地主机
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
            // 此时，已获取更新的预缓存内容，
            // 但之前的 Service Worker 仍会提供旧内容，直到所有页面标签关闭
            console.log('新内容可用，所有标签页关闭后将使用新内容。');

            if (config?.onUpdate) {
              config.onUpdate(registration);
            }
          } else {
            // 此时，所有内容都已预缓存
            // 是显示"内容已缓存供离线使用"消息的最佳时机
            console.log('内容已缓存供离线使用。');

            // 执行回调
            if (config?.onSuccess) {
              config.onSuccess(registration);
            }
          }
        }
      });
    });
  } catch (error) {
    console.error('Service worker 注册期间出错:', error);
  }
}

/**
 * 检查 Service Worker 是否有效
 * @param swUrl Service Worker 脚本的 URL 地址
 * @param config 包含回调函数的配置对象
 */
async function checkValidServiceWorker(swUrl: string, config?: Config) {
  try {
    // 检查是否能找到 Service Worker。如果找不到则重新加载页面
    const response = await fetch(swUrl, {
      headers: { 'Service-Worker': 'script' },
    });

    // 确保 Service Worker 存在，且我们确实获得了一个 JS 文件
    const contentType = response.headers.get('content-type');

    // 如果 SW 不存在或不是 JS，注销并刷新页面
    if (
      response.status === 404
        || (contentType != null && !contentType.includes('javascript'))
    ) {
      // 没找到 Service Worker。可能是不同的应用。重新加载页面
      const registration = await navigator.serviceWorker.ready;
      await registration.unregister();
      globalThis.location.reload();
    } else {
      // 找到了 Service Worker。按正常流程执行
      await registerValidSW(swUrl, config);
    }
  } catch {
    console.log('未找到网络连接。应用正在离线模式下运行。');
  }
}

/**
 * 暴露的注册函数，用于启动 Service Worker 注册流程
 * @param config 可选的配置对象，用于处理注册成功或更新后的回调
 */
export function register(config?: Config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // 所有支持 SW 的浏览器都提供 URL 构造函数
    const publicUrl = new URL(process.env.PUBLIC_URL!, globalThis.location.href);
    if (publicUrl.origin !== globalThis.location.origin) {
      // 如果 PUBLIC_URL 与页面服务来源不同，则我们的 Service Worker 将无法工作
      // 这可能在使用 CDN 提供资源时发生；参见 https://github.com/facebook/create-react-app/issues/2374
      return;
    }

    window.addEventListener('load', async () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // 正在本地主机上运行。让我们检查 Service Worker 是否仍然存在
        await checkValidServiceWorker(swUrl, config);

        try {
          // 添加一些额外的日志到本地主机，指引开发者到 Service Worker/PWA 文档
          await navigator.serviceWorker.ready;
          console.log('此 Web 应用正由 Service Worker 以缓存优先的方式提供服务。');
        } catch (error) {
          console.error('Service worker 准备就绪错误:', error);
        }
      } else {
        // 不是本地主机。只需注册 Service Worker
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
