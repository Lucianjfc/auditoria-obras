import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { InputText } from 'primereact/inputtext';

@observer
class InputNumber extends React.Component {
  constructor(props) {
    super(props);
    this._innerOnChange = this._innerOnChange.bind(this);
    this._innerOnBlur = this._innerOnBlur.bind(this);
    this._valueFormat = this._valueFormat.bind(this);
  }

  _valueFormat(valor) {
    //substitui todas as vírgulas por ponto e nega a entrada de múltiplas vírgulas
    if (valor.includes(',')) {
      valor = valor.replace(',', '.');
      const valorAntesVirgula = valor.substring(0, valor.lastIndexOf('.'));
      const valorDepoisVirgula = valor.substring(valor.lastIndexOf('.'), valor.length);
      valor = valorAntesVirgula.replace('.', '') + valorDepoisVirgula;
    }

    //nega a entrada de múltiplos pontos
    if (valor.includes('.')) {
      const valorAntesPonto = valor.substring(0, valor.lastIndexOf('.'));
      const valorDepoisPonto = valor.substring(valor.lastIndexOf('.'), valor.length);
      valor = valorAntesPonto.replace('.', '') + valorDepoisPonto;
    }

    //permite sinal negativo apenas no início do número
    if (valor.includes('-')) {
      if (valor.charAt(0) == '-') {
        valor = valor.substring(1, valor.length);
        valor = valor.replace('-', '');
        valor = '-' + valor;
      } else {
        valor = valor.replace('-', '');
      }
    }

    //nega a entrada de pontos no início do número
    if (valor.includes('.')) {
      if (valor.charAt(0) == '.') {
        valor = valor.replace('.', '');
      }
    }
    return valor;
  }

  _innerOnBlur(event) {
    let valor = event.target.value;
    if (this.props.leadingZeros && valor.charAt(valor.length - 1) == '.') {
      valor = valor.replace('.', '');
    } else if (!this.props.leadingZeros) {
      valor = Number(valor);
    }
    event.target.value = valor;
    this._innerOnChange(event);
  }

  _innerOnChange(event) {
    let valor = event.target.value;

    if (!this.props.leadingZeros) {
      if (valor == '') {
        valor = null;
      } else {
        if (valor.charAt(valor.length - 1) == '.') {
          valor = this._valueFormat(valor);
        } else {
          valor = Number(valor);
        }
      }
    }

    event.target.value = valor;
    this.props.onChange(event);
  }

  render() {
    return (
      <InputText
        {...this.props}
        keyfilter={/-?[0-9.,-]+/g}
        autoComplete="off"
        onChange={this._innerOnChange}
        onBlur={this._innerOnBlur}
      />
    );
  }
}

InputNumber.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  leadingZeros: PropTypes.bool,
};

InputNumber.defaultProps = {
  leadingZeros: false,
};

export default InputNumber;
