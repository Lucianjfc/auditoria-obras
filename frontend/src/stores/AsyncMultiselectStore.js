import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import SearchOperators from '../components/AdvancedSearch/SearchOperators';
import { showErrorNotification } from '../utils/utils';

class AsyncMultiselectStore {
  domain;
  service;
  label;
  value;
  filterTimeout;
  initialLoad = [];
  @observable loadedList = [];
  @observable selectedItems = [];
  @observable loading;

  constructor(domain, service, label, value, options = {}) {
    this.domain = domain;
    this.service = service;
    this.label = label;
    this.value = value;

    if (options && (!options.page || (options.page && !options.page.size))) {
      if (!options.page) {
        options.page = {};
      }
      options.page.size = 100;
    }

    this.options = options;

    this.initialize = this.initialize.bind(this);
    this._onFilter = this._onFilter.bind(this);
    this.beforeFilter = this.beforeFilter.bind(this);
    this.getItemFromValue = this.getItemFromValue.bind(this);

    makeObservable(this);
  }

  @action
  initialize(value, callback) {
    this.loading = true;
    this.selectedItems = value;
    const requestParams = { ...this.options };
    requestParams.page.index = 1;

    const promise = this.service.advancedSearch(requestParams);

    Promise.resolve(promise)
      .then((response) =>
        runInAction(() => {
          this.loadedList = response.data.items;
          this.initialLoad = response.data.items;

          if (this.selectedItems) {
            this.selectedItems.forEach((selectedValue) => {
              const existValue = this.loadedList.find(
                (loadedData) => loadedData[this.value] === selectedValue[this.value]
              );
              !existValue && this.loadedList.push(selectedValue);
            });
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
          callback && callback();
          this.loading = false;
        })
      );
  }

  @computed
  get keyedList() {
    const result = this.loadedList.map((item, idx) => {
      const keyedItem = {};
      if (!item.key) {
        keyedItem.key = idx;
      }
      keyedItem.value = item?.[this.value];
      keyedItem.label = item?.[this.label];
      return keyedItem;
    });
    return result;
  }

  @action
  beforeFilter(e) {
    this.loading = true;

    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    const timeout = setTimeout(() => {
      this._onFilter(e);
    }, 1000);

    this.filterTimeout = timeout;
  }

  @action
  _onFilter(event, callback) {
    this.loading = true;
    const { filter } = event;
    if (!filter) {
      this.loadedList = [...this.initialLoad];
      if (this.selectedItems) {
        this.selectedItems.forEach((selectedValue) => {
          const existValue = this.loadedList.find((loadedData) => loadedData[this.value] === selectedValue[this.value]);
          !existValue && this.loadedList.push(selectedValue);
        });
      }
      this.loading = false;
      return;
    }

    const requestParams = { ...this.options };
    requestParams.page.index = 1;

    requestParams.orParameters = [
      {
        value: filter,
        operator: SearchOperators.CONTAINS.value,
        field: this.label,
      },
    ];

    this.service
      .advancedSearch(requestParams)
      .then((response) =>
        runInAction(() => {
          this.loadedList = response.data.items ?? [];
          if (this.selectedItems) {
            this.loadedList = this.loadedList.concat(this.filteredList);
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
          this.loading = false;
          callback && callback();
        })
      );
  }

  @action
  getItemFromValue(value) {
    if (value) {
      const filteredList = this.loadedList.filter((item) => item[this.value] === value);
      if (filteredList.length > 0) {
        return filteredList[0];
      }
    }
    return null;
  }

  @action
  valueList(value) {
    if (value) {
      const result = value?.map((item) => {
        return item?.[this.value] ? item?.[this.value] : item;
      });
      return result ? result : value;
    }
    return null;
  }

  @action
  setSelectedItems(list) {
    this.selectedItems = list;
  }

  @computed
  get filteredList() {
    const loadedValues = this.valueList(this.loadedList);
    const result = this.selectedItems.filter((item) => !loadedValues.includes(item?.[this.value]));
    return result;
  }
}

export default AsyncMultiselectStore;
