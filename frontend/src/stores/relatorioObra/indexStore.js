import SearchTypes from '~/components/AdvancedSearch/SearchTypes';
import RelatorioObra from '~/domains/RelatorioObra';
import RelatorioObraService from '../../services/RelatorioObraService';
import IndexBase from '~/stores/IndexBase';
import { action, observable, runInAction } from 'mobx';
import MultipleFileUploaderStore from '~/stores/MultipleFileUploaderStore';
import DadosEstaticosService from '~/services/DadosEstaticosService';
import { showErrorNotification, showNotification } from '~/utils/utils';
import ObrigatoriedadeArquivoService from '~/services/ObrigatoriedadeArquivoService';

class RelatorioObraIndexStore extends IndexBase {
  @observable newRelatorio = new RelatorioObra();
  @observable arquivos = [];

  constructor() {
    super(RelatorioObraService, RelatorioObra, 'id');
    this.fileStore = new MultipleFileUploaderStore(
      [],
      (file) => RelatorioObraService.upload(file),
      (fileDTO) => RelatorioObraService.download(fileDTO),
      (idArquivo) => RelatorioObraService.removerArquivo(idArquivo),
      (idArquivo, arquivoRelatorioObraDTO) => RelatorioObraService.atualizarArquivo(idArquivo, arquivoRelatorioObraDTO)
    );
  }

  @action
  setArquivos(arquivos) {
    this.arquivos = arquivos;
  }

  @action
  carregarArquivosObrigatorios() {
    ObrigatoriedadeArquivoService.getArquivosObrigatorios({
      tipoProcesso: 'RELATORIO_OBRA',
      filtros: ['RELATORIO_OBRA'],
    })
      .then((response) =>
        runInAction(() => {
          const arquivosObrigatorios = response?.data ?? [];
          this.fileStore.tipoArquivoEnum = arquivosObrigatorios.map((arqObg) => {
            const arq = DadosEstaticosService.getTipoArquivoRelatorioObra().find(
              (arq) => arq.value === arqObg.arquivoEnum
            );
            return { ...arqObg, text: arqObg.obrigatorio ? '* ' + arqObg.arquivo : arqObg.arquivo, value: arq.value };
          });
        })
      )
      .catch((error) =>
        runInAction(() => {
          showErrorNotification(error);
        })
      );
  }

  @action
  initializeNewRelatoro() {
    this.newRelatorio = new RelatorioObra();
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
    this.newRelatorio[attribute] = value;
  }

  @action
  importarRelatorioObra(callback) {
    const relatorioObraDTO = {
      arquivos: this.arquivos,
      relatorioObra: this.newRelatorio,
    };

    RelatorioObraService.importarRelatorioObra(relatorioObraDTO)
      .then(() =>
        runInAction(() => {
          callback && callback();
          showNotification('success', null, 'Relatório importado com sucesso!');
        })
      )
      .catch((error) =>
        runInAction(() => {
          showErrorNotification(error);
        })
      );
  }

  getFilterSuggestLicitacao() {
    const filterSuggestLicitacao = [];
    return filterSuggestLicitacao;
  }

  getAdvancedSearchParams() {
    return [
      {
        field: 'titulo',
        label: 'Título',
        type: SearchTypes.TEXT,
      },
      {
        field: 'dataAnalise',
        label: 'Data Analise',
        type: SearchTypes.DATE_TIME,
      },
    ];
  }
}

export default RelatorioObraIndexStore;
