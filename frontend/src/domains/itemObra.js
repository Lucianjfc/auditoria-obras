import { observable } from 'mobx';
import DomainBase from '~/domains/DomainBase';

class ItemObra extends DomainBase {
  @observable id;
  @observable codigo;
  @observable fonte;
  @observable quantidade;
  @observable precoUnitario;
  @observable mesColeta;
  @observable desonerado;

  static getDomainAttributes() {
    return ['id', 'codigo', 'fonte', 'quantidade', 'precoUnitario', 'mesColeta', 'desonerado'];
  }
}

export default ItemObra;
