import { Suspense, useEffect, useMemo } from 'react';
import { RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import type { FC } from 'react';
import 'dayjs/locale/zh-cn';
import router from './router';
import { register } from './serviceWorkerRegistration';

const queryClient = new QueryClient();

const App: FC = function App() {
  useEffect(() => {
    register();
  }, []);

  const antdTheme = useMemo(() => ({
    cssVar: true,
  }), []);

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={antdTheme} locale={zhCN}>
        <Suspense fallback={<div>Loading...</div>}>
          <RouterProvider router={router} />
        </Suspense>
      </ConfigProvider>

      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default App;
