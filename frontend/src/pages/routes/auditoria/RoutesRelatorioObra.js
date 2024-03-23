import { Switch, Route } from 'react-router';
import UrlRouter from '~/constants/UrlRouter';
import NotFound from '~/pages/NotFound';
import EditRelatorioObra from '~/pages/relatorioObra/edit';
import NewRelatorioObra from '~/pages/relatorioObra/new';
import RelatorioObraIndexPage from '~/pages/relatorioObra';
import ListagemRelatoriosIndexPage from '~/pages/relatorioObra/listagemRelatorios';

const RoutesRelatorioObra = () => {
  return (
    <Switch>
      <Route path={UrlRouter.auditoria.relatorioObra.listagem} component={ListagemRelatoriosIndexPage} exact />
      <Route path={UrlRouter.auditoria.relatorioObra.index} component={RelatorioObraIndexPage} exact />
      <Route path={UrlRouter.auditoria.relatorioObra.novo} component={NewRelatorioObra} exact />
      <Route path={UrlRouter.auditoria.relatorioObra.editar} component={EditRelatorioObra} exact />
      <Route component={NotFound} />
    </Switch>
  );
};

export default RoutesRelatorioObra;
