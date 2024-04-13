import React from 'react';
import { observer } from 'mobx-react';
import FcButton from '~/components/FcButton';
import GenericIndexPage from '~/pages/GenericIndexPage';
import DadosEstaticosService from '../../services/DadosEstaticosService';
import { getValueDate } from '~/utils/utils';
import AdvancedSearch from '~/components/AdvancedSearch';
import { Dialog } from 'primereact/dialog';
import FormField from '~/components/FormField';
import { InputText } from 'primereact/inputtext';
import { DATE_FORMAT_WITH_HOURS, DATE_PARSE_FORMAT_WITH_HOURS } from '~/utils/date';
import MultipleFileUploader from '~/components/MultipleFileUploader';
import FcCloseableTabView from '~/components/FcCloseableTabView';
import CatalogoObraIndexStore from '~/stores/catalogoObra/indexStore';
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import Precos from './abas/components/precos/precos';
import ItemDetail from './abas/components/itemDetail/itemDetail';
import { PrimeIcons } from 'primereact/api';
import UrlRouter from '~/constants/UrlRouter';

@observer
class RelatorioObraIndexPage extends GenericIndexPage {
  constructor(props) {
    super(props);
    this.store = new CatalogoObraIndexStore();
    this.state = {
      idRemove: null,
      visibiliyDialogImport: false,
      activeTabIndex: 0,
      dialogVisibility: false,
      selectedItem: undefined,
      fonte: undefined,
    };
  }

  renderFooter() {
    return (
      <FcButton
        label="Voltar"
        icon="pi pi-times"
        onClick={() => this.switchVisibility()}
        className="p-button-outlined p-button-brand-light"
      />
    );
  }
  renderDialog() {
    const mesColeta =
      this.state.selectedItem?.caracteristicasDesonerado[this.state.selectedItem?.caracteristicasDesonerado.length - 1]
        ?.mesColeta;

    return (
      <Dialog
        header={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <i
              className="pi pi-list"
              style={{
                color: '#326FD1',
                background: '#F5F9FF',
                borderRadius: '50%',
                padding: '13px',
                fontSize: '18px',
              }}
            />
            <div style={{ marginLeft: '10px' }}>
              <h2
                style={{
                  fontSize: '15px',
                  marginBottom: '0',
                  fontWeight: 'normal',
                  color: '#212121',
                }}
              >
                Detalhes do Item
              </h2>
            </div>
          </div>
        }
        visible={this.state.dialogVisibility}
        style={{ width: '50vw' }}
        footer={this.renderFooter()}
        onHide={() => this.switchVisibility()}
      >
        <div>
          <ItemDetail item={this.state.selectedItem} mesColeta={mesColeta} desonerado={false} />
          <div className="p-col-12">
            <Precos
              title={(this.state.fonte ?? 'sinapi') == 'sinapi' ? 'SINAPI - Curva de preço' : 'SICRO - Curva de Preço'}
              desonerado
              precosDesonerados={this.state.selectedItem?.caracteristicasDesonerado}
              precosNaoDesonerados={this.state.selectedItem?.caracteristicasNaoDesonerado}
              fonte={this.state.fonte ?? 'sinapi'}
            />
          </div>
        </div>
      </Dialog>
    );
  }

  onPage(event, filter) {
    console.log(filter);
    const page = (event.page ?? 0) + 1;
    let pagination = {};
    if (filter === 'sinapi') {
      pagination = JSON.parse(JSON.stringify(this.store.paginationSinapi));
    } else if (filter === 'sicro') {
      pagination = JSON.parse(JSON.stringify(this.store.paginationSicro));
    } else {
      pagination = JSON.parse(JSON.stringify(this.store.pagination));
    }
    pagination.page.index = page;
    this.store.setPagination(pagination, filter);
    this.store.load(pagination, filter);
  }

  getFirstFromPagination(filter) {
    let page = {};
    if (filter === 'sinapi') {
      page = this.store.paginationSinapi.page;
    } else if (filter === 'sicro') {
      page = this.store.paginationSicro.page;
    } else {
      page = this.store.pagination.page;
    }
    const { index, size } = page;
    return size * (index - 1);
  }

  getDefaultTableProps() {
    return {
      dataKey: 'id',
      className: 'datatable-responsive',
      paginator: true,
      lazy: true,
      rows: 10,
      emptyMessage: 'Nenhum dado encontrado.',
      resizableColumns: true,
      columnResizeMode: 'fit',
      paginatorTemplate: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport',
      currentPageReportTemplate: '{first} - {last} de {totalRecords} registros',
      onPage: this.onPage,
      first: this.getFirstFromPagination(),
      totalRecords: this.store.pagination.total ?? 0,
    };
  }

  _renderDescricao(row) {
    return (
      <div className="flex align-items-center">
        <div style={{ minWidth: '30%' }}>
          <div style={{ fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>{row.descricao ?? ''}</div>
          <div
            className="flex flex-wrap align-items-center mt-2 gap-2"
            style={{ color: '#9E9E9E', whiteSpace: 'nowrap' }}
          >
            <div>
              <Tag value={`Código: ${row?.codigo}`} rounded style={{ backgroundColor: '#3b82f6' }} />
            </div>
            {row?.caracteristicasNaoDesonerado?.length && (
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <Tag
                  value={`Unidade: ${row?.caracteristicasNaoDesonerado[0]?.unidadeMedida}`}
                  rounded
                  style={{ backgroundColor: '#f59e0b' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  switchVisibility() {
    this.setState({
      dialogVisibility: !this.state.dialogVisibility,
    });
  }

  renderTabs() {
    const header = (
      <div className="table-header">
        <FcButton
          className="p-button"
          label="Relatórios"
          style={{ marginBottom: '5px', marginRight: '5px' }}
          icon={PrimeIcons.PLUS}
          onClick={() => this.pushUrlToHistory(UrlRouter.auditoria.relatorioObra.listagem)}
        />
      </div>
    );

    const { loading } = this.store;

    const columnsSinapi = [
      {
        body: (row) => this._renderDescricao(row),
      },
      {
        style: { width: '50px', textAlign: 'right' },
        body: (row) => (
          <FcButton
            className="p-button-outlined p-button-rounded"
            label="Visualizar"
            type="button"
            onClick={() => {
              this.switchVisibility();
              this.setState({ selectedItem: row, fonte: 'sinapi' });
            }}
          />
        ),
      },
    ];

    const columnsSicro = [
      {
        body: (row) => this._renderDescricao(row),
      },
      {
        style: { width: '50px', textAlign: 'right' },
        body: (row) => (
          <FcButton
            className="p-button-outlined p-button-rounded"
            label="Visualizar"
            type="button"
            onClick={() => {
              this.switchVisibility();
              this.setState({ selectedItem: row, fonte: 'sicro' });
            }}
          />
        ),
      },
    ];

    const tabs = [];
    if (this.store.listSinapi?.length > 0) {
      tabs.push({
        id: 0,
        header: 'SINAPI',
        content: (
          <DataTable
            header={header}
            rowHover
            responsiveLayout="scroll"
            tabIndex={'key'}
            value={this.store.listSinapi}
            {...this.getDefaultTableProps()}
            className="p-datatable-sm materiais-table p-2"
            totalRecords={this.store.paginationSinapi.total ?? 0}
            loading={loading}
            style={{ border: '1px #E0E0E0 solid', borderRadius: '10px' }}
            emptyMessage="Nenhum item encontrado"
            onSort={(e) => this.onSort(e, 'sinapi')}
            onPage={(e) => this.onPage(e, 'sinapi')}
            first={this.getFirstFromPagination('sinapi')}
          >
            {this.renderColumns(columnsSinapi)}
          </DataTable>
        ),
      });
    }
    if (this.store.listSicro?.length > 0) {
      tabs.push({
        id: 1,
        header: 'SICRO',
        content: (
          <DataTable
            header={header}
            rowHover
            responsiveLayout="scroll"
            tabIndex={'key'}
            value={this.store.listSicro}
            {...this.getDefaultTableProps()}
            className="p-datatable-sm materiais-table p-2"
            totalRecords={this.store.paginationSicro.total ?? 0}
            loading={loading}
            style={{ border: '1px #E0E0E0 solid', borderRadius: '10px' }}
            emptyMessage="Nenhum item encontrado"
            onSort={(e) => this.onSort(e, 'sicro')}
            onPage={(e) => this.onPage(e, 'sicro')}
            first={this.getFirstFromPagination('sicro')}
          >
            {this.renderColumns(columnsSicro)}
          </DataTable>
        ),
      });
    }
    let content = <></>;
    content = (
      <div className="p-col-12 relative">
        <FcCloseableTabView
          tabs={tabs}
          activeTabIndex={this.state.activeTabIndex}
          onChangeTab={(tab) => this.setState({ activeTabIndex: tab.id })}
        />
      </div>
    );
    return content;
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
        style={{ width: '50vw' }}
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
          <FormField columns={6} label="Título">
            <InputText
              placeholder="Digite o título do relatório"
              value={this.store.newRelatorio.titulo}
              onChange={(e) => this.store.updateAttribute('titulo', e)}
            />
          </FormField>
          <div className="p-col-12">
            <MultipleFileUploader
              store={this.store.fileStore}
              tableColumns={columnsArquivo}
              onChangeFiles={(files) => this.store.setArquivos(files)}
              fileTypes={DadosEstaticosService.getTipoArquivoTermoReferencia()}
              accept=".xlsx"
            />
          </div>
        </div>
      </Dialog>
    );
  }

  render() {
    return (
      <div className="h-full">
        <div className="flex justify-content-center flex-wrap mt-4">
          <AdvancedSearch
            style={{ width: '50%' }}
            searchParams={this.store.getAdvancedSearchParams()}
            store={this.store}
            searchFields={['query']}
            elasticsearch
          />
        </div>
        {this.renderTabs()}
        {this.renderDialog()}
      </div>
    );
  }
}

RelatorioObraIndexPage.displayName = 'RelatorioObraIndexPage';

export default RelatorioObraIndexPage;
