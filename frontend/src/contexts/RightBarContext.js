import PropTypes from 'prop-types';
import { createContext, useEffect, useMemo, useState } from 'react';
import { isDesktop } from '../utils/utils';

const RightBarContext = createContext({
  toggleRightbar: () => {},
  setRightBarContent: () => {},
  rightbarContent: null,
});

export const RightBarContextProvider = ({ children, history }) => {
  const [rightbarContent, setRightBarContent] = useState(null);
  const [rightbarActive, setRightBarActive] = useState(false);
  const [mode, setMode] = useState('desktop');
  const [historyState] = useState(history);

  useEffect(() => {
    if (isDesktop()) {
      setMode('desktop');
    } else {
      setMode(null);
    }
  }, [rightbarActive]);

  const toggleRightbar = () => {
    setRightBarActive((prevState) => !prevState);
  };

  const value = useMemo(() => {
    return {
      historyState,
      toggleRightbar,
      setRightBarContent,
      rightbarContent,
      rightbarActive,
      setRightBarActive,
      mode,
      setMode,
    };
  }, [toggleRightbar, setRightBarContent, rightbarContent, rightbarActive, setRightBarActive, mode, setMode]);

  return <RightBarContext.Provider value={value}>{children}</RightBarContext.Provider>;
};

RightBarContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  history: PropTypes.any.isRequired,
};

export default RightBarContext;
