import React from 'react';
import FcButton from '~/components/FcButton';
import { useHistory } from 'react-router-dom';
import { getOriginUrl } from '../utils/utils';

const NotFound = () => {
  const history = useHistory();
  const origin = getOriginUrl();

  const goHome = () => {
    history.push('/');
  };

  return (
    <div className="pages-body notfound-page p-d-flex p-flex-column">
      <div className="p-as-center p-mt-auto p-mb-auto">
        <div className="pages-panel card p-d-flex p-flex-column">
          <div className="pages-header p-px-3 p-py-1">
            <h2>NÃO ENCONTRADO</h2>
          </div>
          <div className="card p-mt-3 p-px-6">
            <img src={origin + '/assets/layout/images/pages/404.png'} alt="" />
          </div>
          <div className="pages-detail p-pb-6">O recurso solicitado não está disponível.</div>
          <FcButton type="button" onClick={goHome} label="RETORNAR À PÁGINA INICIAL" className="p-button-text" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
