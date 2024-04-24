import React from 'react';
import { observer } from 'mobx-react';
import IndexDataTable from '~/components/IndexDataTable';
import FcButton from '~/components/FcButton';
import { PrimeIcons } from 'primereact/api';
import UrlRouter from '../../constants/UrlRouter';
import GenericIndexPage from '~/pages/GenericIndexPage';
import DadosEstaticosService from '../../services/DadosEstaticosService';
import { getValueDate, getValueMoney } from '~/utils/utils';
import AdvancedSearch from '~/components/AdvancedSearch';
import RelatorioObraIndexStore from '~/stores/relatorioObra/indexStore';
import { Dialog } from 'primereact/dialog';
import FormField from '~/components/FormField';
import { InputText } from 'primereact/inputtext';
import { DATE_FORMAT_WITH_HOURS, DATE_PARSE_FORMAT_WITH_HOURS } from '~/utils/date';
import MultipleFileUploader from '~/components/MultipleFileUploader';
import AppBreadCrumb from '~/components/AppBreadCrumb';
import InputMonetary from '~/components/InputMonetary';

@observer
class ListagemRelatoriosIndexPage extends GenericIndexPage {
  constructor(props) {
    super(props);
    this.store = new RelatorioObraIndexStore();
    this.state = {
      idRemove: null,
      visibiliyDialogImport: false,
    };
  }

  componentDidMount() {
    this.store.carregarArquivosObrigatorios();
  }

  _renderDialog() {
    const columnsArquivo = [
      {
        style: { width: '30%' },
        field: 'arquivo',
        header: 'Arquivo',
      },
      {
        field: 'tipo',
        header: (
          <div>
            Tipo <span className="p-error"> *</span>
          </div>
        ),
      },
      {
        style: { width: '25%' },
        field: 'descricao',
        header: 'Descrição',
      },
      {
        style: { width: '155px' },
        field: 'dataEnvio',
        header: 'Data de Envio',
        body: ({ dataEnvio }) => getValueDate(dataEnvio, DATE_FORMAT_WITH_HOURS, DATE_PARSE_FORMAT_WITH_HOURS),
        editor: ({ value }) => getValueDate(value, DATE_FORMAT_WITH_HOURS, DATE_PARSE_FORMAT_WITH_HOURS),
      },
    ];

    return (
      <Dialog
        header="Importa Relatório"
        visible={this.state.visibiliyDialogImport}
        style={{ width: '70vw' }}
        onHide={() => this.setState({ visibiliyDialogImport: false })}
        footer={
          <div className="p-mt-2">
            <span className="p-mr-1 p-d-inline p-d-flex align-items-center">
              <FcButton
                label="Cancelar"
                type="button"
                className="p-ml-auto p-button-secondary p-mr-2"
                onClick={() => this.setState({ visibiliyDialogImport: false })}
                loading={this.store.loading}
              />
              <FcButton
                label="Importar"
                onClick={() =>
                  this.store.importarRelatorioObra(() => {
                    this.setState({ visibiliyDialogImport: false });
                  })
                }
                loading={this.store.loading}
              />
            </span>
          </div>
        }
      >
        <div className="p-fluid p-formgrid p-grid">
          <FormField columns={12} label="Autor">
            <InputText
              placeholder="Informe o seu nome"
              value={this.store.newRelatorio.autor}
              onChange={(e) => this.store.updateAttribute('autor', e)}
            />
          </FormField>
          <FormField columns={6} label="Título">
            <InputText
              placeholder="Digite o título do relatório"
              value={this.store.newRelatorio.titulo}
              onChange={(e) => this.store.updateAttribute('titulo', e)}
            />
          </FormField>
          <FormField columns={6} label="Valor da Licitação">
            <InputMonetary
              onChange={(e) => this.store.updateAttribute('valorLicitacao', e)}
              value={this.store.newRelatorio.valorLicitacao}
              placeholder="Informe o valor da licitação"
            />
          </FormField>
          <div className="p-col-12">
            <MultipleFileUploader
              store={this.store.fileStore}
              tableColumns={columnsArquivo}
              onChangeFiles={(files) => this.store.setArquivos(files)}
              fileTypes={DadosEstaticosService.getTipoArquivoRelatorioObra()}
              accept=".xlsx"
            />
          </div>
        </div>
      </Dialog>
    );
  }

  render() {
    const columns = [
      {
        field: 'titulo',
        header: 'Título',
        sortable: true,
      },
      {
        field: 'autor',
        header: 'Autor',
        sortable: true,
      },
      {
        field: 'valorLicitacao',
        header: 'Valor da Licitação',
        sortable: true,
        body: ({ valorLicitacao }) => getValueMoney(valorLicitacao),
      },
      {
        field: 'dataCadastro',
        header: 'Data de Cadastro',
        sortable: true,
        body: ({ dataCadastro }) => getValueDate(dataCadastro, DATE_FORMAT_WITH_HOURS, DATE_PARSE_FORMAT_WITH_HOURS),
      },
      {
        style: { width: '110px' },
        body: (rowData) => {
          return (
            <div className="actions p-d-flex p-jc-end">
              <FcButton
                icon="pi pi-pencil"
                className="p-button-sm p-button-success p-mr-2"
                onClick={() =>
                  this.pushUrlToHistory(UrlRouter.auditoria.relatorioObra.editar.replace(':id', rowData.id))
                }
              />
              <FcButton
                icon="pi pi-trash"
                className="p-button-sm p-button-danger"
                onClick={() => {
                  this.setState({ idRemove: rowData.id });
                  this.store.toggleShowConfirmDialog();
                }}
              />
            </div>
          );
        },
      },
    ];

    const header = (
      <div className="table-header">
        <FcButton
          className="p-button"
          label="Novo"
          style={{ marginBottom: '5px', marginRight: '5px' }}
          icon={PrimeIcons.PLUS}
          onClick={() => this.pushUrlToHistory(UrlRouter.auditoria.relatorioObra.novo)}
        />
        <FcButton
          className="p-button-secondary"
          label="Importar Relatório"
          style={{ marginBottom: '5px', marginRight: '5px' }}
          icon={PrimeIcons.FILE_EXCEL}
          onClick={() => this.setState({ visibiliyDialogImport: true })}
        />
      </div>
    );

    const { listKey, loading } = this.store;
    const { getDefaultTableProps } = this;

    const breacrumbItems = [{ label: 'Banco de Preços', url: UrlRouter.auditoria.relatorioObra.index }];

    return (
      <div>
        <div className="card page index-table">
          <AppBreadCrumb items={breacrumbItems} />
          <div className="flex justify-content-center flex-wrap mt-4">
            <AdvancedSearch
              style={{ width: '50%' }}
              searchParams={this.store.getAdvancedSearchParams()}
              store={this.store}
              searchFields={['nome']}
            />
          </div>
          <IndexDataTable
            setColumnsToExport={this.setColumnsToExport}
            columns={columns}
            value={listKey}
            header={header}
            loading={loading}
            {...getDefaultTableProps()}
          />
          {this.store.isConfirmDialogVisible && this.confirmRemove(this.state.idRemove)}
        </div>
        {this._renderDialog()}
      </div>
    );
  }
}

ListagemRelatoriosIndexPage.displayName = 'RelatorioObraIndexPage';

export default ListagemRelatoriosIndexPage;
