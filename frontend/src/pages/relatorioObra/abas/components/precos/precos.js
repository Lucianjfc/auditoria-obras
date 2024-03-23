import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { getAVGFromRawData, getPrecoByFonte, getValueMoney } from '~/utils/utils';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';

class Precos extends PureComponent {
  constructor(props) {
    super(props);
  }

  getPrecos() {
    return !this.props.desonerado
      ? this.props?.precosNaoDesonerados?.map((caracteristica) => {
          return {
            name: caracteristica?.mesColeta,
            preco: getPrecoByFonte(caracteristica, this.props.fonte),
          };
        })
      : this.props?.precosDesonerados?.map((caracteristica) => {
          return {
            name: caracteristica?.mesColeta,
            preco: getPrecoByFonte(caracteristica, this.props.fonte),
          };
        });
  }

  render() {
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params) => {
          return `Mês de Coleta: ${params[0].name}<br> Preço: ${getValueMoney(params[0].value)} `;
        },
      },
      xAxis: {
        type: 'category',
        data: this.getPrecos().map((p) => p.name),
        name: 'Preço',
        nameTextStyle: { color: '#18181b' },
        axisLabel: {
          interval: 0,
          rotate: 20,
          color: '#18181b',
          formatter: (value) => moment(value, 'YYYYMM').format('MM/YYYY'),
        },
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          mark: { show: true },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      yAxis: [
        {
          type: 'value',
          name: 'Preço',
          nameTextStyle: { color: '#18181b' },
          axisLabel: {
            color: '#18181bcc',
            margin: 25,
            formatter: (value) => getValueMoney(value),
          },
        },
      ],
      series: [
        {
          data: this.getPrecos().map((p) => p.preco),
          type: 'line',
        },
        {
          name: 'Média',
          type: 'line',
          data: [getAVGFromRawData(this.getPrecos(), 'preco')],
          markLine: {
            data: [{ type: 'average', name: 'Avg' }],
            itemStyle: {
              color: 'purple',
            },
            lineStyle: {
              type: 'solid',
            },
            label: {
              show: true,
              position: 'middle',
              distance: 2,
              formatter: (param) => {
                let text = '';
                const value = getValueMoney(param.value);
                text += 'Média' + ' (' + (value ?? '-') + ')';
                return text;
              },
            },
          },
          tooltip: {
            show: false,
          },
          symbol: 'none',
          symbolSize: 0,
          itemStyle: {
            color: 'transparent',
          },
        },
      ],
    };

    return (
      <div>
        <span className="w-full flex justify-content-center flex-wrap">{this.props.title}</span>
        <ReactEcharts className="!h-full !w-full" option={option} />
      </div>
    );
  }
}

Precos.propTypes = {
  precosNaoDesonerados: PropTypes.array,
  precosDesonerados: PropTypes.array,
  title: PropTypes.string,
  desonerado: PropTypes.bool,
  fonte: PropTypes.string,
};

export default Precos;
