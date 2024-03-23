import React from 'react';
import { observer } from 'mobx-react';
import { InputText } from 'primereact/inputtext';
import FormField from '~/components/FormField';
import { getValueByKey } from '~/utils/utils';
import { DATE_FORMAT_WITH_HOURS } from '~/utils/date';
import PropTypes from 'prop-types';
import { Fieldset } from 'primereact/fieldset';
import DadosEstaticosService from '~/services/DadosEstaticosService';
import AppStore from '~/stores/AppStore';
import FcCloseableTabView from '~/components/FcCloseableTabView';
import FileUploader from '~/components/FileUploader';
import moment from 'moment';

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
    if (this.store) {
      const { getRule, updateAttribute } = this.store;

      const { submitted } = this.props;
      return (
        <div>
          <Fieldset legend="Identificação" className="w-full">
            <div className="p-fluid p-formgrid p-grid" style={{ alignItems: 'center' }}>
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
            </div>
          </Fieldset>
        </div>
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
