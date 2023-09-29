import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import axios from 'axios';

import Button from '../../components/_ui/Button';
import EditModule from '../../components/_module/EditModule';
import Modal from '../../components/_ui/Modal';
import styles from './styles.module.scss';
import { MainContext } from '../../context';
import { TModuleVer } from '../../utils/types';
import { groupBy } from 'lodash';
import { formatVersion } from '../../utils/functions';

const EditPage: React.FC = () => {
  const [isShown, setIsShown] = useState(false);
  const [moduleList, setModuleList] = useState<{ [key: string]: TModuleVer[] }>();
  const { documentContent, versionList, getDocumentContent } = useContext(MainContext);
  const documentVersion = localStorage.getItem('documentVersion');
  const selectedVersion = versionList.find(item => item.document_version.toString() === documentVersion);

  const navigate = useNavigate();

  const deleteModule = async (module_data: TModuleVer) => {
    if (confirm(`Do you want to delete ${module_data.module_name} module?`) == true) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/document/module/${module_data.module_id}/${module_data.module_version}`
        );
        getDocumentContent();
      } catch (error: any) {
        console.log(error);
        alert(error.response.data.message);
      }
    }
  };

  const deleteDocument = async () => {
    if (confirm('Do you want to delete Document?') == true) {
      const customerId = localStorage.getItem('customerId');
      const documentId = localStorage.getItem('documentId');
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/document/${documentVersion}`, {
          params: {
            customer_id: customerId,
            document_id: documentId,
          },
        });
        navigate('/');
      } catch (error: any) {
        console.error(error);
        alert(error.response.data.message);
      }
    }
  };

  const publishDocument = async () => {
    if (confirm('Do you want to publish?') == true) {
      const customerId = localStorage.getItem('customerId');
      const documentId = localStorage.getItem('documentId');
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/document/${documentVersion}/publish`, {
          customer_id: customerId,
          document_id: documentId,
        });
        navigate('/');
      } catch (error: any) {
        console.error(error);
        alert(error.response.data.message);
      }
    }
  };

  const getModuleList = async () => {
    const documentId = localStorage.getItem('documentId');
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/document/module/list`, {
      params: { document_id: documentId },
    });
    const groupedList = groupBy(res.data?.module, 'module.section.section_name');
    setModuleList(groupedList);
  };

  const addModule = async (moduleId?: string, moduleVersion?: string) => {
    if (confirm('Do you want to add?') == true) {
      const documentId = localStorage.getItem('documentId');
      const customerId = localStorage.getItem('customerId');
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/document/module/${moduleId}`, {
          module_version: moduleVersion,
          document_id: documentId,
          document_version: documentVersion,
          customer_id: customerId,
        });
        getDocumentContent();
      } catch (error: any) {
        console.log(error);
        alert(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    getModuleList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="w-full flex gap-20">
        <Button buttonStyle="white" onClick={() => navigate('/')}>
          Back
        </Button>

        {selectedVersion?.pending_id && (
          <>
            <Button
              onClick={() => {
                publishDocument();
              }}
            >
              Publish
            </Button>
            <Button
              buttonStyle="dark"
              onClick={() => {
                deleteDocument();
              }}
            >
              Delete
            </Button>
          </>
        )}
      </div>
      <div className={styles.tableGroup}>
        <div className={classNames(styles.wrapper, 'relative')}>
          <div className={classNames(styles.rowContent, 'sticky top-0 bg-gray-300')}>
            <h1 className={styles.sectionContent}>Section</h1>
            <h1 className={styles.moduleContent}>Module Name</h1>
            <div className={classNames(styles.BtnGroup, 'invisible')}>
              <Button buttonSize="small">Edit</Button>
              <Button buttonSize="small">Delete</Button>
            </div>
          </div>
          {documentContent &&
            Object.keys(documentContent).map(key => (
              <Fragment key={key}>
                {documentContent[key]
                  ?.sort((module1, module2) =>
                    (module1.module_ver.module_name ?? '') > (module2.module_ver.module_name ?? '') ? 1 : -1
                  )
                  .map((moduleData, index) => (
                    <div className={styles.rowContent} key={index}>
                      <h1 className={styles.sectionContent}>{key}</h1>
                      <h1 className={styles.moduleContent}>{moduleData.module_ver.module_name}</h1>
                      <div className={styles.BtnGroup}>
                        <Link
                          to={`/edit/module/${moduleData.module_ver.module_id}/${moduleData.module_ver.module_version}`}
                        >
                          <Button buttonSize="small">Edit</Button>
                        </Link>
                        <Button
                          buttonSize="small"
                          buttonStyle="white"
                          onClick={() => {
                            deleteModule(moduleData.module_ver);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
              </Fragment>
            ))}
        </div>
        <div className={classNames(styles.wrapper, 'relative tablet:mt-0 mt-20')}>
          <div className={classNames(styles.rowContent, 'sticky top-0 bg-gray-300')}>
            <h1 className={styles.sectionContent}>Section</h1>
            <h1 className={styles.moduleContent}>Module Name</h1>
            <h1 className={styles.moduleVContent}>Module Version</h1>
            <div className={classNames(styles.BtnGroup, 'invisible')}>
              <Button buttonSize="small">Add</Button>
            </div>
          </div>
          {moduleList &&
            Object.keys(moduleList).map(key => (
              <Fragment key={key}>
                {moduleList[key]
                  ?.sort((module1, module2) => ((module1.module_name ?? '') > (module2.module_name ?? '') ? 1 : -1))
                  .map((moduleData, index) => (
                    <div className={styles.rowContent} key={index}>
                      <h1 className={styles.sectionContent}>{key}</h1>
                      <h1 className={styles.moduleContent}>{moduleData.module_name}</h1>
                      <h1 className={styles.moduleVContent}>{formatVersion(moduleData.module_version)}</h1>
                      <div className={styles.BtnGroup}>
                        <Button
                          buttonSize="small"
                          buttonStyle="white"
                          onClick={() => {
                            addModule(moduleData.module_id.toString(), moduleData.module_version);
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  ))}
              </Fragment>
            ))}
        </div>
      </div>
      <Button onClick={() => setIsShown(true)}>Create New Module</Button>
      <Modal isShown={isShown} onClose={() => setIsShown(false)} width="large">
        <EditModule isNew onClose={() => setIsShown(false)} onFinished={() => getDocumentContent()} />
      </Modal>
    </>
  );
};

export default EditPage;
