import { createContext } from 'react';
import LoginStore from '~/stores/LoginStore';

const storesContext = createContext({
  loginStore: new LoginStore(),
});

export default storesContext;
