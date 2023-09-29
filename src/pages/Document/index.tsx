import React, { useContext, useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Button from '../../components/_ui/Button';
import Container from '../../components/_module/Container';
import Input from '../../components/_ui/Input';
import Modal from '../../components/_ui/Modal';
import styles from './styles.module.scss';
import { MainContext } from '../../context';
import { TDocument } from '../../utils/types';
import { requiredObject, requiredString } from '../../utils/yup';

const validationSchema = requiredObject({
  document_name: requiredString,
});

const DocumentPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const { documentList, fetchDocuments } = useContext(MainContext);
  const [isShow, setIsShow] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<TDocument>();
  const [newDocument, setNewDocument] = useState(false);

  useEffect(() => {
    reset({ document_name: selectedDocument?.document_name });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDocument]);

  const onSubmit = async (data: FieldValues) => {
    if (newDocument) {
      await axios.post(`${process.env.REACT_APP_API_URL}/document/create`, {
        document_name: data.document_name,
      });
    } else {
      await axios.put(`${process.env.REACT_APP_API_URL}/document/update`, {
        document_id: selectedDocument?.document_id,
        document_name: data.document_name,
      });
    }

    fetchDocuments();
    setIsShow(false);
  };

  return (
    <Container>
      <div>
        <Link to={'/'}>
          <Button className="mb-10">Home</Button>
        </Link>
        <div className={styles.wrapper}>
          {documentList.map(item => (
            <div key={item.document_id} className={styles.content}>
              <div className={styles.customerName}>{item.document_name}</div>
              <div className={styles.BtnGroup}>
                <Button
                  onClick={() => {
                    setIsShow(true);
                    setSelectedDocument(item);
                    setNewDocument(false);
                  }}
                >
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button
          className="mt-10"
          onClick={() => {
            setIsShow(true);
            setNewDocument(true);
            setSelectedDocument(undefined);
          }}
        >
          Add New Document
        </Button>
      </div>
      <Modal isShown={isShow} onClose={() => setIsShow(false)}>
        <form className={styles.Mcontent} onSubmit={handleSubmit(onSubmit)}>
          <Input className={styles.customerValue} register={register('document_name')} error={errors.document_name} />
          <div className={styles.BtnGroup}>
            <Button type="submit">{newDocument ? 'Create' : 'Update'}</Button>

            <Button onClick={() => setIsShow(false)} buttonStyle="white">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </Container>
  );
};

export default DocumentPage;
