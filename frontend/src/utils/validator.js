import { cpf, cnpj } from 'cpf-cnpj-validator';
import moment from 'moment';
const validator = require('email-validator');

export const cleanCpfCnpj = (cpfCnpj) => {
  cpfCnpj = cpfCnpj.replace('.', '');
  cpfCnpj = cpfCnpj.replace('/', '');
  cpfCnpj = cpfCnpj.replace('-', '');

  return cpfCnpj;
};

export const isCpfCnpj = (cpfCnpj) => {
  if (cpfCnpj) {
    cpfCnpj = cleanCpfCnpj('' + cpfCnpj);

    if (cpf.isValid(cpfCnpj)) {
      return 'cpf';
    } else if (cnpj.isValid(cpfCnpj)) {
      return 'cnpj';
    }
  }

  return null;
};

export const isMaxLength = (campo, tamanhoMax) => {
  if (campo === undefined || campo === null) {
    return true;
  }
  const stringValue = `${campo}`;

  return stringValue.length <= tamanhoMax;
};

export const isArrayMaxLength = (campo, tamanhoArrayMax) => {
  if (campo === undefined || campo === null) {
    return true;
  }
  const tamanho = campo.length;

  return tamanho <= tamanhoArrayMax;
};

export const isEmail = (email) => {
  return validator.validate(email);
};

export const isNumber = (value) => {
  return !isNaN(value);
};

export const isBusinessHours = (value) => {
  const date = moment(value);
  return date.hours() >= 8 && date.hours() < 18 && date.day() >= 1 && date.day() <= 5;
};

export const isLessThanYear = (value) => {
  const chosenDate = moment(value).startOf('hour');
  const yearFromNow = moment().add(1, 'year').startOf('hour');

  return chosenDate.isSameOrBefore(yearFromNow);
};

export const isLessThanYearByValue = (value, valueComparable) => {
  const chosenDate = moment(value).startOf('minute');
  const yearFromNow = valueComparable
    ? moment(valueComparable).add(1, 'year').startOf('minute')
    : moment().add(1, 'year').startOf('minute');

  return chosenDate.isSameOrBefore(yearFromNow);
};

export const isAfterOpenDate = (value, openDateValue) => {
  const chosenDate = moment(value);
  const openDate = moment(openDateValue);

  return chosenDate.isAfter(openDate);
};
