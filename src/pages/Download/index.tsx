import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { format } from 'date-fns';

import Button from '../../components/_ui/Button';
import ComboBox from '../../components/_ui/ComboBox';
import Input from '../../components/_ui/Input';
import Modal from '../../components/_ui/Modal';
import PDFDocument from '../../components/_module/PDFDocument';
import styles from './styles.module.scss';
import { MainContext } from '../../context';
import { TCustomer } from '../../utils/types';
import { requiredString, requiredObject } from '../../utils/yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { adjustDate } from '../../utils/functions';

const validationSchema = requiredObject({
  customer_id: requiredString,
  document_version: requiredString,
});

const DownloadPage = () => {
  const { tableOfContent, setTOC, documentContent, documentList, customerList, versionList, fetchVersionList } =
    useContext(MainContext);

  const { handleSubmit, register, reset, control } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const navigate = useNavigate();

  const [isShown, setIsShown] = useState(false);
  const documentVersion = localStorage.getItem('documentVersion');
  const documentId = localStorage.getItem('documentId');
  const customerId = localStorage.getItem('customerId');
  const documentName = documentList.find(item => item.document_id.toString() === documentId)?.document_name;
  const customerName = customerList.find(item => item.customer_id.toString() === customerId)?.customer_name;
  const selectedVersion = versionList.find(item => item.document_version.toString() === documentVersion);

  useEffect(() => {
    if (isShown) {
      reset({
        customer_id: customerId,
        document_version: format(Date.now(), 'yyyy-MM-dd'),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShown]);

  const cloneDocument = async (data: FieldValues) => {
    try {
      const newDocumentVersion = `${data.document_version}T00:00:00.000Z`;
      await axios.post(`${process.env.REACT_APP_API_URL}/document/${documentVersion}/clone`, {
        document_id: documentId,
        customer_id: data.customer_id,
        new_version: newDocumentVersion,
        old_customer_id: customerId,
      });
      localStorage.setItem('documentVersion', newDocumentVersion);
      localStorage.setItem('customerId', data.customer_id);
      fetchVersionList(documentId ?? '', data.customer_id ?? '');
      navigate('/edit');
    } catch (error: any) {
      console.log('error: ', error);
      alert(error.response.data.message);
    }
  };

  return (
    <>
      <div className={styles.buttonWrapper}>
        <Link to="/" reloadDocument>
          <Button buttonStyle="white" className="w-full">
            Home
          </Button>
        </Link>
        {documentContent ? (
          <>
            <PDFDownloadLink
              document={
                <PDFDocument
                  content={documentContent}
                  title={documentName ?? ''}
                  creator={customerName ?? ''}
                  introPage={selectedVersion?.intro_page}
                  date={format(adjustDate(documentVersion ?? Date.now()), 'MMMM d, yyyy')}
                  tableOfContent={tableOfContent}
                  setTOC={setTOC}
                />
              }
              fileName={`Extrico ${customerName} ${documentName}. ${format(
                adjustDate(documentVersion ?? Date.now()),
                'yyyyMMdd'
              )}.pdf`}
              className={styles.downloadButton}
            >
              {({ loading }) => {
                if (loading) {
                  return 'Loading...';
                } else {
                  return 'Print PDF';
                }
              }}
            </PDFDownloadLink>
            {!selectedVersion?.pending_id ? (
              <Button buttonStyle="dark" className="w-full tablet:mt-0 mt-20" onClick={() => setIsShown(true)}>
                Clone
              </Button>
            ) : (
              <Link to={'/edit'}>
                <Button buttonStyle="dark">Edit</Button>
              </Link>
            )}
          </>
        ) : (
          <Button>No File</Button>
        )}
      </div>
      <div className="w-full h-full bg-gray-400 border shadow-inner">
        {documentContent && (
          <PDFViewer height="100%" width="100%" showToolbar={false}>
            <PDFDocument
              content={documentContent}
              title={documentName ?? ''}
              creator={customerName ?? ''}
              introPage={selectedVersion?.intro_page}
              date={format(adjustDate(documentVersion ?? Date.now()), 'MMMM d, yyyy')}
              tableOfContent={tableOfContent}
              setTOC={setTOC}
            />
          </PDFViewer>
        )}
      </div>
      <Modal isShown={isShown} onClose={() => setIsShown(false)}>
        <div className="mt-20">
          <Input type="date" label="Version: " register={register('document_version')} />
        </div>
        <div className="mt-20">
          <Controller
            name="customer_id"
            control={control}
            render={({ field: { onChange, value = '' }, fieldState: { error } }) => (
              <>
                <ComboBox
                  list={customerList}
                  label="Customer:"
                  nameField="customer_name"
                  value={customerList.find(item => item.customer_id == value)}
                  onChange={(val?: TCustomer) => {
                    onChange(val?.customer_id);
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
        </div>
        <Button className="w-full mt-10" buttonSize="small" onClick={handleSubmit(cloneDocument)}>
          Clone
        </Button>
      </Modal>
    </>
  );
};

export default DownloadPage;
