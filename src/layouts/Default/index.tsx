import { Suspense, useMemo, useCallback } from 'react';
import type { FC, ReactNode } from 'react';
import { Outlet } from 'react-router';
import { ProLayout, getMenuData } from '@ant-design/pro-components';
import menu from '@/router/menu';
import { AvatarDropdown } from './components';

/**
 * 将 Avatar render 函数提取到组件外部
 * @param _ - 未使用的参数
 * @param avatarChildren - Avatar 子元素
 * @returns 返回包裹了 AvatarDropdown 的元素
 */
function AvatarRender(_: unknown, avatarChildren: ReactNode): ReactNode {
  return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
}

const DefaultLayout: FC = function DefaultLayout() {
  const { menuData } = getMenuData(
    menu,
    { locale: false },
  );

  const avatarTitle = useMemo(() => <span>魏宝裕</span>, []);

  const avatarProps = useMemo(() => ({
    src: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    title: avatarTitle,
    render: AvatarRender,
  }), [avatarTitle]);

  const menuConfig = useMemo(() => ({
    locale: false,
  }), []);

  const bgLayoutImgList = useMemo(() => [
    {
      src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
      left: 85,
      bottom: 100,
      height: '303px',
    },
    {
      src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
      bottom: -68,
      right: -45,
      height: '303px',
    },
    {
      src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
      bottom: 0,
      left: 0,
      width: '331px',
    },
  ], []);

  const routeConfig = useMemo(() => [
    {
      path: '/',
      name: '欢迎',
      icon: 'smile',
    },
  ], []);

  const waterMarkConfig = useMemo(() => ({
    content: '魏宝裕',
  }), []);

  const menuDataRender = useCallback(() => menuData, [menuData]);

  return (
    <ProLayout
      title="Ant Design Pro"
      logo="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
      layout="mix"
      contentWidth="Fluid"
      navTheme="light"
      colorPrimary="#1890ff"
      fixedHeader={false}
      fixSiderbar
      colorWeak={false}
      menuDataRender={menuDataRender}
      avatarProps={avatarProps}
      bgLayoutImgList={bgLayoutImgList}
      menu={menuConfig}
      route={routeConfig}
      waterMarkProps={waterMarkConfig}
    >
      <Suspense>
        <Outlet />
      </Suspense>
    </ProLayout>
  );
};

export default DefaultLayout;
