import { action, makeObservable, observable, runInAction } from 'mobx';
import { showErrorNotification, showNotification } from '../utils/utils';

class ReporteDialogStore {
  @observable object;
  service;
  domain;
  refCaptcha;

  constructor(service, domain) {
    this.service = service;
    this.domain = domain;

    makeObservable(this);
  }

  @action
  initialize() {
    this.object = new this.domain();
  }

  @action
  setConteudo(event) {
    let value = event;
    if (event && event.value) {
      value = event.value;
    } else if (event && event.target) {
      value = event.target.value;
    }
    this.object.conteudo = value;
  }

  @action
  save(callback) {
    const token = this.refCaptcha.current.getValue();
    if (this.object.conteudo && token) {
      this.service
        .save({ reporte: this.object, token })
        .then(() =>
          runInAction(() => {
            if (callback) {
              callback();
            }
            showNotification('success', null, 'Reporte salvo com sucesso! Obrigado pelo feedback.');
          })
        )
        .catch((error) =>
          runInAction(() => {
            showErrorNotification(error);
          })
        );
    }
  }

  setRefCaptcha(ref) {
    this.refCaptcha = ref;
  }
}

export default ReporteDialogStore;
