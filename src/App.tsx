import React, { useContext } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import CustomerPage from './pages/Customer';
import DocumentPage from './pages/Document';
import DownloadPage from './pages/Download';
import EditPage from './pages/Edit';
import Layout from './layout';
import MainPage from './pages/Main';
import ModulePage from './pages/Module';
import SectionPage from './pages/Section';
import { MainContext } from './context';
import ColumnEditPage from './pages/ColumnEdit';

function App() {
  const { loadingAPI } = useContext(MainContext);
  return loadingAPI ? (
    <div>Loading...</div>
  ) : (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />}></Route>
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/download" element={<DownloadPage />}></Route>
                <Route path="/edit" element={<EditPage />}></Route>
                <Route path="/edit/module/:moduleId/:moduleVersion" element={<ModulePage />}></Route>
                <Route path="/edit/module/:moduleId/:moduleVersion/column" element={<ColumnEditPage />}></Route>
              </Routes>
            </Layout>
          }
        />
        <Route path="/customer" element={<CustomerPage />}></Route>
        <Route path="/document" element={<DocumentPage />}></Route>
        <Route path="/section" element={<SectionPage />}></Route>
        <Route path="/*" element={<Navigate replace to="/" />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
