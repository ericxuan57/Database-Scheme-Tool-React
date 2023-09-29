import React, { Dispatch, ReactNode, SetStateAction, createContext, useEffect, useState } from 'react';
import { groupBy } from 'lodash';
import axios from 'axios';

import { TCustomer, TDocument, TDocumentContent, TModuleVer, TSection, TTOC, TVersion } from '../utils/types';

type TContext = {
  tableOfContent: TTOC;
  setTOC: Dispatch<SetStateAction<TTOC>>;
  documentList: TDocument[];
  customerList: TCustomer[];
  versionList: TVersion[];
  sectionList: TSection[];
  documentContent?: { [key: string]: TDocumentContent[] };
  setDocumentContent: Dispatch<SetStateAction<{ [key: string]: TDocumentContent[] } | undefined>>;
  setVersionList: Dispatch<SetStateAction<TVersion[]>>;
  fetchCustomers: () => void;
  fetchDocuments: () => void;
  fetchSections: () => void;
  getDocumentContent: () => void;
  fetchVersionList: (documentId?: string, customerId?: string) => void;
  fetchModuleContent: (documentId?: string, customerId?: string) => void;
  loadingAPI: boolean;
  setLoadingAPI: Dispatch<SetStateAction<boolean>>;
  module?: TModuleVer;
  setModule: Dispatch<SetStateAction<TModuleVer | undefined>>;
};

type Props = {
  children: ReactNode;
};

export const MainContext = createContext<TContext>({
  tableOfContent: {},
  setTOC: () => {},
  documentList: [],
  customerList: [],
  versionList: [],
  sectionList: [],
  setDocumentContent: () => {},
  setVersionList: () => {},
  fetchCustomers: () => {},
  fetchDocuments: () => {},
  fetchSections: () => {},
  getDocumentContent: () => {},
  fetchVersionList: () => {},
  fetchModuleContent: () => {},
  loadingAPI: false,
  setLoadingAPI: () => {},
  setModule: () => {},
});

const MainProvider = ({ children }: Props) => {
  const [tableOfContent, setTOC] = useState<TTOC>({});

  const [documentList, setDocumentList] = useState<TDocument[]>([]);
  const [customerList, setCustomerList] = useState<TCustomer[]>([]);
  const [sectionList, setSectionList] = useState<TSection[]>([]);
  const [versionList, setVersionList] = useState<TVersion[]>([]);

  const [documentContent, setDocumentContent] = useState<{ [key: string]: TDocumentContent[] }>();
  const [loadingAPI, setLoadingAPI] = useState<boolean>(false);
  const [module, setModule] = useState<TModuleVer>();

  const fetchCustomers = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/customer/list`);
    setCustomerList(res.data.customer);
  };

  const fetchDocuments = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/document/list`);
    setDocumentList(res.data.document);
  };

  const fetchSections = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/section/list`);
    setSectionList(res.data.section);
  };

  const getDocumentContent = async () => {
    const documentId = localStorage.getItem('documentId');
    const customerId = localStorage.getItem('customerId');
    const documentVersion = localStorage.getItem('documentVersion');
    if (!documentId || !customerId || !documentVersion) return;
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/document/${documentVersion}`, {
      params: { document_id: documentId, customer_id: customerId },
    });
    const groupedList = groupBy(
      res.data?.document?.filter((item: TDocumentContent) => item.module_ver),
      'module_ver.module.section.section_name'
    );
    setDocumentContent(groupedList);
  };

  const fetchLists = async () => {
    setLoadingAPI(true);
    await Promise.all([fetchCustomers(), fetchDocuments(), fetchSections()]);
    setLoadingAPI(false);
  };

  const fetchVersionList = async (documentId?: string, customerId?: string) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/document/version-list`, {
      params: { document_id: documentId, customer_id: customerId },
    });
    setVersionList(res.data.versions);
  };

  const fetchModuleContent = async (moduleId?: string, moduleVersion?: string) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/document/module/${moduleId}`, {
      params: { module_version: moduleVersion },
    });
    setModule(res.data.module);
  };

  useEffect(() => {
    fetchLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MainContext.Provider
      value={{
        tableOfContent,
        setTOC,
        documentList,
        customerList,
        versionList,
        sectionList,
        documentContent,
        setDocumentContent,
        setVersionList,
        fetchCustomers,
        fetchDocuments,
        fetchVersionList,
        fetchSections,
        getDocumentContent,
        fetchModuleContent,
        loadingAPI,
        setLoadingAPI,
        module,
        setModule,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export default MainProvider;
