import React from 'react';
import { getPercent, getPrecoByFonte, getSumFromRawData } from '~/utils/utils';
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

  getClassificacaoByPercent(percentAccumulated) {
    if (percentAccumulated <= 50) {
      return 'A';
    } else if (percentAccumulated <= 80) {
      return 'B';
    } else {
      return 'C';
    }
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

    const sumItensMercado = getSumFromRawData(itensMercado, 'valor');
    const sumItensComprados = getSumFromRawData(itensComprados, 'valor');

    itensMercado = itensMercado.map((item) => ({ ...item, percent: getPercent(item.valor, sumItensMercado) }));
    itensComprados = itensComprados.map((item) => ({ ...item, percent: getPercent(item.valor, sumItensComprados) }));

    const sortedItensMercado = itensMercado.slice().sort((a, b) => b.valor - a.valor);
    const sortedItensComprados = itensComprados.slice().sort((a, b) => b.valor - a.valor);

    let currentPercent = 0;
    itensMercado.forEach((item, idx) => {
      if (idx === 0) {
        itensMercado[idx].categoria = this.getClassificacaoByPercent(item.percent);
      } else {
        itensMercado[idx].categoria = this.getClassificacaoByPercent(item.percent + currentPercent);
      }
      currentPercent += item.percent;
    });

    currentPercent = 0;
    itensComprados.forEach((item, idx) => {
      if (idx === 0) {
        itensComprados[idx].categoria = this.getClassificacaoByPercent(item.percent);
      } else {
        itensComprados[idx].categoria = this.getClassificacaoByPercent(item.percent + currentPercent);
      }
      currentPercent += item.percent;
    });

    this.setState({
      dataItensMercado: sortedItensMercado,
      dataItensComprados: sortedItensComprados,
      valorTotalItensMercado: sumItensMercado,
      valorTotalitensComprados: sumItensComprados,
    });
  }

  getXValues() {
    const { dataItensMercado } = this.state;
    const incrementPercentItensMercado = 100 / dataItensMercado?.length;
    const result = [0];
    let increment = 0;
    for (let index = 0; index < dataItensMercado.length; index++) {
      increment = increment + incrementPercentItensMercado;
      result.push(parseFloat(increment.toFixed(2)));
    }
    return result;
  }

  getYValues() {
    const { dataItensMercado } = this.state;
    const result = [0];
    let increment = 0;
    dataItensMercado.forEach((i) => {
      increment = increment + i.percent;
      result.push(parseFloat(increment.toFixed(2)));
    });
    return result;
  }

  getPieces(xValues) {
    let pieces = [
      {
        gt: 0,
        lt: 5,
        color: '#f87171',
      },
      {
        gt: 0,
        lt: 5,
        color: '#38bdf8',
      },
      {
        gt: 0,
        lt: 6,
        color: '#fb923c',
      },
    ];

    let currentIndex = 0;
    let incrementValue = 0;
    xValues?.forEach((v) => {
      incrementValue = incrementValue + v;
      if (incrementValue <= 20) {
        const piece = pieces[0];
        piece.lt = currentIndex;
        pieces[0] = piece;
      } else if (incrementValue > 20 && incrementValue <= 50) {
        const piece = pieces[1];
        piece.gt = pieces[0].lt;
        piece.lt = currentIndex;
        pieces[1] = piece;
      } else {
        const piece = pieces[2];
        piece.gt = pieces[1].lt;
        piece.lt = currentIndex;
        pieces[2] = piece;
      }
      currentIndex += 1;
    });
    return pieces;
  }

  render() {
    const xValues = this.getXValues();
    const yValues = this.getYValues();
    const pieces = this.getPieces(xValues);
    const option = {
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xValues,
        axisLabel: {
          formatter: '{value}%',
        },
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '30%'],
        axisLabel: {
          formatter: '{value}%',
        },
        axisTick: { interval: 40 },
        min: 0,
        max: 100,
      },
      visualMap: {
        type: 'piecewise',
        show: false,
        dimension: 0,
        seriesIndex: 0,
        pieces: pieces,
      },
      series: [
        {
          type: 'line',
          smooth: 0.6,
          symbol: 'none',
          lineStyle: {
            color: '#740013',
            width: 2,
          },
          markPoint: {
            data: [
              {
                coord: [pieces[0].lt, yValues[pieces[0].lt]],
                label: {
                  formatter: `${yValues[pieces[0].lt]}%`,
                },
              },
              {
                coord: [pieces[1].lt, yValues[pieces[1].lt]],
                label: {
                  formatter: `${yValues[pieces[1].lt]}%`,
                },
              },
              {
                coord: [pieces[2].lt, yValues[pieces[2].lt]],
                label: {
                  formatter: `${yValues[pieces[2].lt]}%`,
                },
              },
            ],
          },
          markLine: {
            symbol: ['none', 'none'],
            label: { show: false },
            data: [
              { xAxis: pieces[0].gt },
              { xAxis: pieces[0].lt },
              { xAxis: pieces[1].gt },
              { xAxis: pieces[1].lt },
              { xAxis: pieces[2].gt },
              { xAxis: pieces[2].lt },
            ],
          },
          areaStyle: {},
          data: yValues,
          markArea: {
            label: {
              position: 'top',
              fontSize: '40',
              fontWeight: 'bolder',
              color: '#27272a',
            },
            itemStyle: {
              color: 'rgba(249, 248, 248, 0.8)',
            },
            data: [
              [
                {
                  name: 'A',
                  xAxis: pieces[0].gt,
                },
                {
                  xAxis: pieces[0].lt,
                },
              ],
              [
                {
                  name: 'B',
                  xAxis: pieces[1].gt,
                },
                {
                  xAxis: pieces[1].lt,
                },
              ],
              [
                {
                  name: 'C',
                  xAxis: pieces[2].gt,
                },
                {
                  xAxis: pieces[2].lt,
                },
              ],
            ],
          },
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
        <ReactEcharts option={option} style={{ height: this.props.height }} id="abc-container" />
      </div>
    );
  }
}

Abc.propTypes = {
  itens: PropTypes.array,
  height: PropTypes.string,
};

export default Abc;
