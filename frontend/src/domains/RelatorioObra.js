import { observable } from 'mobx';
import DomainBase from '~/domains/DomainBase';

class RelatorioObra extends DomainBase {
  @observable id;
  @observable titulo;
  @observable observacao;
  @observable dataAnalise;
  @observable usuario;
  @observable licitacao;
  @observable itensObra;

  static getDomainAttributes() {
    return ['id', 'titulo', 'observacao', 'dataAnalise', 'usuario', 'licitacao'];
  }
}

export default RelatorioObra;
