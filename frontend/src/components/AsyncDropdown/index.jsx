import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Dropdown } from 'primereact/dropdown';
import { Skeleton } from 'primereact/skeleton';
import AsyncDropDownStore from '../../stores/AsyncDropdownStore';

@observer
class AsyncDropdown extends React.Component {
  store;
  constructor(props) {
    super(props);
    this.store = props.store;

    this.state = {
      filterTimeout: null,
    };

    this._innerOnChange = this._innerOnChange.bind(this);
    this._onFilter = this._onFilter.bind(this);
    this._renderItemTemplate = this._renderItemTemplate.bind(this);
  }

  componentDidMount() {
    this.store.initialize(this.props.value, undefined, this.props.defaultValue);
  }

  _innerOnChange(e) {
    const targetValue = e.target ? e.target.value : e;
    const fullItem = this.store.getItemFromValue(targetValue);
    this.props.onChange(this.props.id, fullItem);
  }

  _onFilter(e) {
    this.store.beforeFilter(e);
  }

  _renderItemTemplate(item) {
    const searchElement = document.getElementById(this.props.id);
    const maxWidth = searchElement ? searchElement.clientWidth - 80 : 500;
    return (
      <div style={{ maxWidth: `${maxWidth}px`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {this.state.loading ? (
          <div className="p-d-flex p-ai-center p-p-2" style={{ height: '20px' }}>
            <Skeleton width={'100%'} height="1rem" />
          </div>
        ) : (
          item.label
        )}
      </div>
    );
  }

  render() {
    return (
      <Dropdown
        showClear
        {...this.props}
        optionLabel="label"
        optionValue="value"
        filter
        showFilterClear
        filterBy={'empty'}
        filterMatchMode={'notEquals'}
        onFilter={this._onFilter}
        emptyMessage="Nenhum registro encontrado"
        emptyFilterMessage="Nenhum registro encontrado"
        value={this.props.value}
        options={this.store.keyedList}
        onChange={this._innerOnChange}
        itemTemplate={this._renderItemTemplate}
        disabled={this.props.disabled}
      />
    );
  }
}

AsyncDropdown.propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  defaultValue: PropTypes.object,
  store: PropTypes.objectOf(AsyncDropDownStore).isRequired,
};

export default AsyncDropdown;
