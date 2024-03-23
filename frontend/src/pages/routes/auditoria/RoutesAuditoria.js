import { Switch, Route } from 'react-router';
import NotFound from '~/pages/NotFound';
import UrlRouter from '~/constants/UrlRouter';
import RoutesRelatorioObra from './RoutesRelatorioObra';

const RoutesAuditoria = () => {
  return (
    <Switch>
      <Route path={UrlRouter.auditoria.relatorioObra.index} component={RoutesRelatorioObra} />
      <Route component={NotFound} />
    </Switch>
  );
};

export default RoutesAuditoria;
