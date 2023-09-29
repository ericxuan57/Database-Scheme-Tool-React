import React, { InputHTMLAttributes } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

import styles from './styles.module.scss';
import classNames from 'classnames';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  register?: UseFormRegisterReturn<string>;
  error?: any;
};

const Input: React.FC<Props> = ({ id, className, register, error, label, type = 'text', ...props }) => {
  return (
    <div className={classNames(className, styles.wrapper)}>
      {label && (
        <div className="w-100">
          <label>{label}</label>
        </div>
      )}
      <div className="w-full">
        <input {...props} type={type} className={classNames(styles.input, { [styles.error]: error })} {...register} />
        {error ? (
          <div className="flex-1">
            <p className="error">{error.message}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Input;
