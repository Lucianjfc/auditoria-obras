import RelatorioObraService from '~/services/RelatorioObraService';
import FormBase from '~/stores/FormBase';
import { action, computed, observable, override, runInAction } from 'mobx';
import RelatorioObra from '~/domains/RelatorioObra';
import ItemObra from '~/domains/itemObra';
import { extractRules } from '~/utils/formRules';
import { showErrorNotification, showNotification } from '~/utils/utils';
import CatalogoObraService from '~/services/CatalogoObraService';

class RelatorioObraFormStore extends FormBase {
  @observable itensObra = [];
  @observable itemObra;
  @observable obraObject = {};

  constructor() {
    super(RelatorioObraService, RelatorioObra);
    this.getRuleItem = this.getRuleItem.bind(this);
    this.itemObra = new ItemObra();
  }

  @action
  getRuleItem(field) {
    return this.rulesItem[field] ? this.rulesItem[field] : {};
  }

  @computed.struct
  get rulesItem() {
    const definition = this.rulesDefinitionItem();
    const result = extractRules(definition, this.itemObra);
    Object.keys(result).forEach((key) => {
      const error = result[key].error;
      if (error) {
        result.hasError = true;
      }
    });
    return result;
  }

  rulesDefinitionItem() {
    return {
      quantidade: [{ rule: 'required', message: 'Por favor, preencha o campo' }],
      precoUnitario: [{ rule: 'required', message: 'Por favor, preencha o campo' }],
    };
  }

  @override
  initialize(id, defaultValues = {}, callback) {
    if (!id) {
      this.object = Object.assign({}, defaultValues);
    } else {
      this.loading = true;
      this.service
        .getById(id)
        .then((response) =>
          runInAction(() => {
            this.object = response.data;
            this.itensObra = this.object.itensObra;
            this.itensObra = this.itensObra.map((i) => {
              i.referencia = i.referencia[i.fonte === 'sinapi' ? 'referenciaSinapi' : 'referenciaSicro'];
              return i;
            });
            //this.recuperarArquivos(this.object?.licitacao?.id, callbackRefresh);

            this.loadedObject = response.data;
            callback && callback();
          })
        )
        .catch((error) =>
          runInAction(() => {
            showErrorNotification(error);
          })
        )
        .finally(() =>
          runInAction(() => {
            this.loading = false;
          })
        );
    }
  }

  @override
  save(callback, type = 'edit') {
    this.object.itensObra = this.itensObra;
    this.loading = true;
    this.service
      .save(this.object, type, this.object.id)
      .then(() => {
        callback && callback();
        showNotification('success', null, 'Registro salvo com sucesso!');
      })
      .catch((error) => showErrorNotification(error))
      .finally(() =>
        runInAction(() => {
          this.loading = false;
        })
      );
  }

  @action
  onAddItem(callback) {
    if (this.itemObra?.fonte == 'sicro') {
      CatalogoObraService.searchSicroByCodigo(this.itemObra.codigo)
        .then((response) =>
          runInAction(() => {
            this.itemObra.referencia = response.data;
            this.itensObra.push(this.itemObra);
            showNotification('info', 'Item adicionado', 'O item foi adicionado!');
            callback && callback();
          })
        )
        .catch((error) =>
          runInAction(() => {
            showErrorNotification(error);
          })
        );
    } else {
      CatalogoObraService.searchSinapiByCodigo(this.itemObra.codigo)
        .then((response) =>
          runInAction(() => {
            this.itemObra.referencia = response.data;
            this.itensObra.push(this.itemObra);
            callback && callback();
          })
        )
        .catch((error) =>
          runInAction(() => {
            showErrorNotification(error);
          })
        );
    }
  }

  @computed
  get computedLoteValues() {
    const list = [];
    const itensSemLote = { nome: 'Itens', gerado: true, itens: [] };

    for (const key of this.lotes.keys()) {
      const keyedList = this.lotes.get(key).itens.map((item, index) => {
        item.lote = this.lotes.get(key);
        item.key = { lote: key, index };
        return item;
      });

      if (!this.lotes.get(key).gerado) {
        list.push({
          nome: 'Lote: ' + key,
          key: key,
          gerado: false,
          itens: keyedList,
        });
      } else {
        Array.prototype.push.apply(itensSemLote.itens, keyedList);
      }
    }

    list.forEach((lote) => {
      lote.itens.forEach((item, index) => {
        item.numero = index + 1;
      });
    });

    if (itensSemLote.itens.length > 0) {
      list.unshift(itensSemLote);
    }

    return list;
  }

  @action
  setItemObra(type, value, fonte, mesColeta) {
    if (type === 'new') {
      const newItem = new ItemObra();
      newItem.codigo = value?.codigo;
      newItem.fonte = fonte;
      newItem.mesColeta = mesColeta;
      newItem.desonerado = false;
      this.itemObra = newItem;
    } else {
      this.itemObra = Object.assign({}, {});
    }
  }

  @action
  updateAttributeItemObra(attribute, event) {
    let value = event;
    if (event && event.value) {
      value = event.value;
    }
    if (event && event.target) {
      value = event.target.value;
    }
    this.itemObra[attribute] = value;
  }

  rulesDefinition() {
    return {
      titulo: [
        { rule: 'required', message: 'Por favor, preencha o campo' },
        { rule: 'isMaxLength', maxLength: 300, message: 'Por favor, diminua o tamanho do campo' },
      ],
      autor: [
        { rule: 'required', message: 'Por favor, preencha o campo' },
        { rule: 'isMaxLength', maxLength: 255, message: 'Por favor, diminua o tamanho do campo' },
      ],
      valorLicitacao: [{ rule: 'required', message: 'Por favor, preencha o campo' }],
    };
  }

  getFilterSuggestLicitacao() {
    const filterSuggestLicitacao = [];
    return filterSuggestLicitacao;
  }

  @action
  excluirItens() {
    this.itensObra = [];
  }
}

export default RelatorioObraFormStore;
