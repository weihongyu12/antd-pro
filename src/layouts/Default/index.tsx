import type { FC } from 'react';
import { Outlet } from 'react-router';
import { ProLayout, getMenuData } from '@ant-design/pro-components';
import { routes } from '@/router';
import { AvatarDropdown } from './components';

const DefaultLayout: FC = function DefaultLayout() {
  const { menuData } = getMenuData(
    routes,
    { locale: false },
  );

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
      menuDataRender={() => menuData}
      avatarProps={{
        src: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        title: <span className="anticon">魏宏裕</span>,
        render: (_, avatarChildren) => <AvatarDropdown>{avatarChildren}</AvatarDropdown>,
      }}
      bgLayoutImgList={[
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
      ]}
      menu={{
        locale: false,
      }}
      route={[
        {
          path: '/',
          name: '欢迎',
          icon: 'smile',
        },
      ]}
      waterMarkProps={{
        content: '魏宏裕',
      }}
    >
      <Outlet />
    </ProLayout>
  );
};

export default DefaultLayout;
