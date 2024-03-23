/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect, useRef } from 'react';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import '../App.scss';

import PropTypes from 'prop-types';
import AppStore from '~/stores/AppStore';

export const RTLContext = React.createContext();

const Template = ({ children }) => {
  const notification = useRef();

  const getNotificationComponent = () => {
    return notification.current;
  };

  useEffect(() => {
    if (!AppStore.notificationRefFunction) {
      AppStore.setNotificationRefFunction(getNotificationComponent);
    }
  }, []);

  return (
    <RTLContext.Provider>
      <div className="w-full flex flex-column">{children}</div>
    </RTLContext.Provider>
  );
};

Template.propTypes = {
  children: PropTypes.any,
};

export default Template;
