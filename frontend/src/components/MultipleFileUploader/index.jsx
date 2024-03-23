import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import { FileUpload } from 'primereact/fileupload';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import FileUploadStore from '../../stores/MultipleFileUploaderStore';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import './style.scss';
import { ConfirmDialog } from 'primereact/confirmdialog';
import moment from 'moment';
import 'moment/locale/pt-br';
import { getValue, getValueByKey } from '../../utils/utils';
import FcButton from '../FcButton';
import { Dialog } from 'primereact/dialog';
import HelpIcon from './HelpIcon';

@observer
class MultipleFileUploader extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.store = props.store;

    this.state = {
      visibleDialogRemove: false,
      rowDataRemove: null,
      viewFileUrl: undefined,
      showVisualizationDialog: false,
      arquivos: [],
    };

    this._renderColumns = this._renderColumns.bind(this);
    this._renderTable = this._renderTable.bind(this);
    this._renderDropdownTipo = this._renderDropdownTipo.bind(this);
    this._renderInputDescricao = this._renderInputDescricao.bind(this);
    this._renderTableButtons = this._renderTableButtons.bind(this);
    this._onUploadFile = this._onUploadFile.bind(this);
  }

  componentDidMount() {
    this.store.removeFilesState = () => this.setState({ arquivos: [] });
    const { files } = this.props;

    files && this.store.initialize(this.props.files);

    const filesToUpdateKey = [];
    const uploadFiles = this.store.keyedUploadedFiles.map((file, idx) => {
      const keyValue = moment().toISOString() + idx;
      const keydFile = { ...file, key: keyValue };
      filesToUpdateKey.push(keydFile);
      const arquivo = {
        key: keyValue,
        arquivo: file.arquivo?.nomeOriginal,
        dataEnvio: file.dataEnvio,
        descricao: file.descricao,
        tipo: file.tipo,
      };

      if (file?.fase) arquivo.fase = file?.fase;

      return arquivo;
    });

    this.store.updateUploadedFilesKeys(filesToUpdateKey);

    this.setState({ arquivos: uploadFiles });
  }

  _findByKey(list, key) {
    return list.find((element) => element.key === key);
  }

  _onUploadFile(arquivo, callbackSuccess, callbackFail) {
    const callback = (fileList) => {
      this._onChangeFiles(fileList);
      callbackSuccess();
    };
    this.store.uploadFile(
      { arquivo: arquivo.file, descricao: arquivo.descricao, tipoArquivo: arquivo.tipo, key: arquivo.key },
      callback,
      callbackFail
    );

    this.forceUpdate();
  }

  _getFilteredList() {
    const { filterTypes } = this.props;
    return filterTypes
      ? this.state.arquivos.filter(
          (f) =>
            ((!filterTypes.included || filterTypes.included.includes(f.tipo)) &&
              (!filterTypes.excluded || !filterTypes.excluded.includes(f.tipo)) &&
              (!f.fase || !filterTypes.filter || filterTypes.filter.values.includes(f[filterTypes.filter.column]))) ||
            !f.tipo
        )
      : this.state.arquivos;
  }

  _onChangeFiles(fileList) {
    const { onChangeFiles } = this.props;
    onChangeFiles(fileList);
  }

  _renderColumns(columns) {
    return columns.map((col) => <Column key={`col-${col.field}`} {...col} />);
  }

  _renderRemoveFileDialog() {
    const message = `${
      this.state.rowDataRemove.idArquivo ? 'Este arquivo está persistido e será removido permanentemente. ' : ''
    }Você reamente deseja remover este arquivo?`;

    let arquivos = [...this.state.arquivos];
    const arquivo = this._findByKey(this.store.keyedUploadedFiles, this.state.rowDataRemove?.key);
    arquivos = arquivos.filter((arquivo) => {
      return arquivo.key !== this.state.rowDataRemove?.key;
    });
    return (
      <ConfirmDialog
        visible={this.state.visibleDialogRemove}
        message={message}
        header="Excluir Arquivo"
        icon="pi pi-info-circle"
        acceptClassName="p-button-danger"
        accept={() => {
          this.store.removeFile(arquivo, (fileList) => this._onChangeFiles(fileList));
          this.setState({ visibleDialogRemove: false, rowDataRemove: null, arquivos });
        }}
        onHide={() => this.setState({ visibleDialogRemove: false, rowDataRemove: null })}
      />
    );
  }

  _renderDropdownTipo(key, options) {
    const value =
      this._findByKey(this.store.uploadedFiles, key)?.tipo ??
      this._findByKey(this.state.arquivos, key)?.tipo ??
      options?.rowData?.tipo;
    return (
      <div className="dropdown-demo">
        <Dropdown
          value={value}
          className="sm:w-26rem lg:w-17rem xl:w-30rem"
          options={this._sortRequiredFiles(this.store.tipoArquivoEnum)}
          optionLabel="text"
          optionValue="value"
          onChange={(e) => {
            this.store.updateFiles(key, 'tipo', e.value, this._findByKey(this.state.arquivos, key), (fileList) =>
              this._onChangeFiles(fileList)
            );
            this.forceUpdate();
          }}
          placeholder="Selecione um tipo"
        />
      </div>
    );
  }

  _renderInputDescricao(key, options) {
    const inputRef = React.createRef();
    const value =
      this._findByKey(this.store.uploadedFiles, key)?.descricao ??
      this._findByKey(this.state.arquivos, key)?.descricao ??
      options?.rowData?.descricao;
    return (
      <InputText
        ref={inputRef}
        type="text"
        defaultValue={value}
        className="sm:w-26rem lg:w-17rem xl:w-30rem"
        style={{ minWidth: '20rem' }}
        placeholder="Informe a descrição"
        disabled={this.props.downloadOnly}
        onChange={(e) => {
          this.store.updateFiles(
            key,
            'descricao',
            e.target.value,
            this._findByKey(this.state.arquivos, key),
            (fileList) => this._onChangeFiles(fileList),
            inputRef
          );
          this.forceUpdate();
        }}
      />
    );
  }

  _renderTableButtons(rowData) {
    const { downloadOnly, countDownloadRequest } = this.props;
    const arquivo = this._findByKey(this.store.keyedUploadedFiles, rowData.key);
    const nomeOriginal = arquivo?.arquivo?.nomeOriginal;

    if (downloadOnly) {
      return (
        <div className="flex gap-2 justify-content-end">
          {(nomeOriginal?.endsWith('.pdf') ||
            nomeOriginal?.endsWith('.png') ||
            nomeOriginal?.endsWith('.jpeg') ||
            nomeOriginal?.endsWith('.jpg')) && (
            <FcButton
              type="button"
              tooltip="Visualizar"
              icon="pi pi-eye"
              className="p-button-info"
              onClick={() => {
                const arquivo = this._findByKey(this.store.keyedUploadedFiles, rowData.key);
                this.store.downloadFile(arquivo.arquivo, countDownloadRequest, (viewFileUrl) =>
                  this.setState({ showVisualizationDialog: true, viewFileUrl })
                );
              }}
            />
          )}
          <FcButton
            type="button"
            tooltip="Download"
            icon="pi pi-download"
            onClick={() => {
              const arquivo = this._findByKey(this.store.keyedUploadedFiles, rowData.key);
              this.store.downloadFile(arquivo.arquivo, countDownloadRequest);
            }}
          />
        </div>
      );
    } else {
      return (
        <div className="flex gap-2 justify-content-end">
          {(nomeOriginal?.endsWith('.pdf') ||
            nomeOriginal?.endsWith('.png') ||
            nomeOriginal?.endsWith('.jpeg') ||
            nomeOriginal?.endsWith('.jpg')) && (
            <FcButton
              type="button"
              tooltip="Visualizar"
              icon="pi pi-eye"
              className="p-button-info"
              onClick={() => {
                const arquivo = this._findByKey(this.store.keyedUploadedFiles, rowData.key);
                this.store.downloadFile(arquivo.arquivo, countDownloadRequest, (viewFileUrl) =>
                  this.setState({ showVisualizationDialog: true, viewFileUrl })
                );
              }}
            />
          )}
          <FcButton
            type="button"
            tooltip="Download"
            icon="pi pi-download"
            tooltipOptions={{ position: 'top' }}
            onClick={() => {
              const arquivo = this._findByKey(this.store.keyedUploadedFiles, rowData.key);
              this.store.downloadFile(arquivo.arquivo, countDownloadRequest);
            }}
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
    const { tableColumns, showFileType, downloadOnly } = this.props;

    const buttonsColumn = {
      style: { width: '100px' },
      body: this._renderTableButtons,
    };

    const columns = [
      {
        style: { width: '30%' },
        field: 'arquivo',
        header: 'Arquivo',
        body: ({ arquivo }) => arquivo?.nomeOriginal,
      },
      {
        style: { width: '30%' },
        field: 'tipo',
        header: 'Tipo*',
      },
      {
        style: { width: '40%' },
        field: 'descricao',
        header: 'Descrição',
      },
      buttonsColumn,
    ];

    tableColumns.forEach((column) => {
      if (downloadOnly) {
        if (column.field === 'tipo') {
          column.body = (options) =>
            getValueByKey(
              this._findByKey(this.state.arquivos, options?.key)?.tipo ?? options.tipo,
              this.props.fileTypes
            );
        } else if (column.field === 'descricao') {
          column.body = (options) =>
            getValue(this._findByKey(this.state.arquivos, options?.key)?.descricao ?? options?.descricao);
        }
      } else {
        if (column.field === 'tipo') {
          column.body = (options) =>
            options && showFileType
              ? this._renderDropdownTipo(options?.key, options)
              : getValueByKey(
                  this._findByKey(this.state.arquivos, options?.key)?.tipo ?? options.tipo,
                  this.props.fileTypes
                );
        } else if (column.field === 'descricao') {
          column.body = (options) => this._renderInputDescricao(options?.key, options);
        }
      }
    });

    const filteredFilesList = this._getFilteredList();
    return (
      <>
        <DataTable
          rowHover
          dataKey="key"
          editMode="cell"
          cellEditValidator={this._onRowEditValidator}
          value={filteredFilesList}
          emptyMessage="Nenhum arquivo adicionado."
          paginator
          rows={20}
          rowsPerPageOptions={[10, 20, 50]}
          loading={this.store.loading}
          responsiveLayout="scroll"
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

  _uploadHandler(event) {
    const arquivos = [...this.state.arquivos];

    Object.keys(event.files).forEach((key) => {
      const arq = {
        key: moment().toISOString() + key,
        arquivo: event.files[key]?.name,
        dataEnvio: moment(),
        file: event.files[key],
        tipo: '',
        descricao: '',
      };

      this._onUploadFile(arq, () => {
        arquivos.push(arq);
        this.setState({ arquivos: arquivos }, () => {
          this.forceUpdate();
        });
      });
    });

    event.options?.clear();
  }

  _sortRequiredFiles(files) {
    return files.slice().sort((f1, f2) => {
      const requiredF1 = f1?.text?.startsWith('*');
      const requiredF2 = f2?.text?.startsWith('*');

      if (requiredF1 && !requiredF2) {
        return -1;
      } else if (!requiredF1 && requiredF2) {
        return 1;
      } else {
        const fileName1 = f1?.text || '';
        const fileName2 = f2?.text || '';
        return fileName1.localeCompare(fileName2);
      }
    });
  }

  render() {
    const { downloadOnly, accept, multi } = this.props;
    const disabledUpload = downloadOnly || (!multi && this.state.arquivos?.length > 0);
    return (
      <div className="p-fluid p-formgrid p-grid">
        {!disabledUpload && (
          <div className="p-col-3">
            <div className="flex align-items-center gap-1">
              <FileUpload
                ref={this.ref}
                chooseLabel={`Adicionar Arquivo${multi ? 's' : ''}`}
                name={`file-uploader-${new Date().toString()}`}
                accept={accept}
                maxFileSize={30000000}
                mode="basic"
                auto
                uploadHandler={(event) => this._uploadHandler(event)}
                customUpload
                multiple
              />
              <HelpIcon documentos={this._sortRequiredFiles(this.store.tipoArquivoEnum)} />
            </div>
          </div>
        )}
        <div className="p-col-12">{this._renderTable()}</div>
        {this._renderVisualizationDialog()}
        {this.state.visibleDialogRemove && this._renderRemoveFileDialog()}
      </div>
    );
  }
}

MultipleFileUploader.defaultProps = {
  downloadOnly: false,
  fileTypes: [],
  showFileType: true,
  accept: '.pdf',
  view: true,
  multi: true,
};

MultipleFileUploader.propTypes = {
  tableColumns: PropTypes.any,
  store: PropTypes.instanceOf(FileUploadStore).isRequired,
  onChangeFiles: PropTypes.func,
  downloadOnly: PropTypes.bool,
  files: PropTypes.any,
  filterTypes: PropTypes.object,
  fileTypes: PropTypes.array,
  showFileType: PropTypes.bool,
  countDownloadRequest: PropTypes.bool,
  accept: PropTypes.string,
  view: PropTypes.bool,
  multi: PropTypes.bool,
};

export default MultipleFileUploader;
