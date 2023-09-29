import { Fragment, ReactNode, useRef } from 'react';
import classNames from 'classnames';
import { Transition } from '@headlessui/react';

import styles from './styles.module.scss';
import useOutsideClick from '../../../hook/useOutsideClick';
import { ReactComponent as CloseCircle } from '../../../assets/svgs/close.svg';

type Props = {
  isShown: boolean;
  onClose?: Function;
  children?: ReactNode;
  width?: 'large' | 'middle' | 'small';
  closeBtn?: boolean;
};
const Modal: React.FC<Props> = ({
  isShown = false,
  closeBtn = false,
  onClose = () => {},
  children,
  width = 'middle',
}) => {
  const ref = useRef<HTMLInputElement | null>(null);

  useOutsideClick(ref, onClose);

  return (
    <>
      <Transition appear show={isShown} as={Fragment}>
        <div className={styles.wrapper}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className={styles.layer} />
          </Transition.Child>

          <div className={styles.modalWrapper}>
            <div className={styles.modal}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className={classNames(styles.content, styles[width])} ref={ref}>
                  {!closeBtn && (
                    <div className={styles.modalCloseBtn} onClick={() => onClose()}>
                      <CloseCircle />
                    </div>
                  )}
                  {children}
                </div>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
};

export default Modal;
