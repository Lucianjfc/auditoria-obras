import React from 'react';
import { observer } from 'mobx-react';
import { InputText } from 'primereact/inputtext';
import FormField from '~/components/FormField';
import { getOriginUrl, getValueByKey } from '~/utils/utils';
import { DATE_FORMAT_WITH_HOURS } from '~/utils/date';
import PropTypes from 'prop-types';
import { Fieldset } from 'primereact/fieldset';
import DadosEstaticosService from '~/services/DadosEstaticosService';
import AppStore from '~/stores/AppStore';
import FcCloseableTabView from '~/components/FcCloseableTabView';
import FileUploader from '~/components/FileUploader';
import moment from 'moment';
import InputMonetary from '~/components/InputMonetary';

@observer
class FormIdentificacao extends React.Component {
  store;
  constructor(props) {
    super(props);
    this._toggleDialogObras = this._toggleDialogObras.bind(this);
    this.store = this.props.store;
    this.state = {
      activeTabIndex: 0,
      visibleDialogObras: false,
    };
  }

  _toggleDialogObras() {
    this.setState((oldState) => ({ visibleDialogObras: !oldState.visibleDialogObras }));
  }

  getValueStyle() {
    return { fontSize: AppStore.layout === 'extenso' ? '1.26rem' : '1.1rem' };
  }

  getTypeFilesByPhaseLicitacao(fase) {
    return DadosEstaticosService.getTipoArquivoLicitacao()
      .filter((arq) => arq.fase.includes(fase))
      .map((arq) => arq.value);
  }

  _renderTabArquivos(licitacao) {
    const indexFaseLicitacao = DadosEstaticosService.getFasesLicitacao().findIndex(
      (fase) => fase.value === licitacao.fase
    );
    const fases = DadosEstaticosService.getFasesLicitacao().slice(0, indexFaseLicitacao + 1);
    const columnsArquivos = [
      {
        style: { width: '30%' },
        field: 'arquivo',
        header: 'Arquivo',
        body: ({ arquivo }) => arquivo.nomeOriginal,
      },
      {
        style: { width: '15%' },
        field: 'tipo',
        header: 'Tipo',
        body: ({ tipo }) => getValueByKey(tipo, DadosEstaticosService.getTipoArquivoLicitacao()),
      },
      {
        style: { width: '25%' },
        field: 'descricao',
        header: 'Descrição',
      },
      {
        style: { width: '15%' },
        field: 'dataEnvio',
        header: 'Data de Envio',
        body: ({ dataEnvio }) => moment(dataEnvio).format(DATE_FORMAT_WITH_HOURS),
      },
    ];
    const tabs = [];
    fases.forEach((fase) => {
      tabs.push({
        id: fase.order,
        header: fase.text,
        content: (
          <FileUploader
            fileTypesToCount={['EDITAL_PROJETO_BASICO']}
            downloadOnly
            store={this.store.fileStore}
            tableColumns={columnsArquivos}
            filterTypes={{
              included: this.getTypeFilesByPhaseLicitacao(fase.value),
              filter: {
                column: 'fase',
                values: [fase.value],
              },
            }}
          />
        ),
      });
    });

    return (
      <FcCloseableTabView
        tabs={tabs}
        activeTabIndex={this.state.activeTabIndex}
        onChangeTab={(tab) => this.setState({ activeTabIndex: tab.id })}
      />
    );
  }

  render() {
    const origin = getOriginUrl();
    if (this.store) {
      const { getRule, updateAttribute } = this.store;

      const { submitted } = this.props;
      return (
        <Fieldset legend="Identificação" className="w-full" style={{ marginTop: 'auto' }}>
          <div className="p-fluid p-formgrid p-grid" style={{ alignItems: 'center' }}>
            <div className="p-col-6">
              <div className="card p-mt-3 p-px-6 w-full flex justify-content-center">
                <img src={origin + '/assets/images/Building permit-bro.png'} alt="" style={{ width: '30rem' }} />
              </div>
            </div>
            <div className="p-col-6">
              <div className="p-col-12 mb-10 flex">
                <h1>
                  <b>Dados do Relatório</b>
                </h1>
              </div>
              <FormField
                columns={6}
                attribute="titulo"
                label="Título do Relatório"
                rule={getRule('titulo')}
                submitted={submitted}
              >
                <InputText
                  onChange={(e) => updateAttribute('titulo', e)}
                  value={this.store.object.titulo}
                  placeholder="Informe o título do processo"
                />
              </FormField>
              <div className="p-col-6" />
              <FormField columns={6} attribute="Autor" label="Autor" rule={getRule('autor')} submitted={submitted}>
                <InputText
                  onChange={(e) => updateAttribute('autor', e)}
                  value={this.store.object.autor}
                  placeholder="Informe o seu nome"
                />
              </FormField>
              <div className="p-col-6" />
              <FormField
                columns={6}
                attribute="valorLicitacao"
                label="Valor da Licitação"
                rule={getRule('valorLicitacao')}
                submitted={submitted}
              >
                <InputMonetary
                  onChange={(e) => updateAttribute('valorLicitacao', e)}
                  value={this.store.object.valorLicitacao}
                  placeholder="Informe o valor da licitação"
                />
              </FormField>
            </div>
          </div>
        </Fieldset>
      );
    } else {
      return <></>;
    }
  }
}

FormIdentificacao.propTypes = {
  store: PropTypes.any,
  submitted: PropTypes.bool,
};

export default FormIdentificacao;
