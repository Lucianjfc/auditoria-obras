import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { InputText } from 'primereact/inputtext';

@observer
class InputMonetary extends React.Component {
  fractionalPart = 0;
  constructor(props) {
    super(props);
    const formattedValue = props.value ? this._format(this.props.value) : '';
    this.state = {
      formattedValue,
    };
    this._format = this._format.bind(this);
    this._cleanUserInput = this._cleanUserInput.bind(this);
    this._onChange = this._onChange.bind(this);
    this._parse = this._parse.bind(this);
  }

  componentDidMount() {
    this.fractionalPart = parseInt('1'.padEnd(this.props.decimalPlaces + 1, '0'));
    const formattedValue = this._format(this.props.value);
    this.setState({ formattedValue });
  }

  componentDidUpdate(prevProps) {
    this.fractionalPart = parseInt('1'.padEnd(this.props.decimalPlaces + 1, '0'));
    if (this.props.value !== prevProps.value || this.props.decimalPlaces != prevProps.decimalPlaces) {
      const formattedValue = this._format(this.props.value);
      this.setState({ formattedValue });
      this.props.onChange(this._parse(formattedValue));
    }
  }

  //transforma de um formato já tratado para um formato numérico - ex com duas casas decimais: (123.546.231,65) -> (123546231.65)
  _parse(value) {
    if (value === '') value = '0';
    let valor = this._cleanUserInput(value); // limpa o valor, mantendo apenas os valores numéricos
    valor += '';
    valor = parseInt(valor.replace(/[^0-9]+/g, '')) / this.fractionalPart;
    if (Number.isNaN(valor)) valor = undefined;
    return valor;
  }

  //transforma de um formato numérico para o tratado final - ex com duas casas decimais:(123546231.65) -> (123.546.231,65)
  _format(value) {
    value = Number.parseFloat(value);
    if (Number.isNaN(value)) {
      value = 0;
    }
    let valor = Math.round(value * this.fractionalPart) + '';
    valor = parseInt(valor.replace(/([^0-9])+/g, '')) / this.fractionalPart;
    valor = Intl.NumberFormat('pt-BR', { minimumFractionDigits: this.props.decimalPlaces }).format(valor);
    if (value.length > 6) {
      const regex = '/([0-9]{3}),([0-9]{decimalPlaces}$)/g'.replace('decimalPlaces', this.props.decimalPlaces);
      valor = valor.replace(regex, '$1,$2');
    }
    if (Number.isNaN(valor)) valor = undefined;
    return valor;
  }

  _cleanUserInput(value) {
    // usar regex para limpar os valores - tudo que não for numérico vai ser substituido por string vazia
    let valor = value + '';
    return parseInt(valor.replace(/([^0-9])+/g, ''));
  }

  _onChange(event) {
    const { min, max } = this.props;
    const userInputValue = event.target.value;
    const cleanedValue = this._parse(userInputValue);
    const value = Number.parseFloat(cleanedValue);
    if (!Number.isNaN(value) && value >= min && value <= max) {
      this.props.onChange(cleanedValue);
      const formattedValue = this._format(cleanedValue);
      this.setState({ formattedValue });
    }
  }

  render() {
    return <InputText {...this.props} value={this.state.formattedValue} onChange={this._onChange} />;
  }
}

InputMonetary.defaultProps = {
  decimalPlaces: 2,
  min: Number.NEGATIVE_INFINITY,
  max: Number.POSITIVE_INFINITY,
};

InputMonetary.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  decimalPlaces: PropTypes.any,
  min: PropTypes.any,
  max: PropTypes.any,
};

export default InputMonetary;
