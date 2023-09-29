import React, { ReactNode } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

type Props = {
  type?: 'submit' | 'button' | 'reset';
  buttonStyle?: 'primary' | 'white' | 'dark';
  buttonSize?: 'large' | 'medium' | 'small';
  className?: string;
  children: ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  isPending?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  id?: string;
};

const Button: React.FC<Props> = ({
  id,
  type = 'button',
  buttonStyle = 'primary',
  buttonSize = 'medium',
  className = '',
  children,
  onClick = () => {},
  isPending = false,
  disabled = false,
  fullWidth = false,
}) => {
  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classNames(className, styles.buttonStyle, styles[buttonSize], styles[buttonStyle], {
        'w-full': fullWidth,
        'cursor-wait': isPending,
      })}
    >
      {isPending ? 'Loading...' : children}
    </button>
  );
};

export default Button;
