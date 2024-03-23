import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { showErrorNotification, showNotification } from '../utils/utils';
import moment from 'moment';
import { DATE_FORMAT_REPORT, DATE_PARSE_FORMAT_WITH_HOURS_AND_SECONDS } from '../utils/date';

class MultipleFileUploaderStore {
  @observable uploadedFiles = [];
  @observable loading = false;
  @observable tipoArquivoEnum = [];
  uploadFunction;
  downloadFunction;
  removeFunction;
  updateFunction;
  removeFilesState;

  constructor(tipoArquivoEnum, uploadFunction, downloadFunction, removeFunction, updateFunction) {
    this.tipoArquivoEnum = tipoArquivoEnum;
    this.uploadFunction = uploadFunction;
    this.downloadFunction = downloadFunction;
    this.removeFunction = removeFunction;
    this.updateFunction = updateFunction;
    makeObservable(this);

    this.uploadFile = this.uploadFile.bind(this);
    this.updateFiles = this.updateFiles.bind(this);
    this.removeFile = this.removeFile.bind(this);
    this.editFile = this.editFile.bind(this);
  }

  @action
  initialize(uploadedFiles = []) {
    this.loading = true;
    this.uploadedFiles = uploadedFiles;
    this.loading = false;
  }

  @action
  editFile(fieldData = {}, editingKey, callback) {
    const encapsulatedCallback = () => {
      callback && callback(this.uploadedFiles);
    };

    const fileToUpdate = {
      ...fieldData,
      tipo: fieldData.tipoArquivo,
      dataEnvio: moment().format(DATE_PARSE_FORMAT_WITH_HOURS_AND_SECONDS),
    };

    this.overrideFile(editingKey, fileToUpdate);
    encapsulatedCallback();
  }

  @action
  uploadFile(fieldData = {}, callback, callbackFail) {
    this.loading = true;
    this.uploadFunction(fieldData.arquivo)
      .then((response) =>
        runInAction(() => {
          const fileToAdd = {
            arquivo: response.data,
            descricao: fieldData.descricao ?? '',
            tipo: this.tipoArquivoEnum?.length === 1 ? this.tipoArquivoEnum[0].value : fieldData.tipoArquivo,
            dataEnvio: moment().format(DATE_PARSE_FORMAT_WITH_HOURS_AND_SECONDS),
            key: fieldData.key,
          };
          this.uploadedFiles.push(fileToAdd);
          this.loading = false;
          callback && callback(this.uploadedFiles);
        })
      )
      .catch((error) =>
        runInAction(() => {
          showErrorNotification(error);
          callbackFail && callbackFail();
          this.loading = false;
        })
      );
  }

  downloadFile(fileDTO, countDownloadRequest, visualizeCallback, optionalCallback) {
    this.downloadFunction(fileDTO, countDownloadRequest)
      .then((response) =>
        runInAction(() => {
          if (visualizeCallback) {
            visualizeCallback(URL.createObjectURL(response.data));
          } else {
            const { nomeOriginal } = fileDTO;
            const nameArray = nomeOriginal?.split('.');
            const extension = nameArray && nameArray.length > 1 ? nameArray[nameArray.length - 1] : 'pdf';
            const timestamp = moment().format(DATE_FORMAT_REPORT);
            const filename = fileDTO.nomeOriginal + '_' + timestamp + '.' + extension;
            const link = document.createElement('a');
            link.setAttribute('href', URL.createObjectURL(response.data));
            link.setAttribute('download', filename);
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            optionalCallback && optionalCallback();
          }
        })
      )
      .catch((error) =>
        runInAction(() => {
          if (error?.response) {
            error.response.data.text().then((errorResponse) => {
              const errorObject = JSON.parse(errorResponse);
              showNotification(
                'error',
                null,
                errorObject?.messages.length > 0 ? errorObject.messages[0] : 'Ocorreu um erro!'
              );
            });
          } else {
            showNotification('error', null, 'Ocorreu um erro!');
          }
        })
      );
  }

  @action
  removeFile(fileToRemove, callback) {
    this.uploadedFiles.replace(this.keyedUploadedFiles.filter((file) => file.key !== fileToRemove.key));
    callback && callback(this.uploadedFiles);
  }

  @action
  removeAllFiles() {
    this.uploadedFiles = [];
    this.removeFilesState && this.removeFilesState();
  }

  @action
  overrideFile(keyToOverride, file) {
    const index = this.fileKeys.indexOf(keyToOverride);
    this.uploadedFiles[index] = file;
  }

  @computed
  get keyedUploadedFiles() {
    return this.uploadedFiles.map((file, idx) => {
      if (!file.key) {
        file.key = idx;
      }
      return file;
    });
  }

  @computed
  get fileKeys() {
    return this.keyedUploadedFiles.map((file) => file.key);
  }

  checkOverrideTypes(value = '') {
    const typeEnum = this.tipoArquivoEnum.find((t) => t.value === value);
    if (typeEnum?.obrigatorio && this.uploadedFiles?.map((f) => f.tipo).includes(value)) {
      showNotification('warn', `Existe arquivo enviado para o tipo '${typeEnum.text}'`);
      return false;
    }
    return true;
  }

  @action
  updateFiles(key, type, value, row, callback, inputRef) {
    if (type === 'descricao' && value?.length > 255) {
      if (inputRef?.current) {
        inputRef.current.value = value.slice(0, 255);
      }
      showNotification('error', null, 'O campo "Descrição" não pode exceder 255 caracteres');
    } else {
      if (this.checkOverrideTypes(value)) {
        if (!this.uploadedFiles.some((arquivo) => arquivo.key === key)) {
          const rowToUpdate = Object.assign({}, row);
          rowToUpdate[type] = value;
          this.uploadedFiles.push(rowToUpdate);
        } else {
          const rowToUpdate = this.uploadedFiles.find((arquivo) => arquivo.key === key);
          rowToUpdate[type] = value;
          const index = this.uploadedFiles.findIndex((object) => {
            return object.key === key;
          });
          this.uploadedFiles[index] = rowToUpdate;
          callback && callback(this.uploadedFiles);
        }
      }
    }
  }

  @action
  updateUploadedFilesKeys(uploadedFiles) {
    this.uploadedFiles = uploadedFiles;
  }
}

export default MultipleFileUploaderStore;
