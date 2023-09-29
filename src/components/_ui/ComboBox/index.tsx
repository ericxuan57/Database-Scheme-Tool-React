import React, { Fragment, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { ReactComponent as ChevronDown } from '../../../assets/svgs/chevron_down.svg';

import styles from './styles.module.scss';
import classNames from 'classnames';
import { formatVersion } from '../../../utils/functions';

type ComboBoxProps = {
  label?: string;
  list: any[];
  value?: any;
  onChange?: Function;
  nameField?: string;
  className?: string;
};

const ComboBox: React.FC<ComboBoxProps> = ({
  list,
  label,
  value = {},
  onChange = () => {},
  nameField = '',
  className,
}) => {
  const [query, setQuery] = useState('');

  const filteredList =
    query === ''
      ? list
      : list.filter((item: any) =>
          item[nameField].toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))
        );

  return (
    <Combobox
      as="div"
      value={value}
      onChange={(val: any) => {
        onChange(val);
      }}
      className={classNames(styles.wrapper, className)}
      nullable
    >
      <Combobox.Label className={styles.label}>{label}</Combobox.Label>
      <div className="relative w-full">
        <Combobox.Input
          className={styles.inputWrapper}
          displayValue={(item: any) =>
            nameField === 'document_version' ? formatVersion(item[nameField]) : item[nameField]
          }
          onChange={event => setQuery(event.target.value)}
          placeholder="Not Selected"
        />
        <Combobox.Button className={styles.buttonWrapper}>
          <ChevronDown width={30} />
        </Combobox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery('')}
        >
          <Combobox.Options className={styles.menuWrapper}>
            {filteredList.map((item: any, index: number) => (
              <Combobox.Option
                key={index}
                className={({ active, selected }) =>
                  classNames(styles.optionWrapper, { [styles.active]: active }, { [styles.select]: selected })
                }
                value={item}
              >
                <p>{nameField === 'document_version' ? formatVersion(item[nameField]) : item[nameField]}</p>
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};

export default ComboBox;
