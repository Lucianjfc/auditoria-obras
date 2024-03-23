import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import { observer } from 'mobx-react';
import { TabPanel, TabView } from 'primereact/tabview';
import { Badge } from 'primereact/badge';
@observer
class CloseableTabView extends React.Component {
  constructor(props) {
    super(props);
    this.indexTabClosed = undefined;
    this.tabChanged = false;
    this.renderTabs = this.renderTabs.bind(this);
  }

  tabHeaderITemplate = () => {
    return (
      <i className="pip-overlay-badge" style={{ fontSize: '2rem' }}>
        show<Badge severity="danger"></Badge>
      </i>
    );
  };

  renderTabs() {
    const { data } = this.props;
    var tabComponents = [];

    data.forEach((element) => {
      element &&
        tabComponents.push(
          <TabPanel
            key={element.id}
            closable={element.closable}
            header={
              <span className="p-overlay-badge" style={{ paddingRight: '5px', fontSize: 'large' }}>
                {element.header} {!!element?.badgeCount && <Badge severity="danger"></Badge>}
              </span>
            }
          >
            {element.content}
          </TabPanel>
        );
    });

    return tabComponents;
  }

  switchTab(e) {
    const { index } = e;

    if (!this.indexTabClosed) {
      this.props.setActiveIndex(index);
    } else if (!this.tabChanged) {
      this.tabChanged = true;
    } else {
      if (this.props.activeIndex === this.indexTabClosed) {
        this.props.setActiveIndex(index);
      }
      this.indexTabClosed = undefined;
      this.tabChanged = false;
    }
  }

  tabClose(e) {
    this.indexTabClosed = e.index;
    const handleIndexTabClosed = this.props.handleIndexTabClosed;
    handleIndexTabClosed && handleIndexTabClosed(e.index);
  }

  render() {
    return (
      <TabView
        {...this.props}
        activeIndex={this.props.activeIndex}
        onTabChange={(e) => this.switchTab(e)}
        onTabClose={(e) => this.tabClose(e)}
      >
        {this.renderTabs()}
      </TabView>
    );
  }
}

CloseableTabView.propTypes = {
  id: PropTypes.string,
  data: PropTypes.array.isRequired,
  activeIndex: PropTypes.any,
  setActiveIndex: PropTypes.func,
  handleIndexTabClosed: PropTypes.func,
};

export default CloseableTabView;
