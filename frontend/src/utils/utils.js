import React from 'react';
import moment from 'moment';
import AppStore from '../stores/AppStore';
import { DATE_FORMAT, DATE_PARSE_FORMAT } from './date';

export const buildRequestParams = (params = {}) => {
  const defaultValues = {
    'page.index': 1,
    'page.size': 10,
    filterType: 'FILTER',
  };

  const newParamObject = Object.assign(defaultValues, params);
  const paramList = [];

  Object.keys(newParamObject).forEach((key) => {
    if (newParamObject[key] !== null && newParamObject[key] !== undefined) {
      paramList.push(`${key}=${encodeURIComponent(newParamObject[key])}`);
    }
  });

  return paramList.length > 0 ? '?' + paramList.join('&') : '';
};

export const showNotification = (severity = 'info', summary = null, detail = null) => {
  const ref = AppStore.notificationRefFunction();
  ref && ref.show({ severity, summary, detail });
};

export const showErrorNotification = (error) => {
  let message = 'Ocorreu um erro!';
  if (
    error.response &&
    error.response.data &&
    error.response.data.messages &&
    error.response.data.messages.length > 0
  ) {
    message = error.response.data.messages.join('; ');
  }
  console.error(error);
  showNotification('error', null, message);
};

export const getValueByKey = (value, list = [], key = 'value', label = 'text') => {
  let result = '-';
  const filtered = list.filter((item) => item[key] === value);
  if (filtered.length > 0) {
    result = filtered[0][label];
  }
  return result;
};

export const getMultipleValuesByKey = (values = [], list = [], key = 'value', label = 'text') => {
  return values.map((v) => getValueByKey(v, list, key, label)).join(', ');
};

export const getValueDate = (value, formatter = DATE_FORMAT, parser = DATE_PARSE_FORMAT) => {
  return value ? moment(value, parser).format(formatter) : '-';
};

export const getValue = (value) => (value ? value : '-');

export const getOriginUrl = () => {
  const splitedUrl = document.location.href.split('#');
  let result = splitedUrl && splitedUrl.length > 0 ? splitedUrl[0] : document.location.origin;
  if (result[result.length - 1] === '/') {
    result = result.slice(0, result.length - 1);
  }
  return result;
};

export const getValueMoney = (value, decimalPlaces = 2, defaultValue) => {
  return isValueValid(value) && !isNaN(value)
    ? new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: decimalPlaces,
      }).format(value)
    : isValueValid(defaultValue) && !isNaN(defaultValue)
    ? new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: decimalPlaces,
      }).format(defaultValue)
    : '-';
};

export const getValueMoneyIfNotFormatted = (value, decimalPlaces = 2) =>
  typeof value === 'string' && value?.includes(',') ? `R$ ${value}` : getValueMoney(value, decimalPlaces);

export const moneyFormatToFloat = (value) => {
  if (typeof value === 'string') {
    var match = value.match(/[0-9,.]*/g)?.filter((m) => isValueValid(m));
    if (match !== null) {
      value = parseFloat(match[0].replace(/\./g, '').replace(/,/g, '.'));
    }
  }
  return value;
};

export const getNumberFractionDigits = (value, decimalPlaces = 2) => {
  return isValueValid(value)
    ? new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: decimalPlaces }).format(value)
    : '-';
};

export const getValueElipsis = (value, size = 100) => {
  const treatedValue = getValue(value);
  return treatedValue.length > size ? treatedValue.substring(0, size) + '...' : treatedValue;
};

export const cloneChildrenRecursive = (children, props) => {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    const childProps = props;
    childProps.children = cloneChildrenRecursive(child.props.children, props);
    return React.cloneElement(child, childProps);
  });
};

export const getMenuAuthorized = (model) => {
  const getItemRecursive = (item) => {
    const newItem = Object.assign({}, item);
    if (newItem.items) {
      newItem.items = getItemListRecursive(newItem.items);
      if (!newItem.items || newItem.items?.length === 0) return {};
    }
    return newItem;
  };
  const getItemListRecursive = (items) => {
    const filterItems = items.filter(
      (item) => !item.accessPermission || AppStore.hasPermission(Object.values(item.accessPermission))
    );
    return filterItems.map((item) => getItemRecursive(item)).filter((item) => !!item.label);
  };
  return [{ items: getItemListRecursive(model[0].items) }];
};

export const objectToText = (obj = {}) => {
  let value = '';
  Object.keys(obj).forEach((key) => {
    value += `${key}s/e/p/p${obj[key]};`;
  });
  return value;
};

export const textToObject = (text = '') => {
  const obj = {};
  const splitted = text.split(';');
  splitted.forEach((elem) => {
    const innerSplit = elem.split('s/e/p/p');
    obj[innerSplit[0]] = innerSplit[1];
  });
  return obj;
};

export const getDescendantProp = (obj, desc) => {
  var arr = desc.split('.');
  while (arr.length && (obj = obj[arr.shift()]));
  return obj;
};

export const checkIfValidUUID = (str) => {
  const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  return regexExp.test(str);
};

export const isValueValid = (value) => {
  return value !== undefined && value !== null && value !== '';
};

export const hashCodePath = () => {
  const value = window.location?.getCurrentPath && window.location?.getCurrentPath();
  let hash = 0,
    i = 0,
    len = value?.length || 0;
  while (i < len) {
    hash = ((hash << 5) - hash + value.charCodeAt(i++)) << 0;
  }
  return hash + 2147483647 + 1;
};

export const getStringOfChildrenIfExist = (children, defaultValue = '') => {
  if (typeof children === 'string') {
    return children.toString().toLowerCase();
  } else if (children && Array.isArray(children)) {
    const strFound = children.find((child) => typeof child === 'string');
    if (strFound) return strFound.toString().toLowerCase();
  } else return defaultValue;
};

export const getRoutesObjects = (object) => {
  const routes = [];
  const getRoutesObjectsRecursive = (object) => {
    const keys = Object.keys(object);
    keys.forEach((key) => {
      const value = object[key];
      if (typeof value === 'string') {
        routes.push(value);
        return;
      }
      getRoutesObjectsRecursive(value);
    });
  };
  getRoutesObjectsRecursive(object);
  return routes.map((item) => {
    const obj = { path: item, exact: true };
    return obj;
  });
};

export const isEntidadeLiconAntigo = (dataCadastro) => {
  return dataCadastro && moment(dataCadastro) < moment('20240207', 'YYYYMMDD');
};

export const getFirstAndLastName = (name) => {
  const fullName = name.split(' ');
  return (fullName.shift() + (fullName && fullName.length ? ' ' + fullName.pop() : '')).toUpperCase();
};

export const getQtdDaysFromToday = (date) => {
  const dateMoment = moment(date) - moment();

  //Conversão de milissegundos para dias com arredondamento para cima
  return Math.ceil(dateMoment / 1000 / 60 / 60 / 24);
};

export const getQuantidadeItens = (lista, itens = 'itens', quantidade = 'quantidade') => {
  return lista
    ?.map((elem) => {
      return (
        elem[itens] &&
        elem[itens]
          .map((item) => {
            if (item[quantidade]) return item[quantidade];
          })
          .reduce((a, b) => a + b, 0)
      );
    })
    .reduce((a, b) => a + b, 0);
};

export const treatDescription = (material, description) => {
  const mat = material.replace(/\s+/g, ' ').trim();
  const desc = description.replace(/\s+/g, ' ').trim();
  const matNoPonctuation = mat.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
  const descNoPonctuation = desc.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');

  if (desc.includes(mat) || descNoPonctuation.includes(matNoPonctuation)) {
    return desc;
  }

  return mat + ' ' + desc;
};

export const checkUserGroup = (group) => {
  const userGroups = AppStore.getData('userGroups')?.map((group) => group.nome);
  return userGroups?.some((userGroup) => group.includes(userGroup));
};

export const formatList = (list, columns) => {
  return list.map((object) => {
    const obj = {};
    columns.forEach((column) => {
      const field = column.field;
      if (field) {
        const value = field.includes('.') ? getDescendantProp(object, field) : object[field];
        if (column.simpleBody) obj[field] = column.simpleBody(object);
        else if (column.body) obj[field] = column.body(object);
        else obj[field] = checkBoolean(value);
      }
    });
    return obj;
  });
};

export const checkBoolean = (value) => {
  if (typeof value === 'boolean') {
    if (value) return 'Sim';
    else return 'Não';
  } else return value;
};

export const getCleanTextFromHtml = (html) => {
  const strippedHtml = html.replace(/<(?:[^>"']+|"[^"]*"|'[^']*')*?>/g, '');
  const cleanedText = strippedHtml.replace(/\s+/g, ' ').trim();
  return cleanedText;
};

export const insertIntoText = (text, value, index) => {
  return text.slice(0, index) + value + text.slice(index);
};

export const getLightenColor = (hex, amount) => {
  hex = hex.replace('#', '');

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const r_light = Math.round(Math.min(255, r + 255 * amount));
  const g_light = Math.round(Math.min(255, g + 255 * amount));
  const b_light = Math.round(Math.min(255, b + 255 * amount));

  const hex_light =
    '#' +
    r_light.toString(16).padStart(2, '0') +
    g_light.toString(16).padStart(2, '0') +
    b_light.toString(16).padStart(2, '0');

  return hex_light;
};

export const hasPermissionProxy = (permissions) => {
  const resourcePermissions = Array.isArray(permissions) ? permissions : [permissions];
  if (AppStore.hasPermission(resourcePermissions)) {
    return true;
  }

  return false;
};

export const isDesktop = () => {
  return window.innerWidth > 1024;
};

export const generateFullURL = (partialRoute) => getOriginUrl() + '/#' + partialRoute;

export const checkUserContextIsAttributor = () => {
  const user = AppStore.getData('userDetails');
  return user.atribuidor === 'true';
};

export const checkuserContextIsAuditor = () => {
  const userGroups = AppStore.getData('userGroups').map((group) => group.nome);
  return userGroups.some((userGroup) => 'Auditor'.includes(userGroup));
};

export const formatDate = (data) => {
  if (data) {
    const year = data.substring(0, 4);
    const month = data.substring(4, 6);
    const date = new Date(Date.UTC(year, month, 1));
    const options = { year: 'numeric', month: 'long' };
    const formattedDate = date.toLocaleDateString('pt-BR', options);
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  } else {
    return '-';
  }
};

export const getPrecoByFonte = (caracteristica, fonte) => {
  if (fonte == 'sinapi') {
    return isValueValid(caracteristica.precoMediano) ? caracteristica.precoMediano : 0;
  } else {
    if (isValueValid(caracteristica.custo)) {
      return parseFloat(caracteristica.custo);
    } else if (isValueValid(caracteristica.custoProdutivo)) {
      return parseFloat(caracteristica.custoProdutivo);
    } else if (isValueValid(caracteristica.preco)) {
      return parseFloat(caracteristica.preco);
    } else if (isValueValid(caracteristica.custo)) {
      return parseFloat(caracteristica.custo);
    } else {
      return 0;
    }
  }
};

export const getAttrValue = (value, attr) => {
  let result = value;
  attr?.split('.').forEach((key) => {
    result = result ? result[key] : null;
  });
  return result;
};

export const getSumFromRawData = (data, propertyKey) => {
  const soma = data.reduce((acumulador, objeto) => {
    const valor = parseFloat(propertyKey ? getAttrValue(objeto, propertyKey) : objeto);
    return isValueValid(valor) && !isNaN(valor) ? acumulador + valor : acumulador;
  }, 0);

  return soma;
};

export const getAVGFromRawData = (data, propertyKey) => {
  const { soma, contador } = data.reduce(
    (acumulador, objeto) => {
      const valor = propertyKey ? getAttrValue(objeto, propertyKey) : objeto;

      if (isValueValid(valor) && !isNaN(valor)) {
        acumulador.soma += parseFloat(valor);
        acumulador.contador++;
      }
      return acumulador;
    },
    { soma: 0, contador: 0 }
  );

  if (contador === 0) {
    return 0;
  }

  return soma / contador;
};

export const getPercent = (valor, total) => {
  const percentual = (valor / total) * 100;
  return Math.round(percentual * 100) / 100;
};
