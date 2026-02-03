import type { FC } from 'react';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { createStyles } from 'antd-style';
import background from './assets/background.png';

const useStyles = createStyles(({ css, token }) => ({
  welcomeDiv: css`
    background-image: url("${background}");
    background-repeat: no-repeat;
    background-position: 100% -30%;
    background-size: 274px auto;
  `,
  title: css`
    font-size: 20px;
    color: ${token.colorTextHeading};
  `,
  description: css`
    width: 65%;
    margin-top: 16px;
    margin-bottom: 32px;
    font-size: 14px;
    line-height: 22px;
    color: ${token.colorTextSecondary};
  `,
}));

const Welcome: FC = function Welcome() {
  const { styles } = useStyles();

  return (
    <PageContainer>
      <ProCard>
        <div className={styles.welcomeDiv}>
          <div className={styles.title}>
            欢迎使用 Ant Design Pro
          </div>
          <p className={styles.description}>
            Ant Design Pro 是一个整合了 Ant Design 和 ProComponents 的脚手架方案。
            致力于在设计规范和基础组件的基础上，继续向上构建，提炼出典型模板/业务组件/配套设计资源，
            进一步提升企业级中后台产品设计研发过程中的『用户』和『设计者』的体验。
          </p>
        </div>
      </ProCard>
    </PageContainer>
  );
};

export default Welcome;
