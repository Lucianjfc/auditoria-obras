/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect, useRef } from 'react';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import '../App.scss';
import './style.scss';
import AppStore from '~/stores/AppStore';
import PropTypes from 'prop-types';
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
      <div
        className="w-full border-round font-bold flex align-items-center justify-content-star flex gap-4"
        style={{ backgroundColor: '#3f51b5', color: ' #fafafa', height: '4vh' }}
      />
      <div className="content w-full flex flex-column">{children}</div>
      <Footer className="footer" />
    </div>
  );
};

Template.propTypes = {
  children: PropTypes.any,
};

export default Template;
