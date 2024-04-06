import React from 'react';
import PropTypes from 'prop-types';
import FcButton from '~/components/FcButton';
import moment from 'moment';
import { showNotification } from '../utils/utils';
import AppStore from '../stores/AppStore';
import { ConfirmDialog } from 'primereact/confirmdialog';

class GenericFormPage extends React.Component {
  store;
  goBackUrl;
  constructor(props, goBackUrl) {
    super(props);
    this.goBackUrl = goBackUrl;

    this.state = {
      submitted: false,
    };

    this._goBack = this._goBack.bind(this);
    this.renderActionButtons = this.renderActionButtons.bind(this);
    this.submitFormData = this.submitFormData.bind(this);
    this.validateField = this.validateField.bind(this);
    this.getFieldErrorMessage = this.getFieldErrorMessage.bind(this);
  }

  componentDidMount() {
    const { id } = this.props;
    this.store.initialize(id);
  }

  confirmDiscardChanges() {
    return (
      <ConfirmDialog
        visible={this.store.isConfirmDialogVisible}
        message="Todas as alterações serão descartadas. Deseja mesmo voltar?"
        header="Confirmação"
        icon="pi pi-exclamation-triangle"
        accept={() => {
          this._goBack();
          this.store.toggleShowConfirmDialog();
        }}
        onHide={() => this.store.toggleShowConfirmDialog()}
      />
    );
  }

  componentDidUpdate() {
    if (AppStore.entityChanged) {
      this.props.history.push(this.goBackUrl);
      window.location.reload();
    }
  }

  submitFormData(e) {
    e?.preventDefault && e.preventDefault();
    const execution = () => {
      if (!this.store.rules.hasError) {
        this.store.save(this._goBack, this.props.action);
      } else {
        showNotification('error', null, 'Verifique os campos do formulário!');
      }
    };

    if (this.state.submitted) {
      execution();
    } else {
      this.setState({ submitted: true }, execution);
    }
  }

  validateField(field) {
    return this.store.rules[field] && this.store.rules[field].error && this.state.submitted
      ? { className: 'p-invalid p-error' }
      : {};
  }

  getFieldErrorMessage(field) {
    if (this.store.rules[field] && this.store.rules[field].error && this.state.submitted) {
      return <small className="p-error">{this.store.rules[field].message}</small>;
    }
    return null;
  }

  _goBack() {
    this.props.history.push(this.goBackUrl);
  }

  getDateAttributeValue(value) {
    return value ? moment(value).toDate() : value;
  }

  getHomeBreadCrumb() {
    return { icon: 'pi pi-home', url: '/' };
  }

  renderActionButtons() {
    const hasWritePermission = !this.getWritePermission() || AppStore.hasPermission(this.getWritePermission());
    return (
      <div className="p-mt-10 form-actions">
        <div className="p-mt-2">
          <span className="p-mr-1 p-d-inline p-d-flex align-items-center">
            <FcButton
              label="Voltar"
              type="button"
              className="p-ml-auto p-button-secondary p-mr-2"
              onClick={() => this._goBack()}
              loading={this.store.loading}
            />
            {hasWritePermission && <FcButton label="Salvar" type="submit" loading={this.store.loading} />}
          </span>
        </div>
      </div>
    );
  }
}

GenericFormPage.propTypes = {
  id: PropTypes.any,
  action: PropTypes.any,
  history: PropTypes.any,
};

export default GenericFormPage;
