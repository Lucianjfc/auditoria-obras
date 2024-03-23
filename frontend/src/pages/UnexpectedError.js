import React from 'react';

const UnexpectedError = () => {
  return (
    <div
      className="pages-body error-page p-d-flex p-flex-column"
      style={{
        backgroundImage: 'url(/assets/layout/images/pages/unexpected-error-bg.png)',
        height: '100vh',
        width: '100vw',
      }}
    >
      <div className="p-as-center p-mt-auto p-mb-auto">
        <div className="pages-panel card p-d-flex p-flex-column" style={{ alignItems: 'center' }}>
          <div className="pages-header p-px-3 p-py-1 exception-type" style={{ backgroundColor: '#EE1D22' }}>
            <h2>ERRO INESPERADO</h2>
          </div>
          <div className="card p-mt-3 p-px-6">
            <img src="/assets/layout/images/pages/computer-troubleshooting.png" alt="" style={{ width: '15rem' }} />
          </div>
          <div className="pages-detail p-pb-6" style={{ width: '20rem' }}>
            Um erro inesperado ocorreu, entre em contato com o suporte para mais informações.
          </div>
          {/* <FcButton type="button" onClick={goHome} label="RETORNAR À PÁGINA INICIAL" className="p-button-text" /> */}
        </div>
      </div>
    </div>
  );
};

export default UnexpectedError;
