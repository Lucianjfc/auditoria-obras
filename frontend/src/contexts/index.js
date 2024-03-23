import PropTypes from 'prop-types';
import { RightBarContextProvider } from './RightBarContext';

export const AppContextsProvider = ({ children, history }) => {
  return <RightBarContextProvider history={history}>{children}</RightBarContextProvider>;
};

AppContextsProvider.propTypes = {
  children: PropTypes.node.isRequired,
  history: PropTypes.any,
};
