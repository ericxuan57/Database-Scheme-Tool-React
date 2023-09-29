import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useForm, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Button from '../../components/_ui/Button';
import ComboBox from '../../components/_ui/ComboBox';
import Container from '../../components/_module/Container';
import Input from '../../components/_ui/Input';
import Modal from '../../components/_ui/Modal';
import styles from './styles.module.scss';
import { MainContext } from '../../context';
import { TCustomer, TDocument, TVersion } from '../../utils/types';
import { requiredString, requiredObject } from '../../utils/yup';

const validationSchema = requiredObject({
  document_version: requiredString,
});

const MainPage = () => {
  const {
    documentList,
    customerList,
    versionList,
    setVersionList,
    fetchVersionList,
    setTOC,
    setDocumentContent,
    setModule,
  } = useContext(MainContext);

  const navigate = useNavigate();

  const [selectedCustomer, setSelectedCustomer] = useState<TCustomer>();
  const [selectedDocument, setSelectedDocument] = useState<TDocument>();
  const [selectedVersion, setSelectedVersion] = useState<TVersion>();
  const [isShown, setIsShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, register, reset } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: FieldValues) => {
    setIsLoading(true);
    try {
      const newDocumentVersion = `${data.document_version}T00:00:00.000Z`;
      await axios.post(`${process.env.REACT_APP_API_URL}/document/${newDocumentVersion}`, {
        document_id: selectedDocument?.document_id,
        customer_id: selectedCustomer?.customer_id,
      });
      fetchVersionList(selectedDocument?.document_id.toString(), selectedCustomer?.customer_id.toString());
      setIsShown(false);
    } catch (error: any) {
      console.log('error: ', error);
      alert(error.response.data.message);
    }
    setIsLoading(false);
  };

  const showDocument = () => {
    setTOC({});
    setDocumentContent(undefined);
    setModule(undefined);
    navigate('/download');
  };

  useEffect(() => {
    if (isShown) {
      reset({
        document_version: format(Date.now(), 'yyyy-MM-dd'),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShown]);

  useEffect(() => {
    setSelectedVersion(undefined);
    if (selectedCustomer && selectedDocument) {
      fetchVersionList(selectedDocument.document_id.toString(), selectedCustomer.customer_id.toString());
    } else {
      setVersionList([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCustomer, selectedDocument]);

  useEffect(() => {
    localStorage.removeItem('customerId');
    localStorage.removeItem('documentId');
    localStorage.removeItem('documentVersion');
  }, []);

  return (
    <Container>
      <div className={styles.content}>
        <ComboBox
          list={customerList}
          label="Customer"
          nameField="customer_name"
          value={selectedCustomer}
          onChange={(val?: TCustomer) => {
            setSelectedCustomer(val);
            if (val) localStorage.setItem('customerId', val.customer_id.toString());
            else localStorage.removeItem('customerId');
          }}
          className={styles.combo}
        />
        <ComboBox
          list={documentList}
          label="Document"
          nameField="document_name"
          value={selectedDocument}
          onChange={(val?: TDocument) => {
            setSelectedDocument(val);
            if (val) localStorage.setItem('documentId', val.document_id.toString());
            else localStorage.removeItem('documentId');
          }}
          className={styles.combo}
        />
        <ComboBox
          list={versionList}
          label="Version"
          nameField="document_version"
          value={selectedVersion}
          onChange={(val?: TVersion) => {
            setSelectedVersion(val);
            if (val) localStorage.setItem('documentVersion', val.document_version.toString());
            else localStorage.removeItem('documentVersion');
          }}
          className={styles.combo}
        />
        <div className="w-full h-55">
          {selectedCustomer && selectedDocument && (!versionList || versionList?.length === 0) ? (
            <Button fullWidth isPending={isLoading} disabled={isLoading} onClick={() => setIsShown(true)}>
              Create Document Version
            </Button>
          ) : (
            <div className={selectedCustomer && selectedDocument && selectedVersion ? 'block' : 'hidden'}>
              <Button fullWidth onClick={showDocument}>
                Show Document
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className={styles.BtnContent}>
        <Link to={'/customer'}>
          <Button fullWidth>Customers Master</Button>
        </Link>
        <Link to={'/document'}>
          <Button fullWidth>Documents Master</Button>
        </Link>
        <Link to={'/section'} className="w-full">
          <Button fullWidth>Sections Master</Button>
        </Link>
      </div>
      <Modal isShown={isShown} onClose={() => setIsShown(false)}>
        <div className="mt-20">
          <Input type="date" label="Version: " register={register('document_version')} />
        </div>
        <Button
          isPending={isLoading}
          disabled={isLoading}
          className="w-full mt-10"
          buttonSize="small"
          onClick={handleSubmit(onSubmit)}
        >
          Create Document Version
        </Button>
      </Modal>
    </Container>
  );
};

export default MainPage;
