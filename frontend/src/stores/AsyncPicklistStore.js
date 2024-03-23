import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { showErrorNotification } from '../utils/utils';
import SearchOperators from '../components/AdvancedSearch/SearchOperators';

class AsyncPicklistStore {
  sourceDomain;
  sourceService;
  value;
  label;
  options;
  searchOptions;
  @observable sourceList = [];
  initialLoad = [];
  @observable loading;
  @observable targetList = [];
  @observable filterSourceValue = '';
  @observable filterTargetValue = '';
  @observable sort;
  timeOut;

  constructor(sourceDomain, sourceService, label, value, options = {}, sort = undefined, searchOptions = {}) {
    this.sourceDomain = sourceDomain;
    this.sourceService = sourceService;
    this.value = value;
    this.label = label;
    this.sort = sort;
    this.options = options;

    if (!searchOptions['filter']) {
      searchOptions['filter'] = false;
    }

    this.searchOptions = searchOptions;

    this.initialize = this.initialize.bind(this);
    this.getVisibleOptionsSourceList = this.getVisibleOptionsSourceList.bind(this);
    this.filter = this.filter.bind(this);
    this.contains = this.contains.bind(this);
    this.updateFilterSourceValue = this.updateFilterSourceValue.bind(this);
    this.updateFilterTargetValue = this.updateFilterTargetValue.bind(this);

    makeObservable(this);
  }

  @action
  updateLists(sourceList, targetList) {
    this.sourceList = sourceList;
    this.targetList = targetList;
  }

  @action
  initialize(initialTargetList, callback) {
    this.loading = true;
    this.targetList = initialTargetList;
    if (this.sort) {
      this.options['sort.by'] = this.sort.by;
      this.options['sort.order'] = this.sort.order;
    }

    const queryParaments = JSON.parse(JSON.stringify(this.options));
    if (!queryParaments.andParameters) {
      queryParaments.andParameters = [];
    }

    const targetListIds = this.getVisibleOptionsTargetList().map((v) => v.id);
    if (targetListIds.length > 0) {
      queryParaments.andParameters.push({
        field: this.value,
        operator: SearchOperators.NOT_IN.value,
        values: targetListIds,
        formatted: '',
      });
    }

    queryParaments.page = { size: 100, index: 1 };
    this.sourceService
      .advancedSearch(queryParaments)
      .then((response) =>
        runInAction(() => {
          this.initialLoad = [...(this.getAll ? response.data : response.data.items)];
          this.sourceList = [...(this.getAll ? response.data : response.data.items)];
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

  @computed
  get targetListValues() {
    return this.targetList.map((target) => target[this.value]);
  }

  @computed
  get sortedTargetList() {
    return this.targetList.slice().sort((a, b) => this.compare(a, b, this.sort?.by));
  }

  @computed
  get filteredSourceList() {
    return this.sourceList.filter((source) => !this.targetListValues.includes(source[this.value]));
  }

  @computed
  get sortedSourceList() {
    return this.filteredSourceList.slice().sort((a, b) => this.compare(a, b, this.sort?.by));
  }

  @computed
  get filterSourceList() {
    return this.sourceList;
  }

  quantitySourceList() {
    return this.filteredSourceList.length;
  }

  quantityTargetList() {
    return this.targetListValues.length;
  }

  compare(a, b, sortAttribute = undefined) {
    if (a[sortAttribute ?? this.value] < b[sortAttribute ?? this.value]) {
      return -1;
    }
    if (a[sortAttribute ?? this.value] > b[sortAttribute ?? this.value]) {
      return 1;
    }
    return 0;
  }

  @action
  updateFilterSourceValue(value, callback) {
    this.filterSourceValue = value;
    const query = value;

    const queryParaments = JSON.parse(JSON.stringify(this.options));
    if (!queryParaments.andParameters) {
      queryParaments.andParameters = [];
    }

    queryParaments.andParameters?.push({
      id: '',
      field: this.label,
      operator: SearchOperators.CONTAINS.value,
      value: query,
      formatted: '',
    });

    const targetListIds = this.getVisibleOptionsTargetList().map((v) => v.id);
    if (targetListIds.length > 0) {
      queryParaments.andParameters?.push({
        id: '',
        field: this.value,
        operator: SearchOperators.NOT_IN.value,
        values: targetListIds,
        formatted: '',
      });
    }

    queryParaments.sort = { by: this.sort.by, order: this.sort.order };
    if (this.timeOut) {
      clearTimeout(this.timeOut);
    }
    this.timeOut = setTimeout(() => {
      this.loading = true;
      callback && callback();
      this.sourceService
        .advancedSearch(queryParaments)
        .then((response) =>
          runInAction(() => {
            this.sourceList = response.data?.items;
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
    }, 450);
  }

  @action
  updateFilterTargetValue(value) {
    this.filterTargetValue = value;
  }

  getVisibleOptionsSourceList() {
    return this.sourceList?.filter((option) => !this.targetListValues.includes(option[this.value]));
  }

  getVisibleOptionsTargetList() {
    if (this.searchOptions.filter && this.searchOptions.filterBy) {
      return this.filter(this.sortedTargetList, this.filterTargetValue);
    } else {
      return this.targetList;
    }
  }

  getInvisibleOptionsSourceList() {
    let options = [];
    if (this.searchOptions.filter && this.searchOptions.filterBy) {
      options = this.filter(this.sortedSourceList, this.filterSourceValue, true);
    }
    return options;
  }

  getInvisibleOptionsTargetList() {
    let options = [];
    if (this.searchOptions.filter && this.searchOptions.filterBy) {
      options = this.filter(this.sortedTargetList, this.filterTargetValue, true);
    }
    return options;
  }

  filter(optionsList, filterValue, inverse = false) {
    const filteredItems = [];
    if (optionsList) {
      for (let option of optionsList) {
        const fieldValue = option[this.searchOptions.filterBy];
        if (!inverse ? this.contains(fieldValue, filterValue) : !this.contains(fieldValue, filterValue)) {
          filteredItems.push(option);
        }
      }
    }
    return filteredItems;
  }

  contains(value, filter) {
    if (filter === undefined || filter === null || (typeof filter === 'string' && filter.trim() === '')) {
      return true;
    }

    if (value === undefined || value === null) {
      return false;
    }

    const filterValue = filter.toString().toLocaleLowerCase('pt-BR');
    const stringValue = value.toString().toLocaleLowerCase('pt-BR');
    return stringValue.indexOf(filterValue) !== -1;
  }
}

export default AsyncPicklistStore;
