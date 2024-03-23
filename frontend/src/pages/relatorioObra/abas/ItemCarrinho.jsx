import { PropTypes } from 'mobx-react';
import { Tag } from 'primereact/tag';
import { useState } from 'react';
import FcButton from 'fc/components/FcButton';
import { getValue, getValueMoney } from 'fc/utils/utils';

const ItemCarrinho = ({ data, handleEdit, handleRemove, title, tresCasasDecimais, srp }) => {
  const [showAllLabels, setShowAllLabels] = useState(false);
  const renderValueItemTemplate = (label, value) => {
    return (
      <div className="flex font-bold" style={{ color: '#9E9E9E' }}>
        <div className="drawer-content-label px-0">
          {label}: {value ?? '-'}
        </div>
      </div>
    );
  };

  return (
    <div className="text-base flex justify-content-between">
      <div className="flex flex-column gap-1 my-2">
        <div className="font-bold">{getValue(title)}</div>
        {renderValueItemTemplate('Código', getValue(data.materialDetalhamento.codigo))}
        {renderValueItemTemplate('Quantidade', getValue(data.quantidade))}
        {renderValueItemTemplate(
          'Valor Unitário Estimado',
          getValueMoney(data.valorUnitarioEstimado, tresCasasDecimais ? 3 : 2)
        )}
        {srp ? renderValueItemTemplate('Quantidade de Consumo', getValue(data.quantidadeConsumo)) : ''}
        {renderValueItemTemplate(
          'Valor Total Estimado',
          getValueMoney((data.valorUnitarioEstimado ?? 0) * (data.quantidade ?? 0), tresCasasDecimais ? 3 : 2)
        )}
        {renderValueItemTemplate('Descrição Complementar', getValue(data.descricaoComplementar))}
        <div className="p-formgrid p-grid p-d-flex p-jc-between-2 m-0">
          <div className="mt-2">
            {data.materialDetalhamento.caracteristicas
              .slice(0, showAllLabels ? data.materialDetalhamento.caracteristicas.length : 4)
              .map((caracteristica, index) => (
                <Tag
                  key={index}
                  style={{
                    color: '#609AF8',
                    backgroundColor: '#F5F9FF',
                    marginRight: '3px',
                    border: '1px solid #609AF8',
                  }}
                >
                  {caracteristica.textCaracteristica}
                </Tag>
              ))}
            {data.materialDetalhamento.caracteristicas.length > 4 && (
              <FcButton
                type="button"
                label={showAllLabels ? 'Ver menos' : 'Ver mais'}
                className="p-button-link "
                style={{ padding: 0, marginLeft: '0.5rem', textDecoration: 'underline', fontSize: '13px' }}
                onClick={() => setShowAllLabels((oldState) => !oldState)}
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex align-items-center">
        <FcButton
          type="button"
          icon="pi pi-pencil"
          style={{ color: '##606EC1' }}
          className="p-button-rounded p-button-text"
          onClick={handleEdit}
        />
        <FcButton
          type="button"
          icon="pi pi-trash"
          style={{ color: '#FF3D32' }}
          className="p-button-rounded p-button-text"
          onClick={handleRemove}
        />
      </div>
    </div>
  );
};

ItemCarrinho.propTypes = {
  data: PropTypes.any,
  handleEdit: PropTypes.func,
  handleRemove: PropTypes.func,
  title: PropTypes.any,
  tresCasasDecimais: PropTypes.bool,
  srp: PropTypes.bool,
};

export default ItemCarrinho;
