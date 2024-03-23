import React from 'react';
import { getPrecoByFonte, getSumFromRawData, getValueMoney } from '~/utils/utils';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';

class SobrePreco extends React.Component {
  store;
  constructor(props) {
    super(props);
    this.itens = props.itens;

    this.getColorBar = this.getColorBar.bind(this);

    this.state = {
      itensSobrePreco: [],
      vTotalItensMercado: 0,
      vTotalPlanilha: 0,
    };
  }

  componentDidMount() {
    let itens = this.itens.map((item) => {
      const { caracteristicasDesonerado, caracteristicasNaoDesonerado, descricao } = item.referencia;

      let caracteristica;
      if (item.desonerado) {
        caracteristica = caracteristicasDesonerado.filter((c) => c.mesColeta == item.mesColeta);
      } else {
        caracteristica = caracteristicasNaoDesonerado.filter((c) => c.mesColeta == item.mesColeta);
      }

      const valorMercado = parseFloat(item.quantidade * getPrecoByFonte(caracteristica[0], item.fonte));
      const valorComprado = parseFloat(item.quantidade * item.precoUnitario);

      return {
        codigo: item.codigo,
        nome: descricao,
        valorMercado,
        valorComprado,
        sobrePreco: valorMercado - valorComprado,
        percentualSobrePreco: ((valorComprado - valorMercado) / valorMercado) * 100,
      };
    });

    const vTotalItensMercado = getSumFromRawData(itens, 'valorMercado');
    const vTotalPlanilha = getSumFromRawData(itens, 'valorPlanilha');

    itens = itens.slice().sort((a, b) => b.percentualSobrePreco - a.percentualSobrePreco);

    this.setState({
      itensSobrePreco: itens,
      vTotalItensMercado,
      vTotalPlanilha,
    });
  }

  getColorBar(mercado = true, preco, dataIndex) {
    const valuesMercado = this.state.itensSobrePreco.map((i) => i.valorMercado);

    if (mercado) {
      return '#a1a1aa';
    } else {
      const precoMercado = valuesMercado[dataIndex];
      return preco > precoMercado ? '#f87171' : '#4ade80';
    }
  }

  render() {
    const valuesMercado = this.state.itensSobrePreco.map((i) => i.valorMercado);
    const valuesComprados = this.state.itensSobrePreco.map((i) => i.valorComprado);

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
      },
      legend: {
        data: ['Preço Mercado', 'Preço Comprado'],
      },
      toolbox: {
        feature: {
          saveAsImage: { show: true },
        },
      },
      xAxis: [
        {
          type: 'category',
          data: this.state.itensSobrePreco.map((i) => `Código: ${i.codigo}`),
          axisPointer: {
            type: 'shadow',
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Preço',
          axisLabel: {
            formatter: '{value} R$',
          },
        },
      ],
      series: [
        {
          name: 'Preço Mercado',
          type: 'bar',
          itemStyle: {
            color: (params) => {
              return this.getColorBar(true, params.data, params.dataIndex);
            },
          },
          tooltip: {
            valueFormatter: (value) => {
              return getValueMoney(value);
            },
          },
          data: valuesMercado,
        },
        {
          name: 'Preço Comprado',
          type: 'bar',
          tooltip: {
            valueFormatter: (value) => {
              return getValueMoney(value);
            },
          },
          itemStyle: {
            color: (params) => {
              return this.getColorBar(false, params.data, params.dataIndex);
            },
          },
          data: valuesComprados,
        },
      ],
    };

    return (
      <div className="h-full" id="sobrepreco-container">
        <h4 className="w-full flex justify-content-center flex-wrap font-bold">
          Análise de Preço: Comparação de Preços Mercado x Comprados
        </h4>
        <ReactEcharts className="h-full w-full" option={option} />
      </div>
    );
  }
}

SobrePreco.propTypes = {
  itens: PropTypes.array,
};

export default SobrePreco;
