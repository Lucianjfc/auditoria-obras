import IndexBase from 'fc/stores/IndexBase';
import MaterialService from '~/services/MaterialService';
import PdmCaracteristicaService from '~/services/PdmCaracteristicaService';
import Material from '~/domains/Material';
import { action, observable, override, runInAction } from 'mobx';
import { showErrorNotification } from 'fc/utils/utils';

class MaterialIndexStore extends IndexBase {
  @observable characteristicFilters = [];
  @observable idPdm;
  @observable characteristicSuggests = [];

  constructor() {
    super(MaterialService, Material);
  }

  @action
  setIdPdm(idPdm) {
    this.idPdm = idPdm;
  }

  @override
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

    parameters.andParameters = [
      {
        field: 'pdm',
        operator: 'EQUAL_TO',
        value: this.idPdm,
      },
    ];
    this.characteristicFilters?.length &&
      parameters.andParameters.push({
        field: 'caracteristicas',
        operator: 'CONTAINS',
        value: this.characteristicFilters.map((c) => c.id),
      });

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

  @action
  getCharacteristicSuggests(event, idPdm, callback) {
    const query = event.query.trim();

    const queryParams = {
      andParameters: [
        {
          id: '',
          field: 'pdm',
          operator: 'EQUAL_TO',
          value: idPdm,
          formatted: '',
        },
        {
          id: '',
          field: 'textCaracteristica',
          operator: 'CONTAINS',
          value: query,
          formatted: '',
        },
      ],
    };

    PdmCaracteristicaService.advancedSearch(queryParams)
      .then((response) =>
        runInAction(() => {
          this.characteristicSuggests = response.data?.items;
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
        })
      );
  }

  @action
  fetchMaterialById(id, callback) {
    MaterialService.getById(id)
      .then((response) => {
        callback && callback(response.data);
      })
      .catch((error) => {
        showErrorNotification(error);
      });
  }

  @action
  updateCharacteristicFilters(characteristics, callback) {
    this.characteristicFilters = characteristics;
    this.load({}, callback);
  }
}

export default MaterialIndexStore;
