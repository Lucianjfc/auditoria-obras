import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import moment from 'moment';
import { DATE_PARSE_FORMAT, DATE_PARSE_FORMAT_WITH_HOURS } from '../utils/date';
import { extractRules } from '../utils/formRules';
import {
  showErrorNotification,
  showNotification,
  isEntidadeLiconAntigo as isEntidadeLiconAntigoUtils,
} from '../utils/utils';

class FormBase {
  service;
  domain;
  loadedObject = {};
  @observable isConfirmDialogVisible = false;
  @observable object;
  @observable loading = false;
  @observable ultimaAlteracao;

  constructor(service, domain) {
    this.service = service;
    this.domain = domain;

    this.updateAttribute = this.updateAttribute.bind(this);
    this.updateAttributeDate = this.updateAttributeDate.bind(this);
    this.updateAttributeCheckbox = this.updateAttributeCheckbox.bind(this);
    this.getObjectToSave = this.getObjectToSave.bind(this);
    this.updateAttributeDateWithHours = this.updateAttributeDateWithHours.bind(this);
    this.validateSubmittedFiles = this.validateSubmittedFiles.bind(this);
    this.getRule = this.getRule.bind(this);

    makeObservable(this);
  }

  @action
  toggleShowConfirmDialog() {
    this.isConfirmDialogVisible = !this.isConfirmDialogVisible;
  }

  @action
  initialize(id, defaultValues = {}, callback) {
    if (!id) {
      this.object = Object.assign({}, defaultValues);
    } else {
      this.loading = true;
      this.service
        .getById(id)
        .then((response) =>
          runInAction(() => {
            this.object = response.data;
            this.loadedObject = response.data;
            callback && callback();
          })
        )
        .catch((error) =>
          runInAction(() => {
            showErrorNotification(error);
          })
        )
        .finally(() =>
          runInAction(() => {
            this.loading = false;
          })
        );
    }
  }

  @action
  carregaUltimaAlteracao(id) {
    if (id) {
      this.service
        .getUltimaAlteracao(id)
        .then(({ data }) =>
          runInAction(() => {
            this.ultimaAlteracao = data;
          })
        )
        .catch((error) => showErrorNotification(error));
    }
  }

  @action
  updateAttribute(attribute, event) {
    let value = event;
    if (event && event.value) {
      value = event.value;
    }
    if (event && event.target) {
      value = event.target.value;
    }
    this.object[attribute] = value;
  }

  @action
  updateAttributeCheckbox(attribute, e) {
    this.object[attribute] = e.checked;
  }

  @action
  updateAttributeDate(attribute, e) {
    let value = e;
    if (e && e.target) {
      value = e.target.value;
    }
    this.object[attribute] = value ? moment(value).format(DATE_PARSE_FORMAT) : value;
  }

  @action
  updateAttributeDateWithHours(attribute, e) {
    let value = e;
    if (e && e.target) {
      value = e.target.value;
    }
    this.object[attribute] = value ? moment(value).format(DATE_PARSE_FORMAT_WITH_HOURS) : value;
  }

  mergeRules(rulesA, rulesB) {
    let rules = rulesA;
    if (rulesB) {
      Object.keys(rulesB).forEach((k) => {
        if (rules[k]) {
          rules[k] = [...rules[k], ...rulesB[k]];
        } else {
          rules[k] = rulesB[k];
        }
      });
    }

    return rules;
  }

  isEntidadeLiconAntigo(dataCadastro = this.object.dataCadastro) {
    return isEntidadeLiconAntigoUtils(dataCadastro);
  }

  getObjectToSave(actionType) {
    const { object, loadedObject } = this;
    if (actionType === 'edit') {
      const objToSave = {};
      this.domain.getDomainAttributes().forEach((key) => {
        if (object[key] !== loadedObject[key]) {
          objToSave[key] = object[key];
        }
      });
      return objToSave;
    } else {
      return object;
    }
  }

  @action
  save(callback, type = 'edit') {
    const saveObject = this.getObjectToSave(type);
    if (Object.keys(saveObject).length === 0) {
      showNotification('warn', null, 'Nenhuma alteração realizada.');
    } else {
      this.loading = true;
      this.service
        .save(this.object, type, this.object.id)
        .then(() => {
          callback && callback();
          showNotification('success', null, 'Registro salvo com sucesso!');
        })
        .catch((error) => showErrorNotification(error))
        .finally(() =>
          runInAction(() => {
            this.loading = false;
          })
        );
    }
  }

  rulesDefinition() {
    console.warn('Subscribe the rulesDefinition function.');
    return {};
  }

  @computed
  get rules() {
    const definition = this.rulesDefinition();
    const result = extractRules(definition, this.object);
    Object.keys(result).forEach((key) => {
      const error = result[key].error;
      if (error) {
        result.hasError = true;
      }
    });
    return result;
  }

  getRule(field) {
    return this.rules[field] ? this.rules[field] : {};
  }

  validateSubmittedFiles(files, showNotificationToUser = true) {
    let returnValue = true;
    files?.forEach((file) => {
      if (!file.tipo) returnValue = false;
    });
    if (!returnValue && showNotificationToUser) showNotification('error', null, 'O tipo dos arquivos é obrigatório');
    return returnValue;
  }
}

export default FormBase;
