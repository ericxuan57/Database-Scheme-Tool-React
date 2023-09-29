import React, { ReactNode, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import styles from './styles.module.scss';
import classNames from 'classnames';
import { MainContext } from '../context';
import Container from '../components/_module/Container';
import { formatVersion } from '../utils/functions';

type Props = {
  children: ReactNode;
};
const Layout: React.FC<Props> = ({ children }) => {
  const { documentList, customerList, versionList, fetchVersionList, getDocumentContent, module } =
    useContext(MainContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const documentVersion = localStorage.getItem('documentVersion');
  const documentId = localStorage.getItem('documentId');
  const customerId = localStorage.getItem('customerId');
  const documentName = documentList.find(item => item.document_id.toString() === documentId)?.document_name;
  const customerName = customerList.find(item => item.customer_id.toString() === customerId)?.customer_name;
  const selectedVersion = versionList.find(item => item.document_version.toString() === documentVersion);

  useEffect(() => {
    getDocumentContent();
    if (documentId && customerId) {
      fetchVersionList(documentId, customerId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (versionList.length > 0) {
      const selectedVer = versionList.find(item => item.document_version.toString() === documentVersion);
      if (selectedVer && !selectedVer.pending_id && !pathname.includes('download')) {
        navigate('/');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [versionList]);

  return (
    <Container>
      <div className={styles.wrapper}>
        <div className={styles.PDFWrapper}>
          <div className={classNames(styles.header, { [styles.pending]: selectedVersion?.pending_id })}>
            {`${customerName}, ${documentName}, ${formatVersion(documentVersion)}${
              selectedVersion?.pending_id ? ', PENDING' : ''
            }${pathname.includes('column') ? `, ${module?.module_name}` : ''}`}
          </div>
          {children}
        </div>
      </div>
    </Container>
  );
};

export default Layout;
