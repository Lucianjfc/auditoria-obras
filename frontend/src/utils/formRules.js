import {
  isCpfCnpj,
  isEmail,
  isMaxLength,
  isArrayMaxLength,
  isNumber,
  isBusinessHours,
  isLessThanYear,
  isLessThanYearByValue,
  isAfterOpenDate,
} from './validator';
import { isValueValid } from './utils';

export const extractRules = (definition, object) => {
  const fields = Object.keys(definition);
  const result = {};

  fields.forEach((field) => {
    const rules = definition[field];
    result[field] = validateRule(object[field], rules);
  });

  return result;
};

const validateRule = (value, ruleList = []) => {
  if (!Array.isArray(ruleList)) {
    throw new Error('Rule definition should be an Array.');
  }

  const validationResult = { error: false, message: '', rules: ruleList };

  ruleList.forEach((rule) => {
    if (rule.rule === 'required') {
      if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
        validationResult.error = true;
        validationResult.message = (rule.message ?? 'Por favor, preencha o campo') + ' ';
      }
    } else if (rule.rule === 'isCpfCnpj') {
      if (value && !isCpfCnpj(value)) {
        validationResult.error = true;
        validationResult.message = (rule.message ?? 'Por favor, informe um CPF/CNPJ válido') + ' ';
      }
    } else if (rule.rule === 'isMaxLength') {
      if ((value, rule.maxLength && !isMaxLength(value, rule.maxLength))) {
        validationResult.error = true;
        validationResult.message = (rule.message ?? 'Por favor, retifique o tamanho do campo') + ' ';
      }
    } else if (rule.rule === 'isArrayMaxLength') {
      if ((value, rule.maxLength && !isArrayMaxLength(value, rule.maxLength))) {
        validationResult.error = true;
        validationResult.message = (rule.message ?? 'Por favor, retifique o número de elementos do campo') + ' ';
      }
      if ((value, rule.maxLength === 0 && !isArrayMaxLength(value, rule.maxLength))) {
        validationResult.error = true;
        validationResult.message = (rule.message ?? 'Por favor, retifique o número de elementos do campo') + ' ';
      }
    } else if (rule.rule === 'isEmail') {
      if (value && !isEmail(value)) {
        validationResult.error = true;
        validationResult.message = (rule.message ?? 'Por favor, informe um e-mail válido') + ' ';
      }
    } else if (rule.rule === 'isGreaterThanZero') {
      if (isValueValid(value) && (!isNumber(value) || value === 0)) {
        validationResult.error = true;
        validationResult.message = (rule.message ?? 'Por favor, informe um valor maior que zero') + ' ';
      }
    } else if (rule.rule === 'isBusinessHours') {
      if (value && !isBusinessHours(value)) {
        validationResult.error = true;
        validationResult.message = (rule.message ?? 'Por favor, realize essa tarefa durante o horário comercial') + ' ';
      }
    } else if (rule.rule === 'isLessThanYear') {
      if (value && !isLessThanYear(value)) {
        validationResult.error = true;
        validationResult.message =
          (rule.message ?? 'Por favor, selecione uma data dentro do intervalo de um ano') + ' ';
      }
    } else if (rule.rule === 'isLessThanYearByValue') {
      if (value && !isLessThanYearByValue(value, rule.valueComparable)) {
        validationResult.error = true;
        validationResult.message =
          (rule.message ?? 'Por favor, selecione uma data dentro do intervalo de um ano') + ' ';
      }
    } else if (rule.rule === 'isAfterOpenDate') {
      if (value && !isAfterOpenDate(value, rule.openDate)) {
        validationResult.error = true;
        validationResult.message = (rule.message ?? 'Por favor, selecione uma data superior a data de abertura') + ' ';
      }
    }
  });

  return validationResult;
};
