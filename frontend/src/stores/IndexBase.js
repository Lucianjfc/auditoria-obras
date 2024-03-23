import { makeObservable, observable, runInAction, action, computed } from 'mobx';
import { showNotification, showErrorNotification } from '../utils/utils';

class IndexBase {
  service;
  domain;
  @observable isConfirmDialogVisible = false;
  @observable list = [];
  @observable loading = false;
  @observable loadingNewPage = false;
  @observable exportList = [];
  @observable rangeExportData = 10;
  @observable pagination = {
    total: 0,
    page: {
      index: 1,
      size: 10,
    },
  };
  @observable advancedSearchParams = {
    andParameters: [],
    orParameters: [],
    sort: {
      by: 'id',
      order: 'asc',
    },
  };
  @observable suggestSearchList = [];
  @observable loadingSuggest = false;
  @observable searchText = '';
  suggestTimeout;
  defaultSortBy;
  defaultSortOrder;

  constructor(service, domain, defaultSortBy = 'id', defaultSortOrder = 'asc') {
    this.service = service;
    this.domain = domain;
    this.advancedSearchParams.sort = {
      by: defaultSortBy,
      order: defaultSortOrder,
    };
    this.defaultSortBy = defaultSortBy;
    this.defaultSortOrder = defaultSortOrder;

    this.load = this.load.bind(this);
    this.reloadTableData = this.reloadTableData.bind(this);
    this.deleteRow = this.deleteRow.bind(this);

    makeObservable(this);
  }

  @action
  toggleShowConfirmDialog() {
    this.isConfirmDialogVisible = !this.isConfirmDialogVisible;
  }

  @action
  setSearchText(value = '') {
    this.searchText = value;
  }

  @action
  setPagination(pagination) {
    this.pagination = pagination;
  }

  @action
  setSearchParams(advancedSearchParams) {
    this.advancedSearchParams = advancedSearchParams;
  }

  @computed
  get listKey() {
    return this.list.map((item, idx) => {
      if (!item.key) {
        item.key = idx;
      }
      return item;
    });
  }

  @action
  setLoading(value, increment = false) {
    if (increment) {
      this.loadingNewPage = value;
    }

    this.loading = value;
  }

  @action
  load(options = {}, callback, increment = false) {
    this.setLoading(true, increment);
    const parameters = Object.assign(this.advancedSearchParams, options);

    if (options && options.page && options.page.index && options.page.size) {
      parameters.page = { index: options.page.index, size: options.page.size };
    } else {
      parameters.page = { index: 1, size: 10 };
    }

    if (options.andParameters && options.andParameters.length > 0) {
      parameters.andParameters = options.andParameters;
    }

    if (options.orParameters && options.orParameters.length > 0) {
      parameters.orParameters = options.orParameters;
    }

    if (options && options['sort'] && options['sort'].by && options['sort'].order) {
      parameters.sort = { by: options['sort'].by, order: options['sort'].order };
    } else {
      parameters.sort = { by: this.defaultSortBy, order: this.defaultSortOrder };
    }

    this.pagination = parameters;
    this.service
      .advancedSearch(parameters)
      .then((response) =>
        runInAction(() => {
          if (increment) {
            this.pagination.total += response.data.total;
            this.list = this.initializeLoadedList([...this.list, ...response.data.items]);
          } else {
            this.pagination.total = response.data.total;
            this.list = this.initializeLoadedList(response.data.items ?? []);
          }
          callback && callback(response);
        })
      )
      .catch((error) => showErrorNotification(error))
      .finally(() =>
        runInAction(() => {
          this.setLoading(false, increment);
        })
      );
  }

  initializeLoadedList(list) {
    return this.domain ? list.map((element) => Object.assign(new this.domain(), element)) : list;
  }

  @action
  reloadTableData(callback) {
    this.pagination = {
      total: 0,
      page: {
        index: 1,
        size: 10,
      },
    };
    this.load({}, callback);
  }

  @action
  deleteRow(id, callback) {
    this.loading = true;
    this.service
      .delete(id)
      .then(() => {
        callback && callback();
        showNotification('success', null, 'Registro excluído com sucesso!');
      })
      .catch((error) => showErrorNotification(error))
      .finally(() =>
        runInAction(() => {
          this.loading = false;
        })
      );
  }

  @action
  async loadExportList(loadFirstPage = false) {
    await this.service
      .advancedSearch({
        ...this.advancedSearchParams,
        page: { index: loadFirstPage ? 1 : this.pagination.page.index, size: this.rangeExportData },
      })
      .then((response) => {
        runInAction(() => {
          this.exportList = response.data.items;
        });
      })
      .catch(() => {
        showNotification('error', null, 'Ocorreu um erro na exportação dos dados');
      });
  }

  @action
  setRangeExportData(value) {
    this.rangeExportData = value;
  }

  beforeLoadSuggest(value, orParameters = [], andParameters = [], labels = []) {
    this.loadingSuggest = true;

    if (this.suggestTimeout) {
      clearTimeout(this.suggestTimeout);
    }

    const timeout = setTimeout(() => {
      this._loadSuggest(value, orParameters, andParameters, labels);
    }, 1000);

    this.suggestTimeout = timeout;
  }

  @action
  _loadSuggest(value, orParameters = [], andParameters = [], labels = []) {
    if (!value || ((!orParameters || orParameters.length === 0) && (!andParameters || andParameters.length === 0))) {
      this.loadingSuggest = false;
      return;
    }

    this.loadingSuggest = true;
    const parameters = {
      andParameters,
      orParameters,
      sort: {
        by: this.defaultSortBy,
        order: this.defaultSortOrder,
      },
      page: {
        index: 1,
        size: 10,
      },
    };

    this.service
      .advancedSearch(parameters)
      .then((response) =>
        runInAction(() => {
          const resultList = response.data.items;
          if (resultList && labels) {
            this.suggestSearchList = resultList.map((item) => {
              item.label = this._getLabelFromItem(labels, item);
              return item;
            });
          } else {
            this.suggestSearchList = resultList;
          }
        })
      )
      .catch((error) =>
        runInAction(() => {
          showErrorNotification(error);
        })
      )
      .finally(() =>
        runInAction(() => {
          this.loadingSuggest = false;
        })
      );
  }

  _getLabelFromItem(labels = [], item) {
    const result = [];
    labels.forEach((label) => {
      if (label.includes('.')) {
        const splitted = label.split('.');
        if (splitted.length === 2) {
          result.push(item[splitted[0]][splitted[1]]);
        }
      } else {
        result.push(item[label]);
      }
    });
    return result.join(' ');
  }
}

export default IndexBase;
