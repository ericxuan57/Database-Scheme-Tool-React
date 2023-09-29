import React, { useContext, useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Button from '../../_ui/Button';
import Input from '../../_ui/Input';
import styles from './styles.module.scss';
import { requiredObject, requiredString, yupString } from '../../../utils/yup';
import { TModuleVer, TSection } from '../../../utils/types';
import ComboBox from '../../_ui/ComboBox';
import { MainContext } from '../../../context';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

type Props = {
  isNew?: boolean;
  onClose?: Function;
  data?: TModuleVer;
  onFinished?: Function;
};

const validationSchema = requiredObject({
  section_id: requiredString,
  module_name: requiredString,
  module_description: yupString,
  module_inclusion: yupString,
  module_exclusion: yupString,
  module_granularity: yupString,
  module_identifiers: yupString,
  change: yupString,
});

const EditModule: React.FC<Props> = ({ isNew, onClose = () => {}, data, onFinished = () => {} }) => {
  const { moduleId, moduleVersion } = useParams();
  const { sectionList } = useContext(MainContext);
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(validationSchema) });

  const [isPending, setIsPending] = useState(false);

  const onSubmit = async (formData: FieldValues) => {
    setIsPending(true);
    try {
      const documentVersion = localStorage.getItem('documentVersion');
      const customerId = localStorage.getItem('customerId');
      const documentId = localStorage.getItem('documentId');
      if (isNew) {
        await axios.post(`${process.env.REACT_APP_API_URL}/document/module`, {
          ...formData,
          customer_id: customerId,
          document_version: documentVersion,
          document_id: documentId,
        });

        onFinished();
      } else {
        await axios.put(`${process.env.REACT_APP_API_URL}/document/module/${moduleId}`, {
          ...formData,
          module_version: data?.module_version,
          customer_id: customerId,
          document_version: documentVersion,
          document_id: documentId,
        });
      }
      ///
      onClose();
    } catch (error: any) {
      console.error(error);
      alert(error.response.data.message);
    }
    setIsPending(false);
  };

  useEffect(() => {
    if (data) {
      reset({
        module_name: data.module_name,
        module_description: data.module_description,
        module_inclusion: data.module_inclusion,
        module_exclusion: data.module_exclusion,
        module_granularity: data.module_granularity,
        module_identifiers: data.module_identifiers,
        change: data.change,
        section_id: data.module.section_id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formWrapper}>
      <Controller
        name="section_id"
        control={control}
        render={({ field: { onChange, value = '' }, fieldState: { error } }) => (
          <>
            <ComboBox
              list={sectionList}
              label="Section:"
              nameField="section_name"
              value={sectionList.find(item => item.section_id === value)}
              onChange={(val?: TSection) => {
                onChange(val?.section_id);
              }}
              className={styles.combo}
            />
            {error ? (
              <div className="flex-1">
                <p className="error">{error.message}</p>
              </div>
            ) : (
              false
            )}
          </>
        )}
      />

      <Input register={register('module_name')} error={errors.module_name} placeholder="module name" label="Module:" />
      <Input
        register={register('module_description')}
        error={errors.module_description}
        placeholder="description"
        label="Description:"
      />
      <Input
        register={register('module_inclusion')}
        error={errors.module_inclusion}
        placeholder="inclusions"
        label="Inclusions:"
      />
      <Input
        register={register('module_exclusion')}
        error={errors.module_exclusion}
        placeholder="exclusions"
        label="Exclusions:"
      />
      <Input
        register={register('module_granularity')}
        error={errors.module_granularity}
        placeholder="granularity"
        label="Granularity:"
      />
      <Input
        register={register('module_identifiers')}
        error={errors.module_identifiers}
        placeholder="Identifiers"
        label="IDs:"
      />
      <Input register={register('change')} error={errors.change} placeholder="Change" label="Change:" />

      <div className={styles.btnGroup}>
        <Button type="submit" className={styles.btnContent} isPending={isPending} disabled={isPending}>
          {isNew ? 'CREATE MODULE' : 'ACCEPT CHANGES'}
        </Button>
        {!isNew && (
          <Link to={`/edit/module/${moduleId}/${moduleVersion}/column`}>
            <Button type="submit" buttonStyle="dark" className={styles.btnContent}>
              SHOW COLUMNS
            </Button>
          </Link>
        )}
        <Button
          type="button"
          buttonStyle="white"
          className={styles.btnContent}
          onClick={() => {
            onClose();
          }}
        >
          CANCEL
        </Button>
      </div>
    </form>
  );
};

export default EditModule;
