import { type FC } from 'react';
import { Flex, Spin } from 'antd';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ css }) => ({
  root: css`
    width: 100%;
    height: 100vh;
  `,
}));

const AppLoading: FC = function AppLoading() {
  const { styles } = useStyles();
  return (
    <Flex
      className={styles.root}
      align="center"
      justify="center"
    >
      <Spin size="large" />
    </Flex>
  );
};

export default AppLoading;
