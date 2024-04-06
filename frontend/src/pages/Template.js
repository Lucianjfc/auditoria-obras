/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect, useRef } from 'react';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import '../App.scss';
import './style.scss';

import PropTypes from 'prop-types';
import AppStore from '~/stores/AppStore';
import { Footer } from '~/components/Footer/footer';

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
    <div className="container">
      <div className="header h-4rem w-full bg-primary border-round font-bold m-2 flex align-items-center justify-content-start">
        Header
      </div>
      <div className="content w-full flex flex-column">{children}</div>
      <Footer className="footer" />
    </div>
  );
};

Template.propTypes = {
  children: PropTypes.any,
};

export default Template;
