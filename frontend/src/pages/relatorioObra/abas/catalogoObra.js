import React from 'react';
import { observer } from 'mobx-react';
import FcButton from '~/components/FcButton';
import { DataTable } from 'primereact/datatable';
import AdvancedSearch from '~/components/AdvancedSearch';
import GenericIndexPage from '~/pages/GenericIndexPage';
import './Style.scss';
import FcCloseableTabView from '~/components/FcCloseableTabView';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import FormField from '~/components/FormField';
import InputMonetary from '~/components/InputMonetary';
import { formatDate, getValueMoney, showNotification } from '~/utils/utils';
import { Tag } from 'primereact/tag';
import ItemDetail from './components/itemDetail/itemDetail';
import Precos from './components/precos/precos';
import { Dropdown } from 'primereact/dropdown';
import { SelectButton } from 'primereact/selectbutton';
import CatalogoObraIndexStore from '~/stores/catalogoObra/indexStore';

@observer
class CatalogoObra extends GenericIndexPage {
  store;
  constructor(props) {
    super(props);
    this.storeRelatorio = this.props.store;
    this.store = new CatalogoObraIndexStore();
    this.state = {
      activeTabIndex: 0,
      dialogVisibility: false,
      selectedItem: undefined,
    };
  }

  switchVisibility() {
    this.setState({
      dialogVisibility: !this.state.dialogVisibility,
    });
  }

  updateAttribute(attribute, event) {
    this.storeRelatorio.updateAttributeItemObra(attribute, event);
    this.forceUpdate();
  }

  _renderValue(label, value, icon, col = 12) {
    return (
      <div className={`p-col-${col}`}>
        <div
          className="p-col-12 drawer-content-label"
          style={{ fontWeight: 'bold', color: '#9E9E9E', fontSize: '13px' }}
        >
          {label}
        </div>
        <div className="p-col-12">
          {icon && (
            <span className="icon" style={{ marginRight: '0.5rem' }}>
              {icon}
            </span>
          )}
          {value ?? '-'}
        </div>
      </div>
    );
  }

  renderFooter() {
    return (
      <div>
        <FcButton
          label="Cancelar"
          icon="pi pi-times"
          onClick={() => this.switchVisibility()}
          className="p-button-outlined p-button-brand-light"
        />
        <FcButton label="Confirmar" icon="pi pi-check" onClick={() => this.submitItem()} />
      </div>
    );
  }

  submitItem() {
    const execution = () => {
      if (!this.storeRelatorio.rulesItem.hasError) {
        this.storeRelatorio.onAddItem(() => this.forceUpdate());
        this.switchVisibility();
        this.setState({ submitted: false });
      } else {
        showNotification('error', null, 'Verifique os campos do formulário!');
      }
    };

    if (this.state.submitted) {
      execution();
    } else {
      this.setState({ submitted: true }, execution);
    }
  }

  renderDialog() {
    const { itemObra, getRuleItem } = this.storeRelatorio;

    const optionsDesonerado = [
      { value: true, text: 'Sim' },
      { value: false, text: 'Não' },
    ];

    const disableDesonerado = this.state.selectedItem?.caracteristicasDesonerado?.length == 0;
    const mesesColeta = itemObra?.desonerado
      ? this.state.selectedItem?.caracteristicasDesonerado?.map((i) => ({
          value: i.mesColeta,
          text: formatDate(i.mesColeta),
        }))
      : this.state.selectedItem?.caracteristicasNaoDesonerado?.map((i) => ({
          value: i.mesColeta,
          text: formatDate(i.mesColeta),
        }));

    const mesColeta = itemObra?.mesColeta
      ? itemObra?.mesColeta
      : itemObra?.desonerado
      ? this.state.selectedItem?.caracteristicasDesonerado[
          this.state.selectedItem?.caracteristicasDesonerado.length - 1
        ]?.mesColeta
      : this.state.selectedItem?.caracteristicasNaoDesonerado[
          this.state.selectedItem?.caracteristicasNaoDesonerado.length - 1
        ]?.mesColeta;

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
            <div style={{ marginLeft: '10px', marginTop: '10px' }}>
              <h2
                style={{
                  fontSize: '15px',
                  marginBottom: '0',
                  marginTop: '5px',
                  fontWeight: 'normal',
                  color: '#212121',
                }}
              >
                Adicionar Item
              </h2>
              <h2 style={{ fontSize: '12px', color: '#9E9E9E', marginTop: '0px', fontWeight: 'normal' }}>
                Detalhe o item para adicionar ao relatório
              </h2>
            </div>
          </div>
        }
        visible={this.state.dialogVisibility}
        style={{ width: '50vw' }}
        footer={this.renderFooter()}
        onHide={() => this.switchVisibility()}
      >
        <>
          <ItemDetail item={this.state.selectedItem} mesColeta={mesColeta} desonerado={itemObra?.desonerado} />
          <Divider />
          <div className="p-fluid p-formgrid p-grid">
            <FormField
              columns={6}
              attribute="mesColeta"
              label="Mês para comparação"
              infoTooltip="Mês da coleta"
              submitted={this.state.submitted}
            >
              <Dropdown
                onChange={(e) => {
                  this.updateAttribute('mesColeta', e);
                }}
                placeholder="Selecione um mês de coleta para ser comparado"
                value={mesColeta}
                id="nomeColuna"
                optionLabel="text"
                optionValue="value"
                options={mesesColeta}
                disabled={!this.state.selectedItem?.caracteristicasDesonerado > 0}
                emptyMessage="Nenhuma opção disponível"
              />
            </FormField>
            <FormField
              columns={6}
              attribute="desonerado"
              label={'Utilizar valor com desoneração'}
              submitted={this.state.submitted}
            >
              <SelectButton
                value={itemObra?.desonerado ?? false}
                options={optionsDesonerado}
                onChange={(e) => this.updateAttribute('desonerado', e)}
                optionLabel="text"
                optionValue="value"
                disabled={disableDesonerado}
              />
            </FormField>
            <FormField
              columns={6}
              attribute="quantidade"
              label={'Quantidade'}
              submitted={this.state.submitted}
              rule={getRuleItem('quantidade')}
            >
              <InputMonetary
                value={itemObra?.quantidade}
                onChange={(e) => this.updateAttribute('quantidade', e)}
                placeholder="Informe a quantidade"
              />
            </FormField>
            <FormField
              columns={6}
              attribute="precoUnitario"
              label="Valor Unitário"
              submitted={this.state.submitted}
              rule={getRuleItem('precoUnitario')}
            >
              <InputMonetary
                value={itemObra?.precoUnitario}
                placeholder="R$"
                onChange={(e) => this.updateAttribute('precoUnitario', e)}
                decimalPlaces={2}
              />
            </FormField>
          </div>
          <div className="p-grid">
            <div className="p-col-12">Valor Total Estimado</div>
            <div className="p-col-12" style={{ color: '#606EC1', fontWeight: 'bold' }}>
              {getValueMoney((itemObra?.precoUnitario ?? 0) * (itemObra?.quantidade ?? 0))}
            </div>
          </div>
          <div className="p-col-12">
            <Precos
              title={(itemObra?.fonte ?? 'sinapi') == 'sinapi' ? 'SINAPI - Curva de preço' : 'SICRO - Curva de Preço'}
              desonerado={itemObra?.desonerado}
              precosDesonerados={this.state.selectedItem?.caracteristicasDesonerado}
              precosNaoDesonerados={this.state.selectedItem?.caracteristicasNaoDesonerado}
              fonte={itemObra?.fonte ?? 'sinapi'}
            />
          </div>
        </>
      </Dialog>
    );
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
                  value={`Unidade: ${
                    row?.caracteristicasNaoDesonerado[row?.caracteristicasNaoDesonerado?.length - 1]?.unidadeMedida
                  }`}
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

  renderTabs() {
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
            label="Adicionar"
            type="button"
            onClick={() => {
              this.switchVisibility();
              this.setState({ selectedItem: row });
              const mesColeta =
                row?.caracteristicasDesonerado[row?.caracteristicasDesonerado.length - 1]?.mesColeta ??
                row?.caracteristicasNaoDesonerado[row?.caracteristicasNaoDesonerado.length - 1]?.mesColeta;
              this.storeRelatorio.setItemObra('new', row, 'sinapi', mesColeta);
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
            label="Adicionar"
            type="button"
            onClick={() => {
              this.switchVisibility();
              this.setState({ selectedItem: row });
              const mesColeta =
                row?.caracteristicasDesonerado[row?.caracteristicasDesonerado.length - 1]?.mesColeta ??
                row?.caracteristicasNaoDesonerado[row?.caracteristicasNaoDesonerado.length - 1]?.mesColeta;
              this.storeRelatorio.setItemObra('new', row, 'sicro', mesColeta);
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
      <div className="p-col-12 relative w-full">
        <div className="absolute" style={{ top: 0, right: 0, zIndex: 10 }}>
          <div className="relative">
            <span className="absolute badge-qtd-itens" style={{ backgroundColor: '#FF3D32', color: '#f1f5f9' }}>
              {this.storeRelatorio.itensObra.length ?? 0}
            </span>
            <FcButton
              icon="pi pi-list"
              onClick={this.props.onClickCarrinho}
              className="mr-2 p-button-rounded p-button-outlined ml-1 "
              type="button"
            />
          </div>
        </div>
        <FcCloseableTabView
          tabs={tabs}
          activeTabIndex={this.state.activeTabIndex}
          onChangeTab={(tab) => this.setState({ activeTabIndex: tab.id })}
        />
      </div>
    );
    return content;
  }

  render() {
    let content = <></>;
    if (this.store) {
      content = (
        <div className="grid">
          <div className="flex col-12 mt-2">
            <div className="flex justify-content-center flex-wrap mt-4 w-full">
              <AdvancedSearch
                searchParams={this.store.getAdvancedSearchParams()}
                store={this.store}
                searchFields={['query']}
                style={{ width: '50%' }}
                elasticsearch
              />
            </div>
          </div>
          {this.renderTabs()}
          {this.renderDialog()}
        </div>
      );
    }
    return content;
  }
}

export default CatalogoObra;
