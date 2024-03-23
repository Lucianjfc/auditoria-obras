import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import SearchOperators from '../components/AdvancedSearch/SearchOperators';
import { showErrorNotification } from '../utils/utils';

class AsyncDropDownStore {
  domain;
  service;
  label;
  formatterLabel;
  value;
  options;
  totalItems = 0;
  @observable loadedList = [];
  initialLoad = [];
  @observable loading;
  @observable selectedItem;
  filter;
  filterTimeout;

  constructor(domain, service, label, value, options = {}, formatterLabel) {
    this.domain = domain;
    this.service = service;
    this.label = label;
    this.value = value;
    this.formatterLabel = formatterLabel;

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
  initialize(value, callback, defaultValue) {
    this.loading = true;

    const requestParams = { ...this.options };
    requestParams.page.index = 1;

    this.service
      .advancedSearch(requestParams)
      .then((response) => {
        runInAction(() => {
          this.loadedList = [...response.data.items];
          this.initialLoad = [...response.data.items];
          this.initializeInitialValue(value, callback, defaultValue);
        });
      })
      .catch((error) =>
        runInAction(() => {
          showErrorNotification(error);
        })
      );
  }

  @action
  initializeInitialValue(value, callback, defaultValue) {
    if (value) {
      let promise;
      if (this.value === 'id') {
        promise = this.service.getById(value);
      } else {
        const options = {
          'page.index': 1,
          'page.size': 1,
        };
        options[this.value] = value;
        promise = this.service.get(options);
      }

      promise
        .then((response) => {
          runInAction(() => {
            if (response && response.data) {
              this.setSelectedItem(this.value === 'id' ? response.data : response.data.items[0]);
            }
          });
        })
        .catch((error) =>
          runInAction(() => {
            if (defaultValue && error?.response?.status == '404') {
              this.setSelectedItem(defaultValue);
            } else {
              showErrorNotification(error);
            }
          })
        )
        .finally(() =>
          runInAction(() => {
            callback && callback();
            this.loading = false;
          })
        );
    }
  }

  @action
  setSelectedItem(value) {
    this.selectedItem = value;
    if (!this.initialLoad.some((item) => item[this.value] === this.selectedItem[this.value])) {
      this.loadedList.push(this.selectedItem);
      this.initialLoad.push(this.selectedItem);
    }
  }

  @computed
  get keyedList() {
    let hasSelectedValue = false;

    const result = this.loadedList.map((item, idx) => {
      const keyedItem = {};
      if (!item || !item.key) {
        keyedItem.key = idx;
      }

      keyedItem.value = item?.[this.value];
      keyedItem.label = this.formatterLabel ? this.formatterLabel(item) : item?.[this.label];

      if (this.selectedItem && !hasSelectedValue && keyedItem.value === this.selectedItem[this.value]) {
        hasSelectedValue = true;
      }
      return keyedItem;
    });

    if (this.selectedItem && !hasSelectedValue) {
      result.unshift({
        key: 'selected',
        value: this.selectedItem[this.value],
        label: this.selectedItem[this.label],
      });
    }

    if (result.length === 0) {
      result.push({
        empty: this.filter,
      });
    }

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
          if (this.loadedList.length === 0 && this.selectedItem) {
            this.loadedList.push(this.selectedItem);
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

    this.filter = filter;
  }

  @action
  getItemFromValue(value) {
    if (value) {
      const filteredList = this.loadedList.filter((item) => item[this.value] === value);
      if (filteredList.length === 1) {
        this.selectedItem = filteredList[0];
        return filteredList[0];
      }
    }
    this.selectedItem = null;
    return null;
  }
}

export default AsyncDropDownStore;
