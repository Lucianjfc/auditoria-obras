import { action, makeObservable, observable } from 'mobx';

class AppStore {
  notificationRefFunction;
  @observable data = {};
  @observable entityChanged;
  @observable layout;

  constructor() {
    this.setData = this.setData.bind(this);
    this.layout = localStorage.getItem('opcaoLayout');
    makeObservable(this);
  }

  @action
  setLayout(layout) {
    this.layout = layout;
    localStorage.setItem('opcaoLayout', layout);
  }

  @action
  setNotificationRefFunction(refFunction) {
    this.notificationRefFunction = refFunction;
  }

  @action
  setData(key, value) {
    this.data[key] = value;
  }

  @action
  setEntityChanged(value) {
    this.entityChanged = value;
  }

  @action
  getData(key) {
    return this.data[key];
  }

  @action
  getPermissionsList() {
    if (this.data['permissions']) return Object.values(this.data['permissions']);
    else return [];
  }

  @action
  hasPermission(resourcePermissions = []) {
    if (this.getPermissionsList().some((item) => item === 'admin')) return true;
    return this.getPermissionsList().some((item) => resourcePermissions.includes(item));
  }

  getContextEntity() {
    const contextEntityId = this.data['selectedContextEntity'];
    const entities = this.data['contextEntities']?.filter((e) => e.id === contextEntityId);
    return entities?.length > 0 ? entities[0] : null;
  }

  noNeedWaitContextEntity() {
    const selectedContextEntity = this.data['selectedContextEntity'];
    const hasNoContextEntity = this.data['hasNoContextEntity'];
    return selectedContextEntity || hasNoContextEntity;
  }
}

export default new AppStore();
