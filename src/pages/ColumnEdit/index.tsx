import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import classNames from 'classnames';
import { Link, useNavigate, useParams } from 'react-router-dom';

import Button from '../../components/_ui/Button';
import EditColumnModule from '../../components/_module/EditColumnModule';
import Modal from '../../components/_ui/Modal';
import styles from './styles.module.scss';
import { MainContext } from '../../context';
import { TColumnVer } from '../../utils/types';
import { formatVersion } from '../../utils/functions';

const ColumnEditPage: React.FC = () => {
  const { moduleId, moduleVersion } = useParams();
  const navigate = useNavigate();

  const [isShown, setIsShown] = useState(false);
  const [columnList, setColumnList] = useState<TColumnVer[]>([]);
  const [isNew, setIsNew] = useState(false);
  const [selectedContent, setSelectedContent] = useState<TColumnVer>();
  const { fetchModuleContent, module } = useContext(MainContext);

  const customerId = localStorage.getItem('customerId');
  const documentId = localStorage.getItem('documentId');
  const documentVersion = localStorage.getItem('documentVersion');

  const addModule = async (item: TColumnVer) => {
    if (confirm(`Do you want to add ${item.column_name}?`) == true) {
      try {
        await axios.put(`${process.env.REACT_APP_API_URL}/document/module/${moduleId}`, {
          module_version: moduleVersion,
          customer_id: customerId,
          document_version: documentVersion,
          document_id: documentId,
        });

        await axios.post(`${process.env.REACT_APP_API_URL}/document/column/${item.column_id}`, {
          column_version: item.column_version,
          module_id: moduleId,
          module_version: documentVersion,
        });
        fetchModuleContent(moduleId, moduleVersion);
        if (moduleVersion !== documentVersion) {
          navigate(`/edit/module/${moduleId}/${documentVersion}/column`);
        }
      } catch (error: any) {
        console.log(error);
        alert(error.response.data.message);
      }
    }
  };
  const deleteModule = async (item?: TColumnVer) => {
    if (confirm(`Do you want to delete ${item?.column_name}`) == true) {
      try {
        await axios.put(`${process.env.REACT_APP_API_URL}/document/module/${moduleId}`, {
          module_version: moduleVersion,
          customer_id: customerId,
          document_version: documentVersion,
          document_id: documentId,
        });
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/document/column/${item?.column_id}/${item?.column_version}`,
          {
            params: {
              module_id: moduleId,
              module_version: documentVersion,
            },
          }
        );
        fetchModuleContent(moduleId, moduleVersion);
        if (moduleVersion !== documentVersion) {
          navigate(`/edit/module/${moduleId}/${documentVersion}/column`);
        }
      } catch (error: any) {
        console.log(error);
        alert(error.response.data.message);
      }
    }
  };
  const getColumnList = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/document/column/list`);

      setColumnList(res.data.column);
    } catch (error: any) {
      console.log(error);
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchModuleContent(moduleId, moduleVersion);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId, moduleVersion]);

  useEffect(() => {
    getColumnList();
  }, []);

  return (
    <>
      <div className="w-full flex justify-start">
        <Link to={`/edit/module/${moduleId}/${moduleVersion}`}>
          <Button buttonStyle="white">Back</Button>
        </Link>
      </div>
      <div className={styles.tableContent}>
        <div className={classNames(styles.wrapper, 'relative')}>
          <div className={classNames(styles.rowContent, 'sticky top-0 bg-gray-300')}>
            <h1 className={styles.sectionContent}>Column Name</h1>
            <h1 className={styles.typeContent}>Type</h1>
            <h1 className={styles.moduleContent}>Description</h1>
            <div className={classNames(styles.BtnGroup, 'invisible')}>
              <Button buttonSize="small">Edit</Button>
              <Button buttonSize="small">Delete</Button>
            </div>
          </div>
          {module?.column_module &&
            module.column_module
              .sort((col1, col2) =>
                (col1.column_ver?.column_name ?? '') > (col2.column_ver?.column_name ?? '') ? 1 : -1
              )
              .map(item => (
                <div className={styles.rowContent} key={item.column_ver?.column_id}>
                  <h1 className={styles.sectionContent}>{item.column_ver?.column_name}</h1>
                  <h1 className={styles.typeContent}>{item.column_ver?.column_type}</h1>
                  <h1 className={styles.moduleContent}>{item.column_ver?.column_description}</h1>
                  <div className={styles.BtnGroup}>
                    <Button
                      buttonSize="small"
                      onClick={() => {
                        setIsShown(true);
                        setSelectedContent(item.column_ver);
                        setIsNew(false);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      buttonSize="small"
                      buttonStyle="white"
                      onClick={() => {
                        deleteModule(item.column_ver);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
        </div>
        <div className={classNames(styles.wrapper, 'relative max-w-600')}>
          <div className={classNames(styles.rowContent, 'sticky top-0 bg-gray-300')}>
            <h1 className={styles.columnNameContent}>Column Name</h1>
            <h1 className={styles.columnVContent}>Column Version</h1>
            <div className={classNames(styles.BtnGroup, 'invisible')}>
              <Button buttonSize="small">Add</Button>
            </div>
          </div>
          {columnList &&
            columnList.map((item, index) => (
              <div className={styles.rowContent} key={index}>
                <h1 className={styles.columnNameContent}>{item.column_name}</h1>
                <h1 className={styles.columnVContent}>{formatVersion(item.column_version)}</h1>
                <div className={styles.BtnGroup}>
                  <Button
                    buttonSize="small"
                    buttonStyle="white"
                    onClick={() => {
                      addModule(item);
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </div>
      <Button
        onClick={() => {
          setIsShown(true);
          setIsNew(true);
        }}
      >
        Create New Column
      </Button>
      <Modal isShown={isShown} onClose={() => setIsShown(false)} width="large">
        <EditColumnModule
          isNew={isNew}
          data={isNew ? undefined : selectedContent}
          onClose={() => setIsShown(false)}
          onFinished={() => {
            fetchModuleContent(moduleId, moduleVersion);
          }}
        />
      </Modal>
    </>
  );
};

export default ColumnEditPage;
