import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { MultiSelect } from 'primereact/multiselect';
import { OverlayPanel } from 'primereact/overlaypanel';
import { getValueByKey } from '../../utils/utils';

const FcMultiSelect = observer((props) => {
  const { showOverlay, optionValue, optionLabel, value, options, disabled } = props;
  const refOp = useRef(null);
  const [selecting, setSelecting] = useState(false);

  const optionsSorted = options.slice().sort((a, b) => a[optionLabel].localeCompare(b[optionLabel]));

  const renderSelectedItems = () => {
    if (value) {
      return value.map((element, idx) => {
        return (
          <div className="p-d-inline-flex gap-1 p-ai-center" key={idx}>
            <i className="pi pi-chevron-circle-right p-mr-2" style={{ color: '#2a5dac' }} />
            <span
              style={{
                padding: '2px',
              }}
            >
              {optionLabel && optionValue
                ? getValueByKey(element, options, optionValue, optionLabel)
                : optionLabel
                ? element[optionLabel]
                : element}
            </span>
          </div>
        );
      });
    }
  };

  return (
    <>
      <MultiSelect
        {...props}
        onMouseOver={(e) => showOverlay && !selecting && refOp.current.toggle(e)}
        onMouseOut={(e) => showOverlay && !selecting && refOp.current.hide(e)}
        onShow={(e) => {
          setSelecting(true);
          showOverlay && refOp.current.hide(e);
        }}
        onHide={() => setSelecting(false)}
        options={optionsSorted}
        disabled={disabled}
        emptyFilterMessage="Nenhum registro encontrado"
      />
      {showOverlay && (
        <OverlayPanel ref={refOp}>
          <div className="p-d-flex p-flex-column">
            {value?.length ? renderSelectedItems() : 'Não há itens selecionados.'}
          </div>
        </OverlayPanel>
      )}
    </>
  );
});

FcMultiSelect.propTypes = {
  id: PropTypes.string,
  optionValue: PropTypes.string,
  optionLabel: PropTypes.string,
  showOverlay: PropTypes.bool,
  value: PropTypes.array,
  options: PropTypes.array,
  disabled: PropTypes.bool,
};

export default FcMultiSelect;
