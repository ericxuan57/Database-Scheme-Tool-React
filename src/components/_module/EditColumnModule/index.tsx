import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { FieldValues, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';

import Button from '../../_ui/Button';
import Input from '../../_ui/Input';
import styles from './styles.module.scss';
import { TColumnVer } from '../../../utils/types';
import { requiredObject, yupString } from '../../../utils/yup';
import { MainContext } from '../../../context';

type Props = {
  isNew?: boolean;
  onClose?: Function;
  data?: TColumnVer;
  onFinished?: Function;
};

const validationSchema = requiredObject({
  column_name: yupString,
  column_type: yupString,
  column_description: yupString,
  change: yupString,
});

const EditColumnModule: React.FC<Props> = ({ isNew, data, onClose = () => {}, onFinished = () => {} }) => {
  const { moduleId, moduleVersion } = useParams();
  const navigate = useNavigate();
  const { fetchModuleContent } = useContext(MainContext);
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(validationSchema) });

  const [isPending, setIsPending] = useState(false);

  const onSubmit = async (formData: FieldValues) => {
    const documentVersion = localStorage.getItem('documentVersion');
    const customerId = localStorage.getItem('customerId');
    const documentId = localStorage.getItem('documentId');
    setIsPending(true);
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/document/module/${moduleId}`, {
        module_version: moduleVersion,
        customer_id: customerId,
        document_version: documentVersion,
        document_id: documentId,
      });

      if (isNew) {
        await axios.post(`${process.env.REACT_APP_API_URL}/document/column`, {
          ...formData,
          pending_id: data?.pending_id,
          module_id: moduleId,
          module_version: documentVersion,
          document_id: documentId,
          customer_id: customerId,
        });
      } else {
        await axios.put(`${process.env.REACT_APP_API_URL}/document/column/${data?.column_id}`, {
          ...formData,
          column_version: data?.column_version,
          pending_id: data?.pending_id,
          module_id: moduleId,
          module_version: documentVersion,
        });
      }
      onClose();
      onFinished();
      if (moduleVersion !== documentVersion) {
        navigate(`/edit/module/${moduleId}/${documentVersion}/column`);
      }
    } catch (error: any) {
      console.error(error);
      alert(error.response.data.message);
    }
    setIsPending(false);
    fetchModuleContent(moduleId, moduleVersion);
  };

  useEffect(() => {
    if (data) {
      reset({
        column_name: data.column_name,
        column_type: data.column_type,
        column_description: data.column_description,
        change: data.change,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formWrapper}>
      <Input register={register('column_name')} error={errors.column_name} placeholder="column name" label="Column:" />
      <Input register={register('column_type')} error={errors.column_type} placeholder="columntype" label="Type:" />
      <Input
        register={register('column_description')}
        error={errors.column_description}
        placeholder="description"
        label="Description:"
      />
      <Input register={register('change')} error={errors.change} placeholder="Change" label="Change:" />

      <div className={styles.btnGroup}>
        <Button type="submit" className={styles.btnContent} isPending={isPending} disabled={isPending}>
          {isNew ? 'CREATE' : 'ACCEPT CHANGES'}
        </Button>
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

export default EditColumnModule;
