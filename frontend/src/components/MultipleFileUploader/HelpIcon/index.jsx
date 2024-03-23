import { useRef, useState } from 'react';
import './style.scss';
import { OverlayPanel } from 'primereact/overlaypanel';
import PropTypes from 'prop-types';

const HelpIcon = (props) => {
  const refOp = useRef(null);
  const [timeoutId, setTimeOutId] = useState(null);

  const handleTimeout = () => {
    const id = setTimeout(() => refOp?.current?.hide(), 1500);
    setTimeOutId(id);
  };

  const handleTextColor = (textoDocumento) => {
    let arrayTextoDocumento = textoDocumento.split('');
    let textoResultado;
    if (arrayTextoDocumento[0] == '*') {
      let asterisco = arrayTextoDocumento[0];
      let textoDocumentoFormatado = textoDocumento.substring(1);
      textoResultado = (
        <p>
          <i className="pi pi-chevron-circle-right p-mr-2" style={{ color: '#2a5dac' }}></i>
          <span style={{ color: 'red' }}>{asterisco}</span>
          {textoDocumentoFormatado}
        </p>
      );
    } else {
      textoResultado = (
        <p>
          <i className="pi pi-chevron-circle-right p-mr-2" style={{ color: '#2a5dac' }}></i>
          {textoDocumento}
        </p>
      );
    }
    return textoResultado;
  };

  return (
    <>
      <i
        className="pi pi-question-circle p-2"
        onMouseOver={(e) => {
          timeoutId && clearTimeout(timeoutId);
          refOp.current.show(e);
        }}
        onMouseOut={() => {
          timeoutId && clearTimeout(timeoutId);
          handleTimeout();
        }}
      />

      <OverlayPanel
        ref={refOp}
        onMouseOut={() => {
          timeoutId && clearTimeout(timeoutId);
          handleTimeout();
        }}
        onMouseOver={() => {
          timeoutId && clearTimeout(timeoutId);
        }}
      >
        <div id="file-types-container" className="p-d-flex p-flex-column gap-2">
          {props.documentos?.length > 0
            ? props.documentos?.map((doc, idx) => {
                return <span key={idx}>{handleTextColor(doc.text)}</span>;
              })
            : 'Não há tipos de documentos!'}
        </div>
      </OverlayPanel>
    </>
  );
};

HelpIcon.defaultProps = {
  documentos: [],
};

HelpIcon.propTypes = {
  documentos: PropTypes.array,
};

export default HelpIcon;
