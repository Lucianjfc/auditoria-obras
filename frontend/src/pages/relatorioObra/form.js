import React from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import UrlRouter from '../../constants/UrlRouter';
import GenericFormPage from '~/pages/GenericFormPage';
import AppBreadCrumb from '~/components/AppBreadCrumb';
import RelatorioObraFormStore from '~/stores/relatorioObra/formStore';
import { Steps } from 'primereact/steps';
import FormIdentificacao from './abas/formIdentificacao';
import FcButton from '~/components/FcButton';
import FormResumo from './abas/formResumo';
import FormItens from './abas/formItens';
import { showNotification } from '~/utils/utils';

@observer
class RelatorioObraFormPage extends GenericFormPage {
  constructor(props) {
    super(props, UrlRouter.auditoria.relatorioObra.listagem);
    this.store = new RelatorioObraFormStore();
    this.handleOnChangeStep = this.handleOnChangeStep.bind(this);
    this.state = {
      activeIndex: 0,
    };

    this.items = [
      {
        label: 'Identificação',
      },
      {
        label: 'Relação de Itens',
      },
      {
        label: 'Resumo',
      },
    ];
  }

  componentDidMount() {
    const { id } = this.props;
    this.store.initialize(
      id,
      {},
      () => {
        this.store.fileStore.initialize([]);
      },
      () => this.forceUpdate()
    );
  }

  handleOnChangeStep(step) {
    if (this.state.activeIndex == 0) {
      const execution = () => {
        if (!this.store.rules.hasError) {
          this.setState({ activeIndex: step });
        } else {
          showNotification('error', null, 'Verifique os campos do formulário!');
        }
      };

      if (this.state.submitted) {
        execution();
      } else {
        this.setState({ submitted: true }, execution);
      }
    } else {
      this.setState({ activeIndex: step });
    }
  }

  renderActionButtons() {
    return (
      <div className="p-mt-10 form-actions">
        <div className="p-mt-2">
          <span className="p-mr-1 p-d-inline p-d-flex align-items-center">
            <FcButton
              label="Voltar"
              type="button"
              className="p-ml-auto p-button-secondary p-mr-2"
              onClick={() => {
                this.state.activeIndex === 0 && this._goBack();
                this.state.activeIndex !== 0 &&
                  this.setState((prevState) => ({ activeIndex: prevState.activeIndex - 1 }));
              }}
              loading={this.store.loading}
            />
            {this.state.activeIndex != 2 && (
              <FcButton
                label="Avançar"
                type="button"
                onClick={() => {
                  this.handleOnChangeStep(this.state.activeIndex + 1);
                }}
              />
            )}
            {this.state.activeIndex == 2 && <FcButton label="Salvar" type="submit" loading={this.store.loading} />}
          </span>
        </div>
      </div>
    );
  }

  render() {
    const { submitFormData } = this;

    const breacrumbItems = [
      { label: 'Relatórios Auditoria Obra', url: UrlRouter.auditoria.relatorioObra.index },
      { label: this.props.action === 'new' ? 'Novo' : 'Editar' },
    ];

    let content;
    if (this.store.object) {
      content = (
        <>
          <AppBreadCrumb items={breacrumbItems} />
          <div className="card page form-action-buttons h-full">
            <form onSubmit={submitFormData}>
              <Steps
                model={this.items}
                activeIndex={this.state.activeIndex}
                onSelect={(e) => this.handleOnChangeStep(e.index)}
                readOnly={false}
              />
              {this.state.activeIndex === 0 && (
                <FormIdentificacao store={this.store} submitted={this.state.submitted} />
              )}
              {this.state.activeIndex === 1 && <FormItens store={this.store} />}
              {this.state.activeIndex === 2 && <FormResumo store={this.store} />}

              {this.renderActionButtons()}
            </form>
          </div>
        </>
      );
    } else {
      content = (
        <div className="card page">
          <AppBreadCrumb items={breacrumbItems} />
          <i
            className="pi pi-spin pi-spinner"
            style={{
              marginTop: '20px',
              marginLeft: 'calc(50% - 20px)',
              fontSize: '2em',
            }}
          ></i>
        </div>
      );
    }
    return content;
  }
}

RelatorioObraFormPage.propTypes = {
  id: PropTypes.any,
  action: PropTypes.any,
  history: PropTypes.any,
};

export default RelatorioObraFormPage;
