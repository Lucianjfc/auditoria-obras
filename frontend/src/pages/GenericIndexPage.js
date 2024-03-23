import React from 'react';
import { Column } from 'primereact/column';
import { ConfirmDialog } from 'primereact/confirmdialog';
import FcButton from '~/components/FcButton';
import { Dropdown } from 'primereact/dropdown';
import { PrimeIcons } from 'primereact/api';
import moment from 'moment';
import PropTypes from 'prop-types';
import { DATE_FORMAT_REPORT } from '../utils/date';
import { getDescendantProp } from '../utils/utils';

class GenericIndexPage extends React.Component {
  store;

  constructor(props, accessPermission = undefined) {
    super(props);

    this.state = {
      modalExportVisible: false,
      columnsToExport: [],
    };

    this.accessPermission = accessPermission;
    this.filterColumnsToExport = this.filterColumnsToExport.bind(this);
    this.setColumnsToExport = this.setColumnsToExport.bind(this);
    this.onPage = this.onPage.bind(this);
    this.onSort = this.onSort.bind(this);
    this.getMoneyFields = this.getMoneyFields.bind(this);
    this.defineColumnStyles = this.defineColumnStyles.bind(this);
    this.getDefaultTableProps = this.getDefaultTableProps.bind(this);
    this.formatList = this.formatList.bind(this);
    this.exportCSV = this.exportCSV.bind(this);
    this.exportPdf = this.exportPdf.bind(this);
    this.exportExcel = this.exportExcel.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.renderColumns = this.renderColumns.bind(this);
    this.getReadPermission = this.getReadPermission.bind(this);
    this.getWritePermission = this.getWritePermission.bind(this);
  }

  setColumnsToExport(columnsToExport) {
    this.setState({ columnsToExport });
  }

  getReadPermission() {
    return this.accessPermission && [this.accessPermission.readPermission, this.accessPermission.writePermission];
  }

  getWritePermission() {
    return this.accessPermission && [this.accessPermission.writePermission];
  }

  renderColumns(columns) {
    return columns.map((col) => <Column key={`col-${col.field}`} {...col} />);
  }

  onPage(event) {
    const page = (event.page ?? 0) + 1;
    const pagination = JSON.parse(JSON.stringify(this.store.pagination));
    pagination.page.index = page;
    this.store.setPagination(pagination);
    this.store.load(pagination);
  }

  onSort(event = {}) {
    const { sortField, sortOrder } = event;
    if (sortField && sortOrder) {
      const params = Object.assign({}, this.store.advancedSearchParams);
      params['sort'] = {
        by: sortField,
        order: sortOrder > 0 ? 'asc' : 'desc',
      };
      this.store.setPagination(params);
      this.store.load(params);
    }
  }

  getFirstFromPagination() {
    const { index, size } = this.store.pagination.page;
    return size * (index - 1);
  }

  confirmRemove(id) {
    const { deleteRow, reloadTableData } = this.store;

    return (
      <ConfirmDialog
        blockScroll
        visible={this.store.isConfirmDialogVisible}
        message="Você realmente deseja excluir o registro selecionado?"
        header="Excluir registro"
        icon="pi pi-exclamation-triangle"
        acceptClassName="p-button-danger"
        accept={() => {
          deleteRow(id, reloadTableData);
          this.store.toggleShowConfirmDialog();
        }}
        onHide={() => this.store.toggleShowConfirmDialog()}
      />
    );
  }

  getHomeBreadCrumb() {
    return { icon: 'pi pi-home', url: '/' };
  }

  getDefaultTableProps() {
    return {
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
      onPage: this.onPage,
      first: this.getFirstFromPagination(),
      totalRecords: this.store.pagination.total ?? 0,
      onSort: (e) => this.onSort(e),
      sortField: this.store.advancedSearchParams['sort'].by,
      sortOrder: this.store.advancedSearchParams['sort'].order === 'asc' ? 1 : -1,
    };
  }

  async exportCSV(columns, label, loadFirstPage = false) {
    const filteredColumns = this.filterColumnsToExport(columns);
    await this.store.loadExportList(loadFirstPage);

    let csv = '';
    csv += filteredColumns.map((e) => e.field).join(',') + '\n';

    this.store.exportList.forEach((e) => {
      const csv_partial = [];
      filteredColumns.forEach((column) => {
        if (e[column.field] != null) {
          let value;

          if (column.simpleBody) value = column.simpleBody(e);
          else if (column.body) value = column.body(e);
          else value = this.checkBoolean(e[column.field]);

          csv_partial.push(value);
        } else {
          csv_partial.push('');
        }
      });

      csv += csv_partial.join(',') + '\n';
    });

    const blob = new Blob([csv], {
      type: 'application/csv;charset=utf-8;',
    });

    const CSV_EXTENSION = '.csv';
    const timestamp = moment().format(DATE_FORMAT_REPORT);
    const filename = label.trim() + '_' + timestamp + CSV_EXTENSION;

    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', filename);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async exportPdf(columns, label, loadFirstPage = false) {
    const filteredColumns = this.filterColumnsToExport(columns);

    await this.store.loadExportList(loadFirstPage);

    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then(() => {
        const exportColumns = filteredColumns.map((col) => ({ title: col.header, dataKey: col.field }));
        const doc = new jsPDF.default(0, 0);
        const PDF_EXTENSION = '.pdf';
        const timestamp = moment().format(DATE_FORMAT_REPORT);
        const filename = label.trim() + '_' + timestamp + PDF_EXTENSION;
        const myTable = this.formatList(this.store.exportList, filteredColumns);
        const moneyFields = this.getMoneyFields(myTable[0]);
        const columnStyles = this.defineColumnStyles(moneyFields);
        doc.autoTable({
          columns: exportColumns,
          body: myTable,
          columnStyles: columnStyles,
        });
        doc.save(filename);
      });
    });
  }

  filterColumnsToExport(columns) {
    let columnsToExport = this.state.columnsToExport ?? [];
    const mappedColumns = columns.map((col) => col.field).filter((col) => col !== undefined);
    columnsToExport = columnsToExport.length > 0 ? columnsToExport : mappedColumns;

    return columns.filter((col) => columnsToExport.includes(col.field));
  }

  getMoneyFields(data) {
    const char = '"\\u00A0"'; // caracter em unicode que representa espaço em branco
    let moneyFields = [];
    for (const field in data) {
      const value = data[field];
      if (typeof value === 'string') {
        const splittedField = value.split(decodeURIComponent(JSON.parse(char)));
        if (splittedField.length === 2 && splittedField[0] === 'R$') {
          const formattedNumber = splittedField[1].replace(new RegExp('\\.', 'g'), '').replace(',', '.');
          const parsedNumber = Number(formattedNumber);
          if (!isNaN(parsedNumber)) {
            moneyFields.push(field);
          }
        }
      }
    }
    return moneyFields;
  }

  defineColumnStyles(colNames) {
    const styles = {};
    colNames.forEach((elem) => {
      styles[elem] = {
        cellWidth: 'wrap',
      };
    });
    return styles;
  }

  async exportExcel(columns, label, loadFirstPage = false) {
    const filteredColumns = this.filterColumnsToExport(columns);

    await this.store.loadExportList(loadFirstPage);
    import('xlsx').then((xlsx) => {
      const mySheet = this.formatList(this.store.exportList, filteredColumns);
      const worksheet = xlsx.utils.json_to_sheet(mySheet);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, label.trim());
    });
  }

  saveAsExcelFile(buffer, label) {
    import('file-saver').then((FileSaver) => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const EXCEL_EXTENSION = '.xlsx';
      const timestamp = moment().format(DATE_FORMAT_REPORT);
      const fileName = label + '_' + timestamp + EXCEL_EXTENSION;
      const data = new Blob([buffer], {
        type: EXCEL_TYPE,
      });
      FileSaver.saveAs(data, fileName);
    });
  }

  formatList(list, columns) {
    const formattedList = list.map((object) => {
      const obj = {};
      columns.forEach((column) => {
        const field = column.field;
        if (field) {
          const value = field.includes('.') ? getDescendantProp(object, field) : object[field];
          if (column.simpleBody) obj[field] = column.simpleBody(object);
          else if (column.body) obj[field] = column.body(object);
          else obj[field] = this.checkBoolean(value);
        }
      });
      return obj;
    });

    return formattedList;
  }

  checkBoolean(value) {
    if (typeof value === 'boolean') {
      if (value) return 'Sim';
      else return 'Não';
    } else return value;
  }

  renderTableExportModalContent(columns, label, loadFirstPage = false) {
    const selectOptions = [
      { label: '10 registros', value: 10 },
      { label: '25 registros', value: 25 },
      { label: '50 registros', value: 50 },
      { label: '100 registros', value: 100 },
    ];
    return (
      <div>
        <div>
          <span className="p-mr-3">Selecione a quantidade de registros que deseja exportar:</span>
          <Dropdown
            value={this.store.rangeExportData}
            options={selectOptions}
            optionLabel="label"
            onChange={(e) => this.store.setRangeExportData(e.value)}
            placeholder="Selecione a quantidade de registros"
          />
        </div>
        <div>
          <div className="p-col-12 p-mb-5 export-buttons flex">
            <div className="flex" style={{ cursor: 'default' }}>
              <FcButton
                type="button"
                label="CSV"
                icon="pi pi-file-o"
                onClick={async () => await this.exportCSV(columns, label, loadFirstPage)}
                className="p-mr-2"
              />
            </div>
            <div className="flex" style={{ cursor: 'default' }}>
              <FcButton
                type="button"
                label="XLS"
                icon="pi pi-file-excel"
                onClick={async () => await this.exportExcel(columns, label, loadFirstPage)}
                className="p-button-success p-mr-2"
              />
            </div>
            <div className="flex" style={{ cursor: 'default' }}>
              <FcButton
                type="button"
                label="PDF"
                icon="pi pi-file-pdf"
                onClick={async () => await this.exportPdf(columns, label, loadFirstPage)}
                className="p-button-danger p-mr-2"
              />
            </div>
          </div>
          <div>
            <i className="pi pi-exclamation-triangle p-mr-2"></i>
            <span>
              Você irá exportar {this.store.rangeExportData} registros. Pode não ser a quantidade total de registros!
            </span>
          </div>
        </div>
      </div>
    );
  }

  renderTableDataExport(columns, entityName, loadFirstPage = false) {
    return (
      <div>
        <ConfirmDialog
          blockScroll
          visible={this.state.modalExportVisible}
          onHide={this.closeDialog}
          message={this.renderTableExportModalContent(columns, entityName, loadFirstPage)}
          header={<strong className="p-mr-2">Exportar Dados</strong>}
          footer=" "
          accept=" "
          reject=" "
        />
        <FcButton
          className="p-button"
          style={{ marginBottom: '5px' }}
          label="Exportar Dados"
          icon={PrimeIcons.DOWNLOAD}
          onClick={this.openDialog}
        />
      </div>
    );
  }

  openDialog() {
    this.setState({ modalExportVisible: true });
  }

  closeDialog() {
    this.setState({ modalExportVisible: false });
  }

  pushUrlToHistory(url) {
    url && this.props.history.push(url);
  }
}

GenericIndexPage.propTypes = {
  history: PropTypes.any,
};

export default GenericIndexPage;
