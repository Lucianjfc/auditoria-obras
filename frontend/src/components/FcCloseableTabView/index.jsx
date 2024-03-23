import './style.scss';
import React, { useState, useEffect, useRef } from 'react';
import 'primeicons/primeicons.css';
import PropTypes from 'prop-types';
import { Badge } from 'primereact/badge';
import { getValue } from '../../utils/utils';
import RightBarContext from '../../contexts/RightBarContext';
import { useContext } from 'react';

const SIDE_AUTO_SCROLL_SIZE = 800;

const FcCloseableTabView = ({ tabs, onClose, activeTabIndex, onChangeTab, fixedFirstTab, badgeSeverity }) => {
  const [firstRender, setFirstRender] = useState(true);
  const [removingGuide, setRemovingGuide] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const tabListRef = useRef(null);
  const tabListContainerRef = useRef(null);
  const prevLength = useRef();
  const { rightbarActive, setRightBarActive } = useContext(RightBarContext);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
    } else if (prevLength.current + 1 === tabs.length && !removingGuide) {
      onChangeTab && onChangeTab(tabs[tabs.length - 1]);
    } else {
      setRemovingGuide(false);
    }

    const onScreenResizeCallback = () => {
      const tabListWidth = tabListRef?.current?.offsetWidth ?? 0;
      const tabListContainerWidth = tabListRef?.current?.parentNode?.offsetWidth ?? 0;
      setIsScrollable(tabListWidth > tabListContainerWidth);
    };
    window.addEventListener('resize', onScreenResizeCallback);
    onScreenResizeCallback();
  }, [tabs]);

  useEffect(() => {
    prevLength.current = tabs.length;
    rightbarActive && setRightBarActive(false);
  }, [tabs]);

  useEffect(() => {
    rightbarActive && setRightBarActive(false);
    const tabListContainer = tabListContainerRef?.current;
    const activeTab = tabListContainer.querySelector('.tab.isActive');
    const fixedTab = tabListContainer.querySelector('.tab-fixed');

    if (tabListContainer && activeTab && fixedTab && activeTab !== fixedTab) {
      const activeTabIndexPosition = activeTab.offsetLeft;
      const containerWidth = tabListContainer.clientWidth;
      const fixedTabPosition = fixedTab.offsetLeft;
      const activeTabIndexRightPosition = activeTabIndexPosition + activeTab.offsetWidth;

      if (activeTabIndexPosition < fixedTabPosition) {
        tabListContainer.scrollTo({
          left: activeTabIndexPosition - 10,
          behavior: 'smooth',
        });
      } else if (activeTabIndexRightPosition > containerWidth + tabListContainer.scrollLeft - fixedTab.clientWidth) {
        tabListContainer.scrollTo({
          left: activeTabIndexPosition + activeTab.offsetWidth + fixedTab.clientWidth - containerWidth + 10,
          behavior: 'smooth',
        });
      }
    } else if (activeTab) {
      tabListContainer.scrollTo({
        left: activeTab.offsetLeft,
        behavior: 'smooth',
      });
    }
  }, [activeTabIndex]);

  const handleScrollLeft = () => {
    tabListContainerRef.current.scrollBy({
      left: -SIDE_AUTO_SCROLL_SIZE,
      behavior: 'smooth',
    });
  };

  const handleScrollRight = () => {
    tabListContainerRef.current.scrollBy({
      left: SIDE_AUTO_SCROLL_SIZE,
      behavior: 'smooth',
    });
  };

  const handleTabClick = (tab) => {
    onChangeTab && onChangeTab(tab);
  };

  const handleTabClose = async (event, tabClosed) => {
    if (onClose && tabClosed.closeable) {
      const index = tabs.indexOf(tabClosed);
      const nextIndex = index + 1 === tabs.length ? index - 1 : index + 1;
      const nextTab = tabs[nextIndex] || tabs[index - 1];
      setRemovingGuide(true);
      event.stopPropagation();
      try {
        await onClose(tabClosed);
        if (activeTabIndex === index) {
          onChangeTab && onChangeTab(nextTab);
        } else {
          onChangeTab && onChangeTab(tabs[activeTabIndex]);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const renderTabIcon = (tab, idx) => {
    if (tab.closeable) {
      return 'pi pi-times tab-icon-times';
    } else if (fixedFirstTab && idx === 0) {
      return 'pi pi-lock tab-icon-lock';
    } else {
      return '';
    }
  };

  return (
    <>
      <div className="tabs">
        {isScrollable && <i className="arrow-icon pi pi-arrow-left" onClick={() => handleScrollLeft()} />}
        <div className="tab-list-container" ref={tabListContainerRef}>
          <div className="tab-list" ref={tabListRef}>
            {tabs?.map((tab, idx) => (
              <div
                key={`tab-${tab.id ?? idx}`}
                className={`tab ${tab === tabs[activeTabIndex] && 'isActive'} ${
                  fixedFirstTab && idx === 0 && 'tab-fixed'
                }`}
                onClick={() => handleTabClick(tab)}
              >
                <div className="tab-header" key={`header-${idx}`}>
                  <span className={`${tab?.badgeCount && 'p-overlay-badge badge-change'}`}>
                    {getValue(tab?.header)}
                    {!!tab?.badgeCount && (
                      <Badge severity={badgeSeverity} style={{ right: -9 }} value={tab?.badgeCount} />
                    )}
                  </span>
                  <i
                    className={renderTabIcon(tab, idx)}
                    style={{ paddingLeft: tab.badgeCount ? '0.5rem' : '' }}
                    target={tab}
                    onClick={(event) => handleTabClose(event, tab)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        {isScrollable && <i className="arrow-icon pi pi-arrow-right" onClick={() => handleScrollRight()} />}
      </div>
      {tabs?.map((tab, idx) => (
        <div
          className="tab-content"
          key={`content-${tab.id ?? idx}`}
          style={idx === activeTabIndex ? {} : { display: 'none' }}
        >
          {tab?.content}
        </div>
      ))}
    </>
  );
};

FcCloseableTabView.defaultProps = {
  tabs: [],
  activeTabIndex: 0,
  fixedFirstTab: false,
  badgeSeverity: 'danger',
};

FcCloseableTabView.propTypes = {
  tabs: PropTypes.array,
  onClose: PropTypes.func,
  activeTabIndex: PropTypes.number,
  onChangeTab: PropTypes.func,
  fixedFirstTab: PropTypes.bool,
  badgeSeverity: PropTypes.string,
};

export default FcCloseableTabView;
