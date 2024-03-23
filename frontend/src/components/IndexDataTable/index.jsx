import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import { DataTable } from 'primereact/datatable';
import { MultiSelect } from 'primereact/multiselect';
import { Column } from 'primereact/column';

@observer
class IndexDataTable extends React.Component {
  columns = [];
  constructor(props) {
    super(props);

    this.state = {
      selectedColumns: [],
      columnsToToggle: [],
    };

    this._renderColumns = this._renderColumns.bind(this);
    this.onColumnToggle = this.onColumnToggle.bind(this);
  }

  componentDidMount() {
    this.columns = this.props.columns;
    const selectedColumns = this.columns.filter((col) => col.header).map((col) => col.field);
    const columnsToToggle = this.columns
      .filter((col) => col.header)
      .map((col, idx) => {
        const { field, header } = col;
        return { field, header, disabled: idx === 0 };
      });
    this.setState({ selectedColumns, columnsToToggle });
    if (localStorage.getItem(window.location.hash)) {
      this.setState({ selectedColumns: localStorage.getItem(window.location.hash)?.split(',') });
    }
  }

  onColumnToggle(event) {
    let selectedColumns = event.value;
    if (!selectedColumns.includes(this.state.columnsToToggle[0].field)) {
      selectedColumns = [this.state.columnsToToggle[0].field, ...selectedColumns];
    }

    this.setState({ selectedColumns });

    this.props.setColumnsToExport && this.props.setColumnsToExport(selectedColumns);

    localStorage.setItem(window.location.hash, selectedColumns);
  }

  _renderColumns() {
    const totalRemainingSize = `calc(100% - ${this.columns.map((col) => col.style?.width ?? '0%').join(' - ')}))`;

    const remainingSizePerColumn = `calc((${totalRemainingSize} + ${this.columns
      .filter((col) => col.header && !this.state.selectedColumns.includes(col.field))
      .map((col) => col.style?.width ?? '0%')
      .join(' + ')})/${this.state.selectedColumns?.length ?? 1})`;

    if (this.props.disableColumnToggle)
      return this.columns.map((col) => (
        <Column
          key={`col-${col.field}`}
          {...col}
          style={
            col.header
              ? { ...col.style, width: `calc(${col.style?.width ?? '0%'} + ${remainingSizePerColumn})` }
              : col.style
          }
        />
      ));

    return this.columns
      .filter((col) => !col.header || this.state.selectedColumns.includes(col.field))
      .map((col) => (
        <Column
          key={`col-${col.field}`}
          {...col}
          style={
            col.header
              ? { ...col.style, width: `calc(${col.style?.width ?? '0%'} + ${remainingSizePerColumn})` }
              : col.style
          }
        />
      ));
  }

  _renderColumnToggler() {
    return (
      <span style={{ textAlign: 'right' }}>
        <MultiSelect
          value={this.state.selectedColumns}
          options={this.state.columnsToToggle}
          optionLabel="header"
          optionValue="field"
          onChange={this.onColumnToggle}
          style={{ width: '20em' }}
        />
      </span>
    );
  }

  _renderHeader() {
    const { disableColumnToggle, header } = this.props;
    return (
      <div className="table-header">
        {header ?? <div />}
        {!disableColumnToggle && this._renderColumnToggler()}
      </div>
    );
  }

  render() {
    return (
      <DataTable rowHover {...this.props} header={this._renderHeader()}>
        {this._renderColumns()}
      </DataTable>
    );
  }
}

IndexDataTable.defaultProps = {
  dataKey: 'id',
  className: 'datatable-responsive',
  paginator: true,
  lazy: true,
  rows: 10,
  emptyMessage: 'Nenhum dado encontrado.',
  resizableColumns: true,
  columnResizeMode: 'fit',
  paginatorTemplate: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport',
  currentPageReportTemplate: '{first} - {last} de {totalRecords} registros',
  disableColumnToggle: false,
};

IndexDataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  disableColumnToggle: PropTypes.bool,
  header: PropTypes.any,
  setColumnsToExport: PropTypes.func,
};

export default IndexDataTable;
