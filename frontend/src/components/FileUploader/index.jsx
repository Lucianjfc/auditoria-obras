import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import FcButton from '~/components/FcButton';
import FileUploadStore from '../../stores/FileUploaderStore';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import FormField from '../FormField';
import './style.scss';
import { ConfirmDialog } from 'primereact/confirmdialog';

@observer
class FileUploader extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.store = props.store;

    this.state = {
      visibleDialogRemove: false,
      visibleDialogEdit: false,
      rowDataRemove: null,
      showDialog: false,
      arquivo: undefined,
      descricao: undefined,
      tipoArquivo: undefined,
      editingRow: undefined,
      hasFileChanged: false,
      viewFileUrl: undefined,
      showVisualizationDialog: false,
    };

    this._renderUploadButton = this._renderUploadButton.bind(this);
    this._renderUploadDialogContent = this._renderUploadDialogContent.bind(this);
    this._toggleShowDialog = this._toggleShowDialog.bind(this);
    this._renderUploadDialog = this._renderUploadDialog.bind(this);
    this._renderColumns = this._renderColumns.bind(this);
    this._renderTable = this._renderTable.bind(this);
    this._onUploadFile = this._onUploadFile.bind(this);
  }

  componentDidMount() {
    this.props.files && this.store.initialize(this.props.files);
  }

  _renderUploadButton() {
    const chooseOptions =
      this.state.editingRow && !this.state.hasFileChanged && this.state.arquivo
        ? { label: this.state.arquivo.nomeOriginal, icon: 'pi pi-upload' }
        : { label: 'Selecione um Arquivo' };
    return (
      <FileUpload
        ref={this.ref}
        chooseOptions={chooseOptions}
        name={`file-uploader-${new Date().toString()}`}
        accept={this.props.accept}
        maxFileSize={30000000}
        mode={'basic'}
        onSelect={(event) => {
          this.setState({ arquivo: event.files[0], hasFileChanged: true });
        }}
        onClear={() => this.setState({ file: undefined })}
        disabled={this.state.editingRow?.idArquivo}
      />
    );
  }

  updateAttribute(attribute, event) {
    let value = event;
    if (event && event.value) {
      value = event.value;
    }
    if (event && event.target) {
      value = event.target.value;
    }
    const newState = {};
    newState[attribute] = value;
    this.setState(newState);
  }

  _renderUploadDialogContent() {
    const { showFileType } = this.props;
    return (
      <div className="p-fluid p-formgrid p-grid">
        <div className="p-col-12" style={{ marginBottom: '10px' }}>
          {this._renderUploadButton()}
        </div>
        {showFileType && (
          <FormField columns={12} attribute="tipoArquivo" label="Tipo do Arquivo">
            <Dropdown
              onChange={(e) => this.updateAttribute('tipoArquivo', e)}
              placeholder="Selecione um tipo"
              value={
                this.store.tipoArquivoEnum?.length === 1 ? this.store.tipoArquivoEnum[0].value : this.state.tipoArquivo
              }
              optionLabel="text"
              optionValue="value"
              disabled={this.store.tipoArquivoEnum?.length <= 1}
              options={this.store.tipoArquivoEnum}
            />
          </FormField>
        )}
        <FormField columns={12} attribute="descricao" label="Descrição">
          <InputText
            placeholder="Informe a descrição"
            value={this.state.descricao}
            onChange={(e) => this.updateAttribute('descricao', e)}
          />
        </FormField>
      </div>
    );
  }

  _toggleShowDialog(callback) {
    this.setState((oldState) => ({ showDialog: !oldState.showDialog }), callback);
  }

  _renderUploadDialog() {
    return (
      <Dialog
        blockScroll
        header="Novo Upload de Arquivo"
        visible={this.state.showDialog}
        style={{ width: '80vw', maxWidth: '500px' }}
        footer={this._renderUploadDialogFooter()}
        closable={false}
        draggable={false}
      >
        {this._renderUploadDialogContent()}
      </Dialog>
    );
  }

  _renderUploadDialogFooter() {
    const { showFileType } = this.props;
    return (
      <div>
        <FcButton
          disabled={this.store.loading}
          label="Cancelar"
          icon="pi pi-times"
          onClick={() => this._toggleShowDialog(() => this._clearDialogData())}
          className="p-button-text"
        />
        <FcButton
          loading={this.store.loading}
          disabled={!this.state.arquivo || (!this.state.tipoArquivo && showFileType) || this.store.loading}
          label="Enviar"
          icon="pi pi-cloud-upload"
          onClick={
            this.state.editingRow?.idArquivo ? () => this.setState({ visibleDialogEdit: true }) : this._onUploadFile
          }
        />
      </div>
    );
  }

  _renderEditUploadWarningDialog(callback) {
    const message =
      'As alterações foram feitas em um arquivo definitivo, porém não serão persistidas até o ato de salvamento. \nDeseja prosseguir?';

    return (
      <ConfirmDialog
        visible={this.state.visibleDialogEdit}
        message={message}
        header="Editar Arquivo"
        icon="pi pi-info-circle"
        acceptClassName="p-button-warning"
        accept={() => {
          callback && callback();
          this.setState({ visibleDialogEdit: false });
        }}
        onHide={() => this.setState({ visibleDialogEdit: false })}
      />
    );
  }

  _clearDialogData() {
    this.setState(
      {
        arquivo: undefined,
        descricao: undefined,
        tipoArquivo: undefined,
        editingRow: undefined,
        hasFileChanged: false,
      },
      () => {
        this.ref.current.clear();
        this.forceUpdate();
      }
    );
  }

  _onChangeFiles(fileList) {
    const { multiple, onChangeFiles } = this.props;
    let selectedFile = undefined;

    if (fileList && fileList.length) {
      if (multiple) {
        selectedFile = fileList;
      } else {
        selectedFile = fileList[0];
      }
    }

    onChangeFiles(selectedFile);
  }

  _onUploadFile() {
    const callback = (fileList) => {
      this._onChangeFiles(fileList);
      this._toggleShowDialog(() => this._clearDialogData());
    };

    const { arquivo, descricao, tipoArquivo, editingRow, hasFileChanged } = this.state;

    if (editingRow) {
      this.store.editFile(
        { ...editingRow, arquivo, descricao, tipoArquivo },
        editingRow?.key,
        hasFileChanged,
        callback
      );
    } else {
      this.store.uploadFile({ arquivo, descricao, tipoArquivo }, callback);
    }
    this.forceUpdate();
  }

  _renderColumns(columns) {
    return columns.map((col) => <Column key={`col-${col.field}`} {...col} />);
  }

  _renderRemoveFileDialog() {
    const message = `${
      this.state.rowDataRemove.idArquivo ? 'Este arquivo está persistido e será removido permanentemente. ' : ''
    }Você reamente deseja remover este arquivo?`;

    return (
      <ConfirmDialog
        blockScroll
        visible={this.state.visibleDialogRemove}
        message={message}
        header="Excluir Arquivo"
        icon="pi pi-info-circle"
        acceptClassName="p-button-danger"
        accept={() => {
          this.store.removeFile(this.state.rowDataRemove, (fileList) => this._onChangeFiles(fileList));
          this.setState({ visibleDialogRemove: false, rowDataRemove: null });
        }}
        onHide={() => this.setState({ visibleDialogRemove: false, rowDataRemove: null })}
      />
    );
  }

  _editFile(rowData) {
    const editingState = {
      showDialog: true,
      arquivo: {
        ...rowData.arquivo,
        size: 1000,
        name: rowData.arquivo.nomeOriginal,
        type: rowData.arquivo.tipoArquivo,
      },
      descricao: rowData.descricao,
      tipoArquivo: rowData.tipo,
      editingRow: rowData,
    };

    this.setState(editingState);
  }

  _renderTableButtons(rowData, downloadOnly) {
    const { onDownload } = this.props;
    const countDownloadRequest =
      this.props.fileTypesToCount.length !== 0
        ? this.props.fileTypesToCount.includes(rowData.tipo)
        : this.props.countDownloadRequest;

    if (downloadOnly) {
      return (
        <div className="flex gap-2 justify-content-end">
          <FcButton
            type="button"
            tooltip="Visualizar"
            className="p-button-info"
            icon="pi pi-eye"
            onClick={() =>
              this.store.downloadFile(rowData.arquivo, countDownloadRequest, (viewFileUrl) =>
                this.setState({ showVisualizationDialog: true, viewFileUrl })
              )
            }
          />
          <FcButton
            type="button"
            tooltip="Download"
            icon="pi pi-download"
            onClick={() =>
              this.store.downloadFile(
                rowData.arquivo,
                countDownloadRequest,
                undefined,
                onDownload && (() => onDownload(rowData.tipo))
              )
            }
          />
        </div>
      );
    } else {
      return (
        <div className="flex gap-2 justify-content-end">
          <FcButton
            type="button"
            tooltip="Visualizar"
            icon="pi pi-eye"
            className="p-button-info"
            onClick={() =>
              this.store.downloadFile(rowData.arquivo, countDownloadRequest, (viewFileUrl) =>
                this.setState({ showVisualizationDialog: true, viewFileUrl })
              )
            }
          />
          <FcButton
            type="button"
            tooltip="Download"
            icon="pi pi-download"
            tooltipOptions={{ position: 'top' }}
            onClick={() =>
              this.store.downloadFile(
                rowData.arquivo,
                countDownloadRequest,
                undefined,
                onDownload && (() => onDownload(rowData.tipo))
              )
            }
          />
          <FcButton
            type="button"
            tooltip="Editar"
            icon="pi pi-pencil"
            tooltipOptions={{ position: 'top' }}
            onClick={() => this._editFile(rowData)}
          />
          <FcButton
            type="button"
            tooltip="Remover"
            icon="pi pi-trash"
            tooltipOptions={{ position: 'top' }}
            className="p-button-danger"
            onClick={() => this.setState({ visibleDialogRemove: true, rowDataRemove: rowData })}
          />
        </div>
      );
    }
  }

  _renderTable() {
    const { tableColumns, downloadOnly, filterTypes } = this.props;
    const buttonsColumn = {
      style: { width: '100px' },
      body: (rowData) => {
        return this._renderTableButtons(rowData, downloadOnly);
      },
    };

    const columns = [
      {
        style: { width: '30%' },
        field: 'arquivo',
        header: 'Arquivo',
        body: ({ arquivo }) => arquivo.nomeOriginal,
      },
      {
        style: { width: '30%' },
        field: 'tipo',
        header: 'Tipo',
      },
      {
        style: { width: '25%' },
        field: 'descricao',
        header: 'Descrição',
      },
      buttonsColumn,
    ];

    const filteredFilesList = filterTypes
      ? this.store.keyedUploadedFiles.filter(
          (f) =>
            (!filterTypes.included || filterTypes.included.includes(f.tipo)) &&
            (!filterTypes.excluded || !filterTypes.excluded.includes(f.tipo)) &&
            (!f.fase || !filterTypes.filter || filterTypes.filter.values.includes(f[filterTypes.filter.column]))
        )
      : this.store.keyedUploadedFiles;

    return (
      <>
        <DataTable
          rowHover
          value={filteredFilesList}
          emptyMessage="Nenhum arquivo adicionado."
          paginator
          rows={5}
          loading={this.store.loading}
        >
          {this._renderColumns(tableColumns ? [...tableColumns, buttonsColumn] : columns)}
        </DataTable>
      </>
    );
  }

  _renderVisualizationDialog() {
    return (
      <Dialog
        visible={this.state.showVisualizationDialog}
        onHide={() => this.setState({ showVisualizationDialog: false, showFileUrl: undefined })}
        style={{ width: '90vw', height: '90vh' }}
        className="show-file-overflow-fix"
        draggable={false}
      >
        {this.state.viewFileUrl && this._renderVisualizationContent()}
      </Dialog>
    );
  }

  _renderVisualizationContent() {
    return <iframe frameBorder="0" style={{ width: '100%', height: '100%' }} src={this.state.viewFileUrl}></iframe>;
  }

  render() {
    const { multiple, downloadOnly } = this.props;
    return (
      <div className="p-fluid p-formgrid p-grid">
        {!downloadOnly && (
          <div className="p-col-3">
            <FcButton
              label="Adicionar Arquivo"
              icon="pi pi-plus"
              type="button"
              style={{ marginBottom: '10px' }}
              onClick={() => this._toggleShowDialog()}
              disabled={!multiple && this.store.keyedUploadedFiles.length > 0}
            />
          </div>
        )}
        <div className="p-col-12">{this._renderTable()}</div>
        {this._renderUploadDialog()}
        {this._renderVisualizationDialog()}
        {this.state.visibleDialogEdit && this._renderEditUploadWarningDialog(() => this._onUploadFile())}
        {this.state.visibleDialogRemove && this._renderRemoveFileDialog()}
      </div>
    );
  }
}

FileUploader.defaultProps = {
  multiple: false,
  downloadOnly: false,
  accept: '.pdf',
  showFileType: true,
  countDownloadRequest: false,
  fileTypesToCount: [],
};

FileUploader.propTypes = {
  multiple: PropTypes.bool,
  tableColumns: PropTypes.any,
  store: PropTypes.instanceOf(FileUploadStore).isRequired,
  onChangeFiles: PropTypes.func,
  downloadOnly: PropTypes.bool,
  files: PropTypes.any,
  showFileType: PropTypes.bool,
  accept: PropTypes.string,
  filterTypes: PropTypes.object,
  fileTypesToCount: PropTypes.object,
  countDownloadRequest: PropTypes.bool,
  onDownload: PropTypes.func,
};

export default FileUploader;
