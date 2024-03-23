import React from 'react';
import PropTypes from 'prop-types';
import { BreadCrumb } from 'primereact/breadcrumb';

const AppBreadCrumb = (props) => {
  const getHomeUrl = () => {
    const splited = document.location.href.split('#');
    return splited.length >= 1 ? splited[0] : '/';
  };

  const homeBreadCrumb = { icon: 'pi pi-home' };

  const addPrefixUrlToItems = (items = []) => {
    return items.map((item) => {
      if (item.url) {
        item.url = `${getHomeUrl()}#${item.url}`;
      }
      return item;
    });
  };

  return (
    <div>
      <BreadCrumb model={addPrefixUrlToItems(props.items)} home={homeBreadCrumb} />
    </div>
  );
};

AppBreadCrumb.propTypes = {
  items: PropTypes.array,
};

export default AppBreadCrumb;
