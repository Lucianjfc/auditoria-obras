import { ServiceBase } from '~/services/ServiceBase';
import ApiEndpoints from '~/constants/ApiEndpoints';
import axios from 'axios';

class RelatorioObraService extends ServiceBase {
  constructor() {
    super(ApiEndpoints.relatorioObra);
  }

  upload(file) {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${this.baseUrl}/${this.endpoint}/upload`, formData);
  }

  download(fileDTO) {
    let params = `lookupId=${fileDTO.lookupId}&nomeOriginal=${fileDTO.nomeOriginal}&tipoArquivo=${fileDTO.tipoArquivo}`;
    return axios.get(`${this.baseUrl}/${this.endpoint}/download?${params}`, { responseType: 'blob' });
  }

  removerArquivo(idRelatorioObra, idArquivo) {
    return axios.delete(`${this.baseUrl}/${this.endpoint}/${idRelatorioObra}/arquivos/${idArquivo}`);
  }

  recuperarArquivos(idRelatorioObra) {
    return axios.get(`${this.baseUrl}/${this.endpoint}/${idRelatorioObra}/arquivos`);
  }

  atualizarArquivo(idRelatorioObra, idArquivo, arquivoRelatorioObraDTO) {
    return axios.put(
      `${this.baseUrl}/${this.endpoint}/${idRelatorioObra}/arquivos/${idArquivo}`,
      arquivoRelatorioObraDTO
    );
  }

  importarRelatorioObra(relatorioObraDTO) {
    return axios.post(`${this.baseUrl}/${this.endpoint}/importar-relatorio`, relatorioObraDTO);
  }
}

const instance = new RelatorioObraService();

export default instance;
