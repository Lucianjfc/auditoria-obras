import PropTypes from 'prop-types';
import { formatDate, getNumberFractionDigits, getValue, getValueMoney, isValueValid } from '~/utils/utils';

const getValues = (item, desonerado, mesColeta) => {
  let defaultValues = {
    unidadeMedida: undefined,
    origemPreco: undefined,
    precoMediano: undefined,
    preco: undefined,
    valorAquisicao: undefined,
    depreciacao: undefined,
    oportunidadeCapital: undefined,
    segurosImpostos: undefined,
    manutencao: undefined,
    operacao: undefined,
    maoObraOperacao: undefined,
    custoProdutivo: undefined,
    custoImprodutivo: undefined,
    salario: undefined,
    encargosTotais: undefined,
    custo: undefined,
    periculosidadeInsalubridade: undefined,
  };

  let selectedValue = undefined;

  if (!desonerado) {
    const result = item.caracteristicasNaoDesonerado?.filter((caracteristica) => caracteristica.mesColeta == mesColeta);
    if (result.length > 0) {
      selectedValue = result[0];
    }
  } else {
    const result = item.caracteristicasDesonerado?.filter((caracteristica) => caracteristica.mesColeta == mesColeta);
    if (result?.length > 0) {
      selectedValue = result[0];
    }
  }

  let filledValues = { ...defaultValues, ...selectedValue };
  return filledValues;
};

const ItemDetail = ({ item, col, hideTitle, mesColeta, desonerado }) => {
  const {
    unidadeMedida,
    origemPreco,
    precoMediano,
    preco,
    valorAquisicao,
    depreciacao,
    oportunidadeCapital,
    segurosImpostos,
    manutencao,
    operacao,
    maoObraOperacao,
    custoProdutivo,
    custoImprodutivo,
    salario,
    encargosTotais,
    custo,
    periculosidadeInsalubridade,
  } = getValues(item, desonerado, mesColeta);

  return (
    <div className="p-grid ">
      {!hideTitle && (
        <div className="p-col-12" style={{ fontSize: '18px', fontWeight: 'bold' }}>
          {getValue(item?.descricao)}
        </div>
      )}
      {renderValue('Código', item?.codigo, <i className="pi pi-tag" style={{ color: '#326FD1' }} />, 3)}
      {isValueValid(precoMediano) &&
        renderValue(
          'Preço Mediano (R$)',
          getValue(getValueMoney(precoMediano)),
          <i className="pi pi-money-bill" style={{ color: '#2C9434' }} />,
          col ?? 3
        )}
      {isValueValid(preco) &&
        renderValue(
          'Preço (R$)',
          getValue(getValueMoney(preco)),
          <i className="pi pi-money-bill" style={{ color: '#2C9434' }} />,
          col ?? 3
        )}
      {isValueValid(custoProdutivo) &&
        renderValue(
          'Custo Produtivo (R$/h)',
          getValue(getValueMoney(custoProdutivo)),
          <i className="pi pi-money-bill" style={{ color: '#2C9434' }} />,
          col ?? 3
        )}
      {isValueValid(custoImprodutivo) &&
        renderValue(
          'Custo Improdutivo (R$/h)',
          getValue(getValueMoney(custoImprodutivo)),
          <i className="pi pi-money-bill" style={{ color: '#2C9434' }} />,
          col ?? 3
        )}
      {isValueValid(operacao) &&
        renderValue(
          'Operação (R$/h)',
          getValue(operacao),
          <i className="pi pi-money-bill" style={{ color: '#DE820C' }} />,
          col ?? 3
        )}
      {isValueValid(custo) &&
        renderValue(
          'Custo (R$)',
          getValue(getValueMoney(custo)),
          <i className="pi pi-money-bill" style={{ color: '#2C9434' }} />,
          col ?? 3
        )}
      {renderValue(
        'Unidade de Medida',
        getValue(unidadeMedida),
        <i className="pi pi-calculator" style={{ color: '#EAB308' }} />,
        col ?? 3
      )}
      {renderValue(
        'Mês da coleta',
        getValue(formatDate(mesColeta)),
        <i className="pi pi-calendar" style={{ color: '#EAB308' }} />,
        col ?? 3
      )}
      {origemPreco &&
        renderValue(
          'Origem do Preço',
          getValue(origemPreco),
          <i className="pi pi-map" style={{ color: '#DE820C' }} />,
          col ?? 3
        )}
      {isValueValid(salario) &&
        renderValue(
          'Salário (R$)',
          getValue(getValueMoney(salario)),
          <i className="pi pi-money-bill" style={{ color: '#DE820C' }} />,
          col ?? 3
        )}
      {isValueValid(encargosTotais) &&
        renderValue(
          'Encargos Totais (%)',
          getValue(getNumberFractionDigits(encargosTotais)),
          <i className="pi pi-percentage" style={{ color: '#DE820C' }} />,
          col ?? 3
        )}
      {isValueValid(periculosidadeInsalubridade) &&
        renderValue(
          'Periculosidade/Insalubridade (%)',
          getValue(getNumberFractionDigits(periculosidadeInsalubridade)),
          <i className="pi pi-percentage" style={{ color: '#DE820C' }} />,
          col ?? 3
        )}
      {isValueValid(valorAquisicao) &&
        renderValue(
          'Valor de Aquisição (R$)',
          getValue(getValueMoney(valorAquisicao)),
          <i className="pi pi-money-bill" style={{ color: '#DE820C' }} />,
          col ?? 3
        )}
      {isValueValid(depreciacao) &&
        renderValue(
          'Depreciação (R$/h)',
          getValue(getValueMoney(depreciacao)),
          <i className="pi pi-money-bill" style={{ color: '#DE820C' }} />,
          col ?? 3
        )}
      {isValueValid(oportunidadeCapital) &&
        renderValue(
          'Oportunidade de Capital (R$/h)',
          getValue(getValueMoney(oportunidadeCapital)),
          <i className="pi pi-money-bill" style={{ color: '#DE820C' }} />,
          col ?? 3
        )}
      {isValueValid(segurosImpostos) &&
        renderValue(
          'Seguros e Impostos (R$/h)',
          getValue(getValueMoney(segurosImpostos)),
          <i className="pi pi-money-bill" style={{ color: '#DE820C' }} />,
          col ?? 3
        )}
      {isValueValid(manutencao) &&
        renderValue(
          'Manutenção (R$/h)',
          getValue(getValueMoney(manutencao)),
          <i className="pi pi-money-bill" style={{ color: '#DE820C' }} />,
          col ?? 3
        )}
      {isValueValid(maoObraOperacao) &&
        renderValue(
          'Mão de Obra de Operação (R$/h)',
          getValue(getValueMoney(maoObraOperacao)),
          <i className="pi pi-money-bill" style={{ color: '#DE820C' }} />,
          col ?? 3
        )}
    </div>
  );
};

const renderValue = (label, value, icon, col = 12) => {
  return (
    <div className={`p-col-${col}`}>
      <div className="p-col-12 drawer-content-label" style={{ fontWeight: 'bold', color: '#9E9E9E', fontSize: '13px' }}>
        {label}
      </div>
      <div className="p-col-12">
        {icon && (
          <span className="icon" style={{ marginRight: '0.5rem' }}>
            {icon}
          </span>
        )}
        {value ?? '-'}
      </div>
    </div>
  );
};

ItemDetail.propTypes = {
  item: PropTypes.object,
  col: PropTypes.number,
  hideTitle: PropTypes.bool,
  mesColeta: PropTypes.string,
  desonerado: PropTypes.bool,
};

export default ItemDetail;
