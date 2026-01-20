import { useCallback, useMemo } from 'react';
import type { FC, ReactNode } from 'react';
import { useNavigate } from 'react-router';
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { createStyles } from 'antd-style';
import type { MenuProps, DropdownProps } from 'antd';
import type { MenuInfo } from 'rc-menu/lib/interface';
import HeaderDropdown from '../HeaderDropdown';

export interface AvatarDropdownProps {
  menu?: boolean;
  children?: ReactNode;
}

const useStyles = createStyles(({ token }) => ({
  action: {
    display: 'flex',
    height: '48px',
    marginLeft: 'auto',
    overflow: 'hidden',
    alignItems: 'center',
    padding: '0 8px',
    cursor: 'pointer',
    borderRadius: token.borderRadius,
    '&:hover': {
      backgroundColor: token.colorBgTextHover,
    },
  },
}));

const AvatarDropdown: FC<AvatarDropdownProps> = function AvatarDropdown({
  menu = false,
  children = null,
}) {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { styles } = useStyles();

  const onMenuClick: MenuProps['onClick'] = useCallback((event: MenuInfo) => {
    const { key } = event;

    navigate(`/account/${key}`);
  }, [navigate]);

  const menuItems = useMemo(() => [
    ...(menu
      ? [
        {
          key: 'center',
          icon: <UserOutlined />,
          label: '个人中心',
        },
        {
          key: 'settings',
          icon: <SettingOutlined />,
          label: '个人设置',
        },
        {
          type: 'divider' as const,
        },
      ]
      : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ], [menu]);

  const menuConfig: DropdownProps['menu'] = useMemo(
    () => ({
      selectedKeys: [],
      onClick: onMenuClick,
      items: menuItems,
    }),
    [menuItems, onMenuClick],
  );

  return (
    <HeaderDropdown
      menu={menuConfig}
    >
      {children}
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
