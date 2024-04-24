import React from 'react';
import { getNumberFractionDigits, getPercent, getPrecoByFonte, getSumFromRawData, getValueMoney } from '~/utils/utils';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';

class Abc extends React.Component {
  store;
  constructor(props) {
    super(props);
    this.itens = props.itens;
    this.state = {
      dataItensMercado: [],
      dataItensComprados: [],
      valorTotalItensMercado: 0,
      valorTotalitensComprados: 0,
    };
  }

  getClassificacaoByPercent(array) {
    return array.map((item) => {
      if (item.percentualAcumulado <= 80) {
        item['categoria'] = 'A';
      } else if (item.percentualAcumulado > 80 && item.percentualAcumulado <= 95) {
        item['categoria'] = 'B';
      } else if (item.percentualAcumulado > 95 && item.percentualAcumulado <= 100) {
        item['categoria'] = 'C';
      }
      return item;
    });
  }

  calcularSomaAcumulada(array) {
    let somaAcumulada = 0;
    return array.map((item) => {
      somaAcumulada += item.valor;
      item['somaAcumulada'] = somaAcumulada;
      return item;
    });
  }

  calcularPercentualAcumulado(array) {
    let percentAcumulado = 0;

    return array.map((item, index) => {
      percentAcumulado += item.percent;
      const percentAcumuladoArredondado = Math.round(percentAcumulado * 100) / 100; // Arredondando para duas casas decimais
      item['percentualAcumulado'] = percentAcumuladoArredondado;

      if (index === array.length - 1 && percentAcumuladoArredondado !== 100) {
        item['percentualAcumulado'] += 100 - percentAcumuladoArredondado;
      }

      return item;
    });
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

    itensMercado = this.calcularSomaAcumulada(itensMercado);
    itensComprados = this.calcularSomaAcumulada(itensComprados);

    const sumItensMercado = getSumFromRawData(itensMercado, 'valor');
    const sumItensComprados = getSumFromRawData(itensComprados, 'valor');

    itensMercado = itensMercado.map((item) => ({ ...item, percent: getPercent(item.valor, sumItensMercado) }));
    itensComprados = itensComprados.map((item) => ({ ...item, percent: getPercent(item.valor, sumItensComprados) }));

    const sortedItensMercado = itensMercado.slice().sort((a, b) => b.valor - a.valor);
    const sortedItensComprados = itensComprados.slice().sort((a, b) => b.valor - a.valor);

    itensMercado = this.calcularPercentualAcumulado(sortedItensMercado);
    itensComprados = this.calcularPercentualAcumulado(sortedItensComprados);

    itensMercado = this.getClassificacaoByPercent(itensMercado);
    itensComprados = this.getClassificacaoByPercent(itensComprados);

    this.setState({
      dataItensMercado: itensMercado,
      dataItensComprados: itensComprados,
      valorTotalItensMercado: sumItensMercado,
      valorTotalitensComprados: sumItensComprados,
    });
  }

  getXValues() {
    return this.state.dataItensComprados.map((item) => item.valor);
  }

  getYValues() {
    return this.state.dataItensComprados.map((item) => item.percentualAcumulado);
  }

  getCatagory() {
    return this.state.dataItensComprados.map((item) => item.codigo);
  }

  getLastIndexCategoria(categoria) {
    if (this.state.dataItensComprados.length > 0) {
      let result = this.state.dataItensComprados?.findLastIndex((item) => item.categoria == categoria) ?? 0;
      return result;
    } else {
      return 0;
    }
  }

  render() {
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
        data: ['Custo Total Unit', 'Porcentagem Acum.'],
      },
      xAxis: [
        {
          type: 'category',
          data: this.getCatagory(),
          axisPointer: {
            type: 'shadow',
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Custo Total Unit',
          min: 0,
          max: this.state.dataItensComprados[0]?.valor,
          axisLabel: {
            formatter: '{value} R$',
          },
        },
        {
          type: 'value',
          name: 'Porcentagem Acum.',
          min: 0,
          max: 100,
          axisLabel: {
            formatter: '{value} %',
          },
        },
      ],
      visualMap: {
        type: 'piecewise',
        show: false,
        dimension: 0,
        seriesIndex: 1,
        pieces: [
          {
            gt: -1,
            lt: this.getLastIndexCategoria('A'),
            color: '#f87171',
          },
          {
            gt: this.getLastIndexCategoria('A'),
            lt: this.getLastIndexCategoria('B'),
            color: '#38bdf8',
          },
          {
            gt: this.getLastIndexCategoria('B'),
            lt: this.getLastIndexCategoria('C'),
            color: '#fb923c',
          },
        ],
      },
      series: [
        {
          name: 'Custo Total Unit',
          type: 'bar',
          tooltip: {
            valueFormatter: function (value) {
              return getValueMoney(value);
            },
          },
          data: this.getXValues(),
          z: 10,
        },
        {
          name: 'Porcentagem Acum.',
          type: 'line',
          areaStyle: {},
          yAxisIndex: 1,
          tooltip: {
            valueFormatter: function (value) {
              return getNumberFractionDigits(value) + ' %';
            },
          },
          data: [...this.getYValues()],
        },
      ],
    };

    return (
      <div className="h-full" id="abc-container">
        <span className="w-full flex justify-content-center flex-wrap flex-column align-items-center">
          <h4 className="font-bold">Análise ABC: Distribuição de Custos por Importância em Orçamento de Obras</h4>
          <h5 className="font-medium">
            Mercados de Despesas e sua Significância Relativa na Execução de Projetos de Construção
          </h5>
        </span>

        {this.state.dataItensComprados?.length > 0 ? (
          <ReactEcharts option={option} style={{ height: this.props.height }} id="abc-container" />
        ) : (
          <h1>
            <b>Por favor, adicione itens</b>
          </h1>
        )}
      </div>
    );
  }
}

Abc.propTypes = {
  itens: PropTypes.array,
  height: PropTypes.string,
};

export default Abc;
