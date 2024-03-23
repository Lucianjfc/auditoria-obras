import { ServiceBase } from '~/services/ServiceBase';
import ApiEndpoints from '../constants/ApiEndpoints';
import axios from 'axios';

class ObrigatoriedadeArquivoService extends ServiceBase {
  constructor() {
    super(ApiEndpoints.obrigatoriedadeArquivo);
  }

  getArquivosObrigatorios(arquivosObrigatoriosDTO) {
    return axios.post(`${this.baseUrl}/${this.endpoint}/arquivos-obrigatorios`, arquivosObrigatoriosDTO);
  }
}

const instance = new ObrigatoriedadeArquivoService();

export default instance;
