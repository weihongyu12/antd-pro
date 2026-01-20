import { lazy } from 'react';
import type { Route } from '@ant-design/pro-components/lib/layout/typing';
import menu from './menu';

const DefaultLayout = lazy(() => import('@/layouts/Default'));

const defaultRoutes: Route[] = [
  {
    path: '/',
    Component: DefaultLayout,
    children: [
      ...menu,
    ],
  },
];

export default defaultRoutes;
