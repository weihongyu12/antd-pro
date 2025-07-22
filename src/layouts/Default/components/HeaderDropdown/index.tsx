import { Dropdown } from 'antd';
import { createStyles } from 'antd-style';
import { clsx } from 'clsx';

import type { DropDownProps } from 'antd/es/dropdown';
import type { FC } from 'react';

export type HeaderDropdownProps = {
  overlayClassName?: string;
  placement?:
  | 'bottomLeft'
  | 'bottomRight'
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'bottomCenter';
} & Omit<DropDownProps, 'overlay'>;

const useStyles = createStyles(({ token }) => ({
  dropdown: {
    [`@media screen and (max-width: ${token.screenXS}px)`]: {
      width: '100%',
    },
  },
}));

const HeaderDropdown: FC<HeaderDropdownProps> = function HeaderDropdown({
  overlayClassName = '',
  ...props
}) {
  const { styles } = useStyles();

  return (
    <Dropdown
      overlayClassName={clsx(styles.dropdown, overlayClassName)}
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...props}
    />
  );
};

export default HeaderDropdown;
