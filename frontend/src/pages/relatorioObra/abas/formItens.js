import React from 'react';
import { observer } from 'mobx-react';
import { PropTypes } from 'prop-types';
import GenericIndexPage from '~/pages/GenericIndexPage';
import FcButton from '~/components/FcButton';
import { getNumberFractionDigits, getValue } from '~/utils/utils';
import { ConfirmDialog } from 'primereact/confirmdialog';
import Highlighter from 'react-highlight-words';
import { Tag } from 'primereact/tag';
import { Sidebar } from 'primereact/sidebar';
import CatalogoObra from './catalogoObra';
import ItemDetail from './components/itemDetail/itemDetail';
import { Accordion, AccordionTab } from 'primereact/accordion';
import Tooltip from '~/components/Tooltip';
@observer
class FormItens extends GenericIndexPage {
  store;
  constructor(props) {
    super(props);
    this.store = this.props.store;
    this.state = {
      itemRemove: null,
      isConfirmDialogRemoveItemVisible: false,
      dialogVisibility: false,
      submitted: false,
      visibleRight: false,
      seeAllFeatures: false,
    };

    this._renderRowDetails = this._renderRowDetails.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
  }

  handleAddItem(item) {
    this.store.onAddItem(item);
  }

  excluirItem() {
    return (
      <ConfirmDialog
        blockScroll
        visible={this.state.isConfirmDialogRemoveItemVisible}
        message="Você realmente deseja excluir o registro selecionado?"
        header="Excluir Registro"
        icon="pi pi-exclamation-triangle"
        acceptClassName="p-button-danger"
        accept={() => {
          this.store.deleteItemCatalogo(this.state.itemRemove);
          this.forceUpdate();
          this.setState({ isConfirmDialogRemoveItemVisible: false, itemRemove: null });
        }}
        onHide={() => this.setState({ isConfirmDialogRemoveItemVisible: false, itemRemove: null })}
      />
    );
  }

  excluirItens() {
    this.store.excluirItens();
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

  _renderRowDetails(row, name = 'card') {
    return (
      <div className={name}>
        <div className="p-grid ">
          <div className="p-col-12" style={{ fontSize: '18px', fontWeight: 'bold' }}>
            {getValue(row?.pdm?.nome)}
          </div>
          {this._renderValue('Código', row?.codigo, <i className="pi pi-tag" style={{ color: '#326FD1' }} />, 3)}
          {this._renderValue(
            'Classe',
            row?.pdm?.classe?.descricao,
            <i className="pi pi-file" style={{ color: '#22C55E' }} />,
            3
          )}
          {this._renderValue(
            'Subclasse',
            row?.pdm?.subClasse?.descricao,
            <i className="pi pi-palette" style={{ color: '#A855F7' }} />,
            3
          )}
          {this._renderValue(
            'Unidade de Medida',
            getValue(row?.pdm?.unidadesMedida?.map((um) => um.descricao)?.join(', '))?.toUpperCase() ?? '-',
            <i className="pi pi-calculator" style={{ color: '#EAB308' }} />,
            3
          )}
          {
            <div className="p-formgrid p-grid p-d-flex p-jc-between-2 m-0">
              <div className="mt-2">
                {row?.caracteristicas.map((caracteristica, index) => (
                  <Tag
                    key={index}
                    style={{
                      color: '#609AF8',
                      backgroundColor: '#F5F9FF',
                      marginRight: '3px',
                      border: '1px solid #609AF8',
                    }}
                  >
                    {caracteristica.textCaracteristica}
                  </Tag>
                ))}
              </div>
            </div>
          }
        </div>
      </div>
    );
  }

  _renderDescricaoMaterial(descricao) {
    const sanitizeFunction = (value) => (value ? value.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '');

    return (
      <Highlighter
        highlightClassName="highlighted-text-material"
        searchWords={[]}
        autoEscape={true}
        sanitize={sanitizeFunction}
        textToHighlight={descricao}
        highlightStyle={{
          background: '#ffe694',
          padding: '0.15rem 0.2rem',
          fontFamily: 'Roboto, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif',
        }}
      />
    );
  }

  renderItem(item) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <span>{item.nome}</span>
        <span style={{ width: 105 }}>
          <b>Quantidade: </b>
          {item.quantidade}
        </span>
      </div>
    );
  }

  itemTemplate(data) {
    return <ItemDetail item={data?.referencia} col={4} />;
  }

  renderDataTablesItens() {
    return (
      <>
        <Sidebar
          className="p-sidebar-md carrinho"
          visible={this.state.visibleRight}
          position="right"
          onHide={() => this.setState({ visibleRight: false })}
        >
          <div className="flex lote max-w-full justify-content-between align-items-center">
            <div className="ml-2 mt-0 text-xl font-bold">
              <i
                className="pi pi-list"
                style={{
                  color: '#326FD1',
                  background: '#F5F9FF',
                  borderRadius: '50%',
                  padding: '13px',
                  fontSize: '18px',
                  marginRight: '5px',
                }}
              />
              Itens Adicionados
            </div>
            <div>
              <FcButton
                style={{
                  color: '#ff0000',
                }}
                label="Excluir Todos"
                type="button"
                className="p-button-outlined"
                onClick={() => {
                  this.excluirItens();
                }}
              />
            </div>
          </div>

          <div className="lote-div p-3 px-0">
            {this.store.itensObra?.length == 0 ? (
              <div className="text-center font-bold mt-4">Nenhum Item Adicionado.</div>
            ) : (
              <Accordion multiple activeIndex={[0]}>
                {this.store.itensObra.map((item) => {
                  return (
                    <AccordionTab
                      header={
                        <div className="flex flex-column gap-3">
                          <div className="font-bold font-bold">Código: {item?.codigo}</div>
                          <div className="font-bold font-semibold">{item?.referencia?.descricao}</div>
                          {item.score && (
                            <Tag
                              style={{
                                color: '#f43f5e',
                                backgroundColor: '#F5F9FF',
                                border: `1px solid #f43f5e`,
                              }}
                            >
                              <Tooltip value="Score">
                                <span className="flex gap-1 align-items-center">
                                  <span>Score: {getNumberFractionDigits(item.score)}</span>
                                </span>
                              </Tooltip>
                            </Tag>
                          )}
                        </div>
                      }
                    >
                      <ItemDetail
                        item={item?.referencia}
                        mesColeta={item?.mesColeta}
                        desonerado={item?.desonerado}
                        col={4}
                        hideTitle
                      />
                      ;
                    </AccordionTab>
                  );
                })}

                {this.state.isConfirmDialogRemoveItemVisible && this.excluirItem()}
              </Accordion>
            )}
          </div>
        </Sidebar>
      </>
    );
  }

  switchDialogNewLoteVisibility() {
    this.setState({ showDialogNewLote: !this.state.showDialogNewLote });
    this.store.setNomeLote('', true);
  }

  editLote(nomeLote) {
    this.setState({ showDialogNewLote: !this.state.showDialogNewLote });
    this.store.editLote(nomeLote);
  }

  render() {
    return (
      <>
        <CatalogoObra
          onAddItem={this.handleAddItem}
          onClickCarrinho={() => this.setState({ visibleRight: true })}
          store={this.store}
        />
        {this.renderDataTablesItens()}
      </>
    );
  }
}

FormItens.propTypes = {
  store: PropTypes.any,
};

export default FormItens;
