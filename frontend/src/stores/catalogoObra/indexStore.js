import IndexBase from '~/stores/IndexBase';
import CatalogoObraService from '~/services/CatalogoObraService';
import { observable, override, runInAction } from 'mobx';
import { showErrorNotification } from '~/utils/utils';

class CatalogoObraIndexStore extends IndexBase {
  @observable listSinapi = [];
  @observable paginationSinapi = {
    total: 0,
    page: {
      index: 1,
      size: 10,
    },
  };

  @observable listSicro = [];
  @observable paginationSicro = {
    total: 0,
    page: {
      index: 1,
      size: 10,
    },
  };

  constructor() {
    super(CatalogoObraService);
  }

  getAdvancedSearchParams() {
    return [];
  }

  getElasticParams(params) {
    return {
      search: params?.andParameters?.find((param) => param.field === 'query')?.value ?? '',
      filters: params?.andParameters?.filter((param) => param.field !== 'query'),
      page: params?.page,
    };
  }

  @override
  load(options = {}, filter, callback) {
    this.loading = true;

    const advancedSearchParams = JSON.parse(JSON.stringify(this.advancedSearchParams));
    const parameters = Object.assign(advancedSearchParams, options);

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

    this.advancedSearchParams = advancedSearchParams;

    const promises = [];

    if (!filter || filter === 'sinapi') {
      const parametersSinapi = JSON.parse(JSON.stringify(parameters));
      this.paginationSinapi = parametersSinapi;
      const elasticParams = this.getElasticParams(parametersSinapi);
      promises.push(this.service.searchSinapi(elasticParams));
    }

    if (!filter || filter === 'sicro') {
      const parametersSicro = JSON.parse(JSON.stringify(parameters));
      this.paginationSicro = parametersSicro;
      const elasticParams = this.getElasticParams(parametersSicro);
      promises.push(this.service.searchSicro(elasticParams));
    }

    Promise.all(promises)
      .then((responses) =>
        runInAction(() => {
          if (filter === 'sinapi') {
            this.paginationSinapi.total = responses[0]?.data?.total;
            this.listSinapi = this.initializeLoadedList(responses[0]?.data?.items);
          } else if (filter === 'sicro') {
            this.paginationSicro.total = responses[0]?.data?.total;
            this.listSicro = this.initializeLoadedList(responses[0]?.data?.items);
          } else {
            this.paginationSinapi.total = responses[0]?.data?.total;
            this.listSinapi = this.initializeLoadedList(responses[0]?.data?.items);

            this.paginationSicro.total = responses[1]?.data?.total;
            this.listSicro = this.initializeLoadedList(responses[1]?.data?.items);
          }
          callback && callback();
        })
      )
      .catch((error) => showErrorNotification(error))
      .finally(() =>
        runInAction(() => {
          this.loading = false;
        })
      );
  }

  @override
  setPagination(pagination, filter) {
    if (!filter || filter === 'sinapi') this.paginationSinapi = JSON.parse(JSON.stringify(pagination));
    if (!filter || filter === 'sicro') this.paginationSicro = JSON.parse(JSON.stringify(pagination));
  }
}

export default CatalogoObraIndexStore;
