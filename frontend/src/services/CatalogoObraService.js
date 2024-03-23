import axios from 'axios';
import { ServiceBase } from '~/services/ServiceBase';
import ApiEndpoints from '~/constants/ApiEndpoints';

class CatalogoObraService extends ServiceBase {
  constructor() {
    super(ApiEndpoints.catalogoObra);
  }

  searchSinapi(options = {}) {
    const defaultValues = {
      page: { index: 1, size: 10 },
      search: '',
    };
    Object.assign(defaultValues, options);
    return axios.post(`${this.baseUrl}/${this.endpoint}/elastic-search-sinapi`, defaultValues);
  }

  searchSicro(options = {}) {
    const defaultValues = {
      page: { index: 1, size: 10 },
      search: '',
    };
    Object.assign(defaultValues, options);
    return axios.post(`${this.baseUrl}/${this.endpoint}/elastic-search-sicro`, defaultValues);
  }

  searchSicroByCodigo(codigo) {
    return axios.get(`${this.baseUrl}/${this.endpoint}/elastic-search-sicro/${codigo}`);
  }

  searchSinapiByCodigo(codigo) {
    return axios.get(`${this.baseUrl}/${this.endpoint}/elastic-search-sinapi/${codigo}`);
  }
}

const instance = new CatalogoObraService();

export default instance;
