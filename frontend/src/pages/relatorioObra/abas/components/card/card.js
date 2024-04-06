import './style.scss';
import React from 'react';
import { getNumberFractionDigits, getPrecoByFonte, getSumFromRawData, getValueMoney } from '~/utils/utils';
import PropTypes from 'prop-types';
import Tooltip from '~/components/Tooltip';
import StoreIcon from './storeIcon';
import PercentIcon from './percentIcon';

class CardsPrecos extends React.Component {
  constructor(props) {
    super(props);
    this.itens = props.itens;
    this.state = {
      vTotalItensMercado: 0,
      vTotalitensComprados: 0,
    };
  }

  componentDidMount() {
    let itensMercado = this.itens.map((item) => {
      const { caracteristicasDesonerado, caracteristicasNaoDesonerado, descricao } = item.referencia;

      let caracteristica;
      if (item.desonerado) {
        caracteristica = caracteristicasDesonerado.filter((c) => c.mesColeta == item.mesColeta);
      } else {
        caracteristica = caracteristicasNaoDesonerado.filter((c) => c.mesColeta == item.mesColeta);
      }

      const valor = parseFloat(item.quantidade * getPrecoByFonte(caracteristica[0], item.fonte));
      return { codigo: item.codigo, nome: descricao, valor };
    });

    let itensComprados = this.itens.map((item) => {
      const { descricao } = item.referencia;
      const valor = parseFloat(item.quantidade * item.precoUnitario);
      return { codigo: item.codigo, nome: descricao, valor };
    });

    const sumItensFonte = getSumFromRawData(itensMercado, 'valor');
    const sumItensPlanilha = getSumFromRawData(itensComprados, 'valor');

    this.setState({
      vTotalItensMercado: sumItensFonte,
      vTotalitensComprados: sumItensPlanilha,
    });
  }

  render() {
    const { vTotalItensMercado, vTotalitensComprados } = this.state;
    return (
      <div className="dashboard-container-obra">
        <div className="card-obra">
          <div className="card-content-obra flex flex-column gap-4">
            <div className="card-title-wrapper">
              <span className="card-title-obra">Valor da Licitação</span>
              <i className="pi pi-file" style={{ fontSize: '24px' }} />
            </div>
            <div className="card-value-obra">
              <span className="flex align-items-center gap-2 w-full	justify-content-between">
                <span className="text-3xl">{getValueMoney(10000)}</span>
                <div className="icon-rounded-wrapper" style={{ backgroundColor: '#cffafe' }}>
                  <i className="pi pi-money-bill icon-rounded" style={{ fontSize: '24px', color: '#06b6d4' }} />
                </div>
              </span>
            </div>
          </div>
        </div>
        <div className="card-obra">
          <div className="card-content-obra flex flex-column gap-4">
            <div className="card-title-wrapper">
              <span className="card-title-obra">Receita Total: Mercado</span>
              <StoreIcon />
            </div>
            <div className="card-value-obra">
              <span className="flex align-items-center gap-2 w-full	justify-content-between">
                <span className="text-3xl">{getValueMoney(this.state.vTotalItensMercado)}</span>
                <div
                  className="icon-rounded-wrapper"
                  style={{ backgroundColor: vTotalItensMercado < vTotalitensComprados ? '#dcfce7' : '#fee2e2' }}
                >
                  {vTotalItensMercado < vTotalitensComprados ? (
                    <i className="pi pi-arrow-down-right icon-rounded" style={{ color: '#22c55e' }} />
                  ) : (
                    <i className="pi pi-arrow-up-right icon-rounded" style={{ color: '#ef4444' }} />
                  )}
                </div>
              </span>
            </div>
          </div>
        </div>
        <div className="card-obra">
          <div className="card-content-obra flex flex-column gap-4">
            <div className="card-title-wrapper">
              <span className="card-title-obra">Receita Total: Comprados</span>
              <i className="pi pi-shopping-bag" style={{ fontSize: '24px' }} />
            </div>
            <div className="card-value-obra">
              <span className="flex align-items-center gap-2 w-full	justify-content-between">
                <span className="text-3xl">{getValueMoney(this.state.vTotalitensComprados)}</span>
                <div
                  className="icon-rounded-wrapper"
                  style={{ backgroundColor: vTotalitensComprados > vTotalItensMercado ? '#fee2e2' : '#dcfce7' }}
                >
                  {vTotalitensComprados > vTotalItensMercado ? (
                    <i className="pi pi-arrow-up-right icon-rounded" style={{ color: '#ef4444' }} />
                  ) : (
                    <i className="pi pi-arrow-up-right icon-rounded" style={{ color: '#22c55e' }} />
                  )}
                </div>
              </span>
            </div>
          </div>
        </div>
        <div className="card-obra">
          <div className="card-content-obra flex flex-column gap-4">
            <div className="card-title-wrapper">
              <span className="card-title-obra">Diferença em Porcentagem</span>
              <PercentIcon />
            </div>
            <div className="card-value-obra">
              <Tooltip
                value={
                  vTotalitensComprados > vTotalItensMercado ? 'Acima do valor de mercado' : 'Abaixo do valor mercado'
                }
              >
                <span className="flex align-items-center gap-2 w-full justify-content-between">
                  <span className="text-3xl">
                    {vTotalItensMercado > 0
                      ? `${getNumberFractionDigits(
                          ((this.state.vTotalitensComprados - this.state.vTotalItensMercado) /
                            this.state.vTotalItensMercado) *
                            100
                        )}%`
                      : '0 %'}
                  </span>
                  <div
                    className="icon-rounded-wrapper"
                    style={{ backgroundColor: vTotalitensComprados > vTotalItensMercado ? '#fee2e2' : '#dcfce7' }}
                  >
                    {vTotalitensComprados > vTotalItensMercado ? (
                      <i className="pi pi-arrow-up-right icon-rounded" style={{ color: '#ef4444' }} />
                    ) : (
                      <i className="pi pi-arrow-up-right icon-rounded" style={{ color: '#22c55e' }} />
                    )}
                  </div>
                </span>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className="card-obra">
          <div className="card-content-obra flex flex-column gap-4">
            <div className="card-title-wrapper">
              <span className="card-title-obra">Diferença em Dinheiro</span>
              <i className="pi pi-money-bill" style={{ fontSize: '24px' }} />
            </div>
            <div className="card-value-obra">
              <Tooltip
                value={
                  vTotalitensComprados > vTotalItensMercado ? 'Acima do valor de mercado' : 'Abaixo do valor mercado'
                }
              >
                <span className="flex align-items-center gap-2 w-full justify-content-between">
                  <span className="text-3xl">{`${getValueMoney(
                    this.state.vTotalitensComprados - this.state.vTotalItensMercado
                  )}`}</span>
                  <div
                    className="icon-rounded-wrapper"
                    style={{ backgroundColor: vTotalitensComprados > vTotalItensMercado ? '#fee2e2' : '#dcfce7' }}
                  >
                    {vTotalitensComprados > vTotalItensMercado ? (
                      <i className="pi pi-arrow-up-right icon-rounded" style={{ color: '#ef4444' }} />
                    ) : (
                      <i className="pi pi-arrow-up-right icon-rounded" style={{ color: '#22c55e' }} />
                    )}
                  </div>
                </span>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CardsPrecos.propTypes = {
  itens: PropTypes.array,
  licitacao: PropTypes.object,
};

export default CardsPrecos;
