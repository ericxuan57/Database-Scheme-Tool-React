import React, { ReactNode } from 'react';
import styles from './styles.module.scss';

type Props = {
  children: ReactNode;
};

const Container: React.FC<Props> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default Container;
