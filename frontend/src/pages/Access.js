import React from 'react';
import FcButton from '~/components/FcButton';
import { useHistory } from 'react-router-dom';
import { getOriginUrl } from '../utils/utils';

const Access = () => {
  const history = useHistory();
  const origin = getOriginUrl();

  const goHome = () => {
    history.push('/');
  };

  return (
    <div className="pages-body accessdenied-page p-d-flex p-flex-column">
      <div className="p-as-center p-mt-auto p-mb-auto">
        <div className="pages-panel card p-d-flex p-flex-column">
          <div className="pages-header p-px-3 p-py-1">
            <h2>ACESSO NEGADO</h2>
          </div>
          <div className="card p-mt-3 p-px-6">
            <img src={origin + '/assets/layout/images/pages/error.png'} alt="" />
          </div>
          <div className="pages-detail p-pb-6">Você não possui permissão para acessar este recurso.</div>
          <FcButton type="button" onClick={goHome} label="RETORNAR À PÁGINA INICIAL" className="p-button-text" />
        </div>
      </div>
    </div>
  );
};

export default Access;
