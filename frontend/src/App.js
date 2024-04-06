import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './App.scss';
import React, { useEffect } from 'react';
import Template from './pages/Template';
import { Switch, Route, matchPath } from 'react-router';
import { createBrowserHistory } from 'history';
import PrimeReact from 'primereact/api';
import UrlRouter from './constants/UrlRouter';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import NotFound from '~/pages/NotFound';
import { getRoutesObjects } from '~/utils/utils';
import RoutesAuditoria from './pages/routes/auditoria/RoutesAuditoria';
import AppErrorBoundary from './components/AppErrorBoundary';

PrimeReact.ripple = true;
export const RTLContext = React.createContext();

require('dotenv').config();
const history = createBrowserHistory();

const App = () => {
  useEffect(() => {
    window.location.getCurrentPath = () =>
      getRoutesObjects(UrlRouter).find((route) => matchPath(window.location.hash?.replace('#', ''), route))?.path;
  }, []);

  return (
    <AppErrorBoundary>
      <BrowserRouter history={history}>
        <HashRouter>
          <Switch>
            <Template>
              <Switch>
                <Route path={UrlRouter.auditoria.default} component={RoutesAuditoria} />
                <Route component={NotFound} />
              </Switch>
            </Template>
          </Switch>
        </HashRouter>
      </BrowserRouter>
    </AppErrorBoundary>
  );
};

export default App;
