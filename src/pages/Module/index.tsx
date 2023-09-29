import React, { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import EditModule from '../../components/_module/EditModule';
import { MainContext } from '../../context';

const ModulePage: React.FC = () => {
  const { moduleId, moduleVersion } = useParams();

  const navigate = useNavigate();
  const { getDocumentContent, fetchModuleContent, module } = useContext(MainContext);

  useEffect(() => {
    fetchModuleContent(moduleId, moduleVersion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <EditModule
        onClose={() => {
          getDocumentContent();
          navigate('/edit');
        }}
        data={module}
      />
    </>
  );
};

export default ModulePage;
