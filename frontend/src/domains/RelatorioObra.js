import { observable } from 'mobx';
import DomainBase from '~/domains/DomainBase';

class RelatorioObra extends DomainBase {
  @observable id;
  @observable titulo;
  @observable valorLicitacao;
  @observable itensObra;
  @observable autor;
  @observable dataCadastro;

  static getDomainAttributes() {
    return ['id', 'titulo', 'dataCadastro', 'autor', 'valorLicitacao'];
  }
}

export default RelatorioObra;
