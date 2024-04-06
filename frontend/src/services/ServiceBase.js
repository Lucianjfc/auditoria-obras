import axios from 'axios';
import { buildRequestParams, showNotification } from '../utils/utils';

export class ServiceBase {
  baseUrl = window._env_.REACT_APP_API_URL;
  endpoint;

  constructor(endpoint) {
    this.endpoint = endpoint;
    console.log(window._env_);
  }

  get(options = {}) {
    const requestParams = buildRequestParams(options);
    return axios.get(`${this.baseUrl}/${this.endpoint}${requestParams}`);
  }

  getAll() {
    return axios.get(`${this.baseUrl}/${this.endpoint}/all`);
  }

  getAllSort(options = {}) {
    const requestParams = buildRequestParams(options);
    return axios.get(`${this.baseUrl}/${this.endpoint}/allSort${requestParams}`);
  }

  advancedSearch(options = {}) {
    const defaultValues = {
      page: { index: 1, size: 10 },
      andParameters: [],
      orParameters: [],
    };
    Object.assign(defaultValues, options);
    return axios.post(`${this.baseUrl}/${this.endpoint}/advanced-search`, defaultValues);
  }

  advancedSearchAll(options = {}) {
    const defaultValues = {
      andParameters: [],
      orParameters: [],
    };
    Object.assign(defaultValues, options);
    return axios.post(`${this.baseUrl}/${this.endpoint}/advanced-search-all`, defaultValues);
  }

  getById(id) {
    return axios.get(`${this.baseUrl}/${this.endpoint}/${id}`);
  }

  save(object, type = 'edit', id = null) {
    if (type === 'edit') {
      if (!id) {
        showNotification('error', null, 'Identificador inválido encontrado ao salvar alterações.');
      }
      return this.update(object, id);
    } else {
      return this.create(object);
    }
  }

  update(object, id) {
    return axios.patch(`${this.baseUrl}/${this.endpoint}/${id}`, object);
  }

  create(object) {
    return axios.post(`${this.baseUrl}/${this.endpoint}`, object);
  }

  delete(id) {
    return axios.delete(`${this.baseUrl}/${this.endpoint}/${id}`);
  }

  getUltimaAlteracao(id) {
    return axios.get(`${this.baseUrl}/${this.endpoint}/${id}/ultima-alteracao`);
  }
}
