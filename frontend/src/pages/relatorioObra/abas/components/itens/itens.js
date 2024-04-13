import './style.scss';
import React, { Component } from 'react';
import { DataView } from 'primereact/dataview';
import { Dropdown } from 'primereact/dropdown';
import { getPercent, getPrecoByFonte, getSumFromRawData, getValueMoney } from '~/utils/utils';
import FcButton from '~/components/FcButton';
import Tooltip from '~/components/Tooltip';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import ItemDetail from '../itemDetail/itemDetail';
import Precos from '../precos/precos';
import PropTypes from 'prop-types';

class ItensObraListagem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      produtos: [],
      layout: 'list',
      sortKey: null,
      sortOrder: null,
      sortField: null,
      showVisualizationDialog: false,
      selectedItem: undefined,
    };

    this.sortOptions = [
      { label: 'Sobrepreço', value: '!price' },
      { label: 'Preço', value: 'price' },
    ];

    this.itemTemplate = this.itemTemplate.bind(this);
    this.onSortChange = this.onSortChange.bind(this);
  }

  componentDidMount() {
    let produtos = this.props.itens?.map((item) => {
      let caracteristica;
      if (item?.desonerado) {
        caracteristica = item?.referencia?.caracteristicasDesonerado?.find((c) => c.mesColeta === item?.mesColeta);
      } else {
        caracteristica = item?.referencia?.caracteristicasNaoDesonerado?.find((c) => c.mesColeta === item?.mesColeta);
      }

      return {
        codigo: item.codigo,
        fonte: item?.fonte,
        mesColeta: item?.mesColeta,
        desonerado: item?.desonerado,
        valorComprado: parseFloat(item?.precoUnitario * item?.quantidade),
        precoUnitario: item?.precoUnitario,
        quantidade: item?.quantidade,
        descricao: item?.referencia?.descricao,
        precoMercado: parseFloat(getPrecoByFonte(caracteristica, item.fonte) * item?.quantidade),
        caracteristica,
        referencia: item?.referencia,
        sobrePreco:
          parseFloat(getPrecoByFonte(caracteristica, item.fonte) * item?.quantidade) -
          parseFloat(item?.precoUnitario * item?.quantidade),
      };
    });

    const sumProdutos = getSumFromRawData(produtos, 'valorComprado');

    produtos = produtos.map((p) => ({ ...p, percent: getPercent(p.valorComprado, sumProdutos) }));

    let currentPercent = 0;
    produtos.forEach((p, idx) => {
      if (idx === 0) {
        produtos[idx].categoria = this.getClassificacaoByPercent(p.percent);
      } else {
        produtos[idx].categoria = this.getClassificacaoByPercent(p.percent + currentPercent);
      }
      currentPercent += p.percent;
    });

    produtos = produtos.slice().sort((a, b) => b.sobrePreco - a.sobrePreco);

    this.setState({ produtos }, () => {
      var height = document.getElementById('list-itens');

      this.props.callback(height.clientHeight + 'px');
    });
  }

  getColorByCategoria(categoria) {
    if (categoria === 'A') return '#f87171';
    if (categoria === 'B') return '#38bdf8';
    if (categoria === 'C') return '#fb923c';
  }

  getClassificacaoByPercent(percentAccumulated) {
    if (percentAccumulated <= 50) {
      return 'A';
    } else if (percentAccumulated <= 80) {
      return 'B';
    } else {
      return 'C';
    }
  }

  onSortChange(event) {
    const value = event.value;

    if (value.indexOf('!') === 0) {
      this.setState({
        sortOrder: -1,
        sortField: value.substring(1, value.length),
        sortKey: value,
      });
    } else {
      this.setState({
        sortOrder: 1,
        sortField: value,
        sortKey: value,
      });
    }
  }

  renderDialogItemDetail() {
    if (this.state.selectedItem) {
      const { referencia, mesColeta, desonerado, fonte } = this.state.selectedItem;
      return (
        <Dialog
          visible={this.state.showVisualizationDialog}
          onHide={() => this.setState({ showVisualizationDialog: false })}
          style={{ width: '50vw' }}
          className="show-file-overflow-fix"
          draggable={false}
        >
          <ItemDetail item={referencia} mesColeta={mesColeta} desonerado={desonerado} />
          <div className="p-col-12">
            <Precos
              title={(fonte ?? 'sinapi') == 'sinapi' ? 'SINAPI - Curva de preço' : 'SICRO - Curva de Preço'}
              desonerado={desonerado}
              precosDesonerados={referencia?.caracteristicasDesonerado}
              precosNaoDesonerados={referencia?.caracteristicasNaoDesonerado}
              fonte={fonte ?? 'sinapi'}
            />
          </div>
        </Dialog>
      );
    }
  }

  renderListItem(data) {
    return (
      <div className="col-12">
        <div className="product-list-item w-full">
          <div className="flex flex-column gap-2 w-full">
            <div className="flex justify-content-between align-items-center w-full">
              <span className="font-bold text-xl">Código: {data?.codigo}</span>
              <FcButton
                type="button"
                icon="pi pi-eye"
                className="p-button-primary"
                onClick={() => this.setState({ showVisualizationDialog: true, selectedItem: data })}
              />
            </div>
            <span className="text-lg font-semibold">{data?.descricao}</span>
            <div className="flex gap-2 align-items-center font-medium">
              <div className="flex gap-1 align-items-center">
                <Tag
                  style={{
                    color: '#737373',
                    backgroundColor: '#F5F9FF',
                    border: `1px solid #737373`,
                  }}
                >
                  <Tooltip value="Fonte">
                    <span className="flex gap-1 align-items-center">
                      <span>Fonte: {data.fonte}</span>
                    </span>
                  </Tooltip>
                </Tag>
              </div>
              <div className="flex gap-1 align-items-center">
                <Tag
                  style={{
                    color: '#737373',
                    backgroundColor: '#F5F9FF',
                    border: `1px solid #737373`,
                  }}
                >
                  <Tooltip value="Preço do mercado">
                    <span className="flex gap-1 align-items-center">
                      <span>Preço do Mercado: {getValueMoney(data.precoMercado)}</span>
                    </span>
                  </Tooltip>
                </Tag>
              </div>
              <div className="flex gap-1 align-items-center">
                <Tag
                  style={{
                    color: '#737373',
                    backgroundColor: '#F5F9FF',
                    border: `1px solid #737373`,
                  }}
                >
                  <Tooltip value="Valor da aquisição">
                    <span className="flex gap-1 align-items-center">
                      <span>Valor da Compra: {getValueMoney(data.valorComprado)}</span>
                    </span>
                  </Tooltip>
                </Tag>
              </div>
              <div className="flex gap-1 align-items-center">
                <Tag
                  style={{
                    color: data.sobrePreco >= 0 ? '#22c55e' : '#ef4444',
                    backgroundColor: '#F5F9FF',
                    border: `1px solid ${data.sobrePreco >= 0 ? '#22c55e' : '#ef4444'}`,
                  }}
                >
                  <Tooltip value={data.sobrePreco >= 0 ? 'Subpreço' : 'Sobrepreço'}>
                    <span className="flex gap-1 align-items-center">
                      <span>
                        {data.sobrePreco >= 0 ? 'Subpreço' : 'Sobrepreço'} {getValueMoney(data.sobrePreco)}
                      </span>
                    </span>
                  </Tooltip>
                </Tag>
              </div>
              <div className="flex gap-1 align-items-center">
                <Tag
                  style={{
                    color: this.getColorByCategoria(data?.categoria),
                    backgroundColor: '#F5F9FF',
                    border: `1px solid ${this.getColorByCategoria(data?.categoria)}`,
                  }}
                >
                  <Tooltip value="Categoria ABC">
                    <span className="flex gap-1 align-items-center">
                      <span>Categória: {data?.categoria}</span>
                    </span>
                  </Tooltip>
                </Tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  itemTemplate(product, layout) {
    if (!product) {
      return;
    }

    if (layout === 'list') return this.renderListItem(product);
  }

  renderHeader() {
    return (
      <div className="grid grid-nogutter">
        <div className="col-6" style={{ textAlign: 'left' }}>
          <Dropdown
            options={this.sortOptions}
            value={this.state.sortKey}
            optionLabel="label"
            placeholder="Ordenar"
            onChange={this.onSortChange}
          />
        </div>
      </div>
    );
  }

  render() {
    const header = this.renderHeader();

    return (
      <div className="dataview-demo">
        <DataView
          id="list-itens"
          value={this.state.produtos}
          layout={this.state.layout}
          header={header}
          itemTemplate={this.itemTemplate}
          paginator
          rows={5}
          // sortOrder={this.state.sortOrder}
          // sortField={this.state.sortField}
        />
        {this.renderDialogItemDetail()}
      </div>
    );
  }
}

ItensObraListagem.propTypes = {
  itens: PropTypes.array,
  callback: PropTypes.func,
};

export default ItensObraListagem;
