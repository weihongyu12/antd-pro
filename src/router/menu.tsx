import { lazy } from 'react';
import { HomeOutlined } from '@ant-design/icons';
import type { Route } from '@ant-design/pro-components/lib/layout/typing';

const Welcome = lazy(() => import('@/pages/Welcome'));

const menu: Route[] = [
  {
    index: true,
    path: '/',
    Component: Welcome,
    name: '欢迎',
    icon: <HomeOutlined />,
  },
];

export default menu;
