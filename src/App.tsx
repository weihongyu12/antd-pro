import { lazy } from 'react';
import { HashRouter, Route, Routes } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import type { FC } from 'react';
import 'dayjs/locale/zh-cn';

const DefaultLayout = lazy(async () => import('./layouts/Default'));

const Welcome = lazy(async () => import('./pages/Welcome'));

const queryClient = new QueryClient();

const App: FC = function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={{ cssVar: true }} locale={zhCN}>
        <HashRouter>
          <Routes>
            <Route element={<DefaultLayout />} path="/">
              <Route index element={<Welcome />} />
            </Route>
          </Routes>
        </HashRouter>
      </ConfigProvider>

      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default App;
