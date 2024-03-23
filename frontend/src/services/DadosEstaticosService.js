import { getValueByKey, getValueDate, getValueMoney, getValueMoneyIfNotFormatted } from '~/utils/utils';

const DadosEstaticosService = {
  getTipoComissao() {
    return [
      { value: 'PERMANENTE', text: 'Permanente', cod: 'CPL', desc: 'Comissão Permanente de Licitação' },
      { value: 'ESPECIAL', text: 'Especial', cod: 'CEL', desc: 'Comissão Especial de Licitação' },
    ];
  },

  getTipoConjuntoComissao() {
    return [
      { value: 'CONTRATACAO', text: 'Comissão de Contratação', cod: 'CCT', desc: 'Comissão Permanente de Licitação' },
      {
        value: 'APOIO',
        text: 'Agente de Contratação/Pregoeiro(a) com Equipe de Apoio',
        cod: 'ACP',
        desc: 'Agente de Contratação/Pregoeiro(a) com equipe de apoio',
      },
    ];
  },

  getTipoVariavelAmbiente() {
    return [
      { value: 'TEXTO', text: 'Texto' },
      { value: 'NUMERICO', text: 'Numérico' },
      { value: 'BOOLEAN', text: 'Boolean' },
    ];
  },

  getTiposObjetos() {
    return [
      { value: 'LICITACAO', text: 'Licitação' },
      { value: 'CARONA', text: 'Adesão (Carona)' },
      { value: 'DISPENSA', text: 'Dispensa' },
      { value: 'INEXIGIBILIDADE', text: 'Inexigibilidade' },
      { value: 'CONTRATO', text: 'Contrato' },
      { value: 'ADITIVO', text: 'Aditivo' },
      { value: 'EMPENHO', text: 'Empenho' },
      { value: 'EMPENHO_LICITACAO', text: 'Empenho / Ata de Registro de Preço' },
      { value: 'RESCISAO_CONTRATUAL', text: 'Rescisão Contratual' },
      { value: 'TERMO_REFERENCIA', text: 'Termo de Referência' },
      { value: 'OBRA_MEDICAO', text: 'Medição de Obra' },
    ];
  },

  getModalidadesLicitacao() {
    return [
      { value: 'Convite', text: 'Convite', key: 'CARTA_CONVITE' },
      { value: 'Concorrência', text: 'Concorrência', key: 'CONCORRENCIA' },
      { value: 'Pregão Presencial', text: 'Pregão Presencial', key: 'PREGAO_PRESENCIAL' },
      { value: 'Pregão Eletrônico', text: 'Pregão Eletrônico', key: 'PREGAO_ELETRONICO' },
      { value: 'Tomada de Preços', text: 'Tomada de Preços', key: 'TOMADA_DE_PRECO' },
      { value: 'Leilão', text: 'Leilão', key: 'LEILAO' },
      {
        value: 'RDC - Regime Diferenciado de Contratação',
        text: 'RDC - Regime Diferenciado de Contratação',
        key: 'RDC',
      },
      { value: 'LPN - Licitação Pública Nacional', text: 'LPN - Licitação Pública Nacional', key: 'LPN' },
      {
        value: 'LPNI - Licitação Pública Nacional e Internacional',
        text: 'LPNI - Licitação Pública Nacional e Internacional',
        key: 'LPNI',
      },
      { value: 'Shopping', text: 'Shopping', key: 'SHOPPING' },
      { value: 'Seleção de Consultores', text: 'Seleção de Consultores', key: 'SELECAO' },
      { value: 'Chamamento Público', text: 'Chamamento Público', key: 'CHAMAMENTO' },
    ];
  },

  getModalidadeCarona() {
    return [
      { value: 'CARTA_CONVITE', text: 'Convite' },
      { value: 'CONCORRENCIA', text: 'Concorrência' },
      { value: 'PREGAO_PRESENCIAL', text: 'Pregão Presencial' },
      { value: 'PREGAO_ELETRONICO', text: 'Pregão Eletrônico' },
      { value: 'TOMADA_DE_PRECO', text: 'Tomada de Preços' },
      { value: 'LEILAO', text: 'Leilão' },
      { value: 'RDC', text: 'RDC - Regime Diferenciado de Contratação' },
      { value: 'LPN', text: 'LPN - Licitação Pública Nacional' },
      { value: 'LPNI', text: 'LPNI - Licitação Pública Nacional e Internacional' },
      { value: 'SHOPPING', text: 'Shopping' },
      { value: 'SELECAO', text: 'Seleção de Consultores' },
      { value: 'CHAMAMENTO', text: 'Chamamento Público' },
      { value: 'PREGAO', text: 'Pregão' },
    ];
  },

  getModalidadesCarona() {
    return [
      { value: 'Convite', text: 'Convite' },
      { value: 'Concorrência', text: 'Concorrência' },
      { value: 'Pregão Presencial', text: 'Pregão Presencial' },
      { value: 'Pregão Eletrônico', text: 'Pregão Eletrônico' },
      { value: 'Tomada de Preços', text: 'Tomada de Preços' },
      { value: 'Leilão', text: 'Leilão' },
      { value: 'RDC - Regime Diferenciado de Contratação', text: 'RDC - Regime Diferenciado de Contratação' },
      { value: 'LPN - Licitação Pública Nacional', text: 'LPN - Licitação Pública Nacional' },
      {
        value: 'LPNI - Licitação Pública Nacional e Internacional',
        text: 'LPNI - Licitação Pública Nacional e Internacional',
      },
      { value: 'Shopping', text: 'Shopping' },
      { value: 'Seleção de Consultores', text: 'Seleção de Consultores' },
      { value: 'Chamamento Público', text: 'Chamamento Público' },
      { value: 'Pregão', text: 'Pregão' },
    ];
  },

  getTipoFeriado() {
    return [
      { value: 'MUNICIPAL', text: 'Municipal' },
      { value: 'ESTADUAL', text: 'Estadual' },
      { value: 'FEDERAL', text: 'Federal' },
    ];
  },

  getTipoPessoa() {
    return [
      { value: true, text: 'Física' },
      { value: false, text: 'Jurídica' },
    ];
  },

  getTipoFundamentacaoLegal() {
    return [
      { value: true, text: 'Dispensa' },
      { value: false, text: 'Inexigibilidade' },
    ];
  },

  getSimNao() {
    return [
      { bit: '1', value: true, text: 'Sim' },
      { bit: '0', value: false, text: 'Não' },
    ];
  },

  getSimNaoCatalogo() {
    return [
      { value: 'S', text: 'Sim' },
      { value: 'N', text: 'Não' },
    ];
  },

  getTipoMaterial() {
    return [
      { value: 'M', text: 'Materiais', name: 'materiais', singularText: 'Material' },
      { value: 'S', text: 'Serviços', name: 'servicos', singularText: 'Serviço' },
    ];
  },

  getSimNaoInativo() {
    return [
      { value: true, text: 'Sim' },
      { value: false, text: 'Não' },
    ];
  },

  getVerdadeiroFalso() {
    return [
      { value: true, text: 'Verdadeiro' },
      { value: false, text: 'Falso' },
    ];
  },

  getVerdadeiroFalsoVariavelControle() {
    return [
      { value: '1', text: 'Verdadeiro' },
      { value: '0', text: 'Falso' },
    ];
  },

  getModalidadeLicitacao() {
    return [
      { value: 'CARTA_CONVITE', text: 'Convite' },
      { value: 'CONCORRENCIA', text: 'Concorrência' },
      { value: 'PREGAO_PRESENCIAL', text: 'Pregão Presencial' },
      { value: 'PREGAO_ELETRONICO', text: 'Pregão Eletrônico' },
      { value: 'TOMADA_DE_PRECO', text: 'Tomada de Preços' },
      { value: 'LEILAO', text: 'Leilão' },
      { value: 'RDC', text: 'RDC - Regime Diferenciado de Contratação' },
      { value: 'LPN', text: 'LPN - Licitação Pública Nacional' },
      { value: 'LPNI', text: 'LPNI - Licitação Pública Nacional e Internacional' },
      { value: 'SHOPPING', text: 'Shopping' },
      { value: 'SELECAO', text: 'Seleção de Consultores' },
      { value: 'CHAMAMENTO', text: 'Chamamento Público' },
    ];
  },

  getStatusAuditoriaLicitacao() {
    return [
      { value: 'ANALISE', text: 'Em análise' },
      { value: 'CONSISTENTE', text: 'Consistente' },
      { value: 'INCONSISTENTE', text: 'Inconsistente' },
      { value: 'INCONSISTENCIA_RESOLVIDA', text: 'Inconsistência resolvida' },
      { value: 'INCONSISTENCIA_NAO_RESOLVIDA', text: 'Inconsistência não resolvida' },
    ];
  },

  getStatusLicitacao() {
    return [
      { value: 'NAO_PUBLICADA', text: 'Não publicada' },
      { value: 'PUBLICADA', text: 'Publicada' },
      { value: 'REMOVIDA', text: 'Removida' },
    ];
  },

  getStatusOcorrenciaLicitacao() {
    return [
      { value: 'CANCELADA', text: 'Cancelada' },
      { value: 'PRORROGADA', text: 'Prorrogada' },
      { value: 'SUSPENSA', text: 'Suspensa' },
      { value: 'REVOGADA', text: 'Revogada' },
      { value: 'ANULADA', text: 'Anulada' },
      { value: 'SUSPENSA_DETERMINACAO_JUDICIAL', text: 'Suspensa por determinacao judicial' },
      { value: 'EDITAL_IMPUGNADO_ANALISE', text: 'Edital impugnado em análise' },
      { value: 'SUSTADA_MEDIDA_CAUTELAR', text: 'Sustada por medida cautelar' },
      { value: 'ADJUDICADA', text: 'Adjudicada' },
      { value: 'HOMOLOGADA', text: 'Homologada' },
      { value: 'DESERTA', text: 'Deserta' },
      { value: 'FRACASSADA', text: 'Fracassada' },
      { value: 'RETIFICACAO_EDITAL', text: 'Retificação do Edital' },
      { value: 'REABRIR', text: 'Reabertura' },
      { value: 'ATA_REGISTRO_PRECOS', text: 'Ata de registro de preço' },
      { value: 'REEDICAO', text: 'Reedição (Em casos de deserta ou fracassada)' },
      { value: 'OUTRA', text: 'Outra' },
      { value: 'OUTROS_PRORROGAR', text: 'Outros' },
    ];
  },

  getTipoOcorrencia() {
    return [
      { value: 'CANCELAR', text: 'Cancelada' },
      { value: 'FINALIZAR', text: 'Finalizada' },
      { value: 'SUSPENDER', text: 'Suspensa' },
      { value: 'PRORROGAR', text: 'Prorrogada' },
      { value: 'REABRIR', text: 'Reaberta' },
    ];
  },

  getTipoItem() {
    return [
      { value: 'NUMERO', text: 'Númerico' },
      { value: 'TEXTUAL', text: 'Textual' },
      { value: 'BOOLEAN', text: 'Boolean' },
      { value: 'TEMPORAL', text: 'Temporal' },
      { value: 'MONETARIO', text: 'Monetário' },
    ];
  },

  getSituacaoPedidoCatalogo() {
    return [
      { value: 'PENDENTE', text: 'Pendente' },
      { value: 'DEFERIDO', text: 'Deferido' },
      { value: 'INDEFERIDO', text: 'Indeferido' },
    ];
  },

  getTipoTemporal() {
    return [
      { value: 'HORAS', text: 'Horas' },
      { value: 'DIAS', text: 'Dias' },
      { value: 'DIAS_UTEIS', text: 'Dias Úteis' },
      { value: 'SEMANAS', text: 'Semanas' },
      { value: 'MESES', text: 'Meses' },
      { value: 'ANOS', text: 'Anos' },
    ];
  },
  getNaturezaObjetoLicitacao() {
    return [
      { value: 'ALIENACAO_DE_BENS', text: 'Alienação de Bens' },
      { value: 'CONCESSAO', text: 'Concessão' },
      { value: 'LOCACAO_DE_BENS', text: 'Locação de Bens' },
      { value: 'SERVICOS_DE_ENGENHARIA', text: 'Serviços comuns de engenharia' },
      { value: 'BENS_SERVICOS_ESPECIAIS', text: 'Bens/Serviços especiais' },
      { value: 'PERMISSAO', text: 'Permissão' },
      { value: 'CONSULTORIA', text: 'Consultoria' },
      { value: 'COMPRAS', text: 'Compras' },
      { value: 'OBRAS', text: 'Obras/Serviços especiais de engenharia' },
      { value: 'PRESTACAO_DE_SERVICO', text: 'Prestação de Serviços' },
      {
        value: 'PRESTACAO_DE_SERVICO_FORNECIMENTO_MATERIAL',
        text: 'Prestação de Serviços com Fornecimento de Material',
      },
      { value: 'OUTROS_SERVICOS', text: 'Outros Serviços' },
    ];
  },

  getTodosTiposArquivos() {
    let tipos = [];
    tipos.push(this.getTipoArquivoAditivo());
    tipos.push(this.getTipoArquivoCarona());
    tipos.push(this.getTipoArquivoContrato());
    tipos.push(this.getTipoArquivoDispensa());
    tipos.push(this.getTipoArquivoInexigibilidade);
    tipos.push(this.getTipoArquivoLicitacao());
    tipos.push(this.getTipoArquivoRescisaoContrato());
    tipos.push(this.getTipoArquivoTermoReferencia());
    return [].concat.apply([], tipos);
  },

  getTipoArquivoLicitacao() {
    return [
      {
        value: 'AUTORIZACAO_ABERTURA_LICITACAO_ORDENADOR_DESPESA',
        text: 'Justificativa para contratação',
        fase: ['PREPARATORIA'],
      },
      {
        value: 'PROJETO_BASICO',
        text: 'Termo de Referência ou Projeto básico',
        fase: ['PREPARATORIA'],
      },
      {
        value: 'ESTIMATIVA_PRECO',
        text: 'Estimativa de preço detalhada, incluindo pesquisa de mercado e mapa comparativo',
        fase: ['PREPARATORIA'],
      },
      {
        value: 'PESQUISA_PRECO_PUBLICO',
        text: 'Pesquisa de preço praticado por Órgãos e Entidades da Administração Pública',
        fase: ['PREPARATORIA'],
      },
      {
        value: 'PESQUISA_PRECO_MERCADO',
        text: 'Pesquisa de preço de mercado',
        fase: ['PREPARATORIA'],
      },
      {
        value: 'MAPA_COMPARATIVO_PRECOS',
        text: 'Mapa Comparativo de Preços',
        fase: ['PREPARATORIA'],
      },
      {
        value: 'DESCRICAO_NECESSIDADE_CONTRATACAO',
        text: 'Descrição da necessidade da contratação',
        fase: ['PREPARATORIA'],
      },
      {
        value: 'DOCUMENTO_FORMALIZACAO_DEMANDA',
        text: 'Documento de Formalização de Demanda, com a descrição da necessidade da contratação',
        fase: ['PREPARATORIA'],
      },
      {
        value: 'ESTUDO_TECNICO_PRELIMINAR',
        text: 'Estudo Técnico Preliminar',
        fase: ['PREPARATORIA'],
      },
      {
        value: 'PARECER_JURIDICO_APROVACAO_MINUTAS',
        text: 'Parecer jurídico aprovando as minutas do edital e do contrato',
        fase: ['PREPARATORIA'],
      },
      {
        value: 'OUTROS_DOCUMENTOS',
        text: 'Outros documentos',
        fase: ['PREPARATORIA'],
      },
      {
        value: 'ORCAMENTO_ESTIMATIVO',
        text: 'Orçamento Estimativo - 1ª Etapa - (Planilha Excel)',
        fase: ['PREPARATORIA'],
      },
      {
        value: 'EDITAL_PROJETO_BASICO',
        text: 'Edital e Anexos',
        fase: ['PREPARATORIA'],
      },
      {
        value: 'PARECER_ASSESSORIA_JURIDICA',
        text: 'Parecer Jurídico',
        fase: ['DIVULGACAO_PUBLICACAO_LICITACAO'],
      },
      {
        value: 'COMPROVANTE_PUBLICACOES',
        text: 'Comprovante das publicações do aviso de licitação',
        fase: ['DIVULGACAO_PUBLICACAO_LICITACAO'],
      },
      {
        value: 'OUTROS_DOCUMENTOS_INTERNO',
        text: 'Outros documentos',
        fase: ['DIVULGACAO_PUBLICACAO_LICITACAO'],
      },
      {
        value: 'COMPROVANTE_DIVULGACAO_PNCP',
        text: 'Comprovante de divulgação e manutenção do inteiro teor do ato convocatório e de seus anexos no Portal Nacional de Contratações Públicas (PNCP)',
        fase: ['DIVULGACAO_PUBLICACAO_LICITACAO'],
      },
      {
        value: 'MAPA_LANCES',
        text: 'Mapa de Lances',
        fase: ['APRESENTACAO_PROPOSTAS_LANCES'],
      },
      {
        value: 'ATA_SESSAO',
        text: 'Ata da sessão da licitação',
        fase: ['APRESENTACAO_PROPOSTAS_LANCES'],
      },
      {
        value: 'PROPOSTAS_VENCEDORAS',
        text: 'Propostas vencedoras',
        fase: ['APRESENTACAO_PROPOSTAS_LANCES'],
      },
      {
        value: 'OUTROS_DOCUMENTOS_EXTERNO',
        text: 'Outros documentos',
        fase: ['APRESENTACAO_PROPOSTAS_LANCES', 'FINALIZACAO'],
      },
      {
        value: 'TERMO_HOMOLOGACAO',
        text: 'Termo de Homologação',
        fase: ['FINALIZACAO'],
      },
      {
        value: 'PROPOSTA_ADJUDICADA',
        text: 'Proposta Adjudicada - 2ª Etapa - (Planilha Excel)',
        fase: ['FINALIZACAO'],
      },
      {
        value: 'RECURSOS',
        text: 'Recursos',
        fase: ['FINALIZACAO'],
      },
      {
        value: 'TERMO_ADJUDICACAO',
        text: 'Termo de Adjudicação',
        fase: ['FINALIZACAO'],
      },
      {
        value: 'ATA_REGISTRO_PRECOS',
        text: 'Ata de Registro de Preços',
        fase: ['FINALIZACAO'],
      },
    ];
  },

  getFormaPublicacaoPaginada() {
    return [
      {
        value: 'Diário Oficial da União (DOU)',
        text: 'DOU',
      },
      {
        value: 'Diário Oficial de Contas',
        text: 'DOC',
      },
      {
        value: 'Diário Oficial do Estado (DOE)',
        text: 'DOE',
      },
    ];
  },

  getTipoArquivoComissao() {
    return [{ value: 'ARQUIVO_COMISSAO', text: 'Arquivo da Comissão' }];
  },

  getTipoArquivoTermoReferencia() {
    return [
      { value: 'ARQUIVO_TERMO_REFERENCIA', text: 'Arquivo do Termo de Referência' },
      { value: 'PROJETO_BASICO', text: 'Projeto Básico' },
      { value: 'OUTROS_DOCUMENTOS', text: 'Outros documentos' },
    ];
  },

  getTipoArquivoDispensa() {
    return [
      { value: 'JUSTIFICATIVA', text: 'Justificativa da necessidade do objeto' },
      {
        value: 'SITUACAO_EMERGENCIAL',
        text: 'Justificativa da situação de dispensa com os elementos necessários à sua caracterização',
      },
      { value: 'JUSTIFICATIVA_FORNECEDOR', text: 'Razões da escolha do fornecedor' },
      {
        value: 'JUSTIFICATIVA_PRECO',
        text: 'Justificativa de preço, incluindo pesquisa de mercado e mapa comparativo',
      },
      { value: 'PROPOSTA_PRECOS', text: 'Proposta formal oferecida pelo contratado' },
      { value: 'PROVA_DOCUMENTOS_EXAMINADOS', text: 'Parecer jurídico sobre a possibilidade de dispensa' },
      { value: 'MINUTA_CONTRATO', text: 'Minuta do contrato' },
      { value: 'TERMO_RATIFICACAO', text: 'Publicação do Termo ou Ato de Ratificação da Dispensa da Licitação' },
      { value: 'DOCUMENTOS_FORNECEDOR', text: 'Documentos de Habilitação e Qualificação do Fornecedor' },
      { value: 'OUTROS_DOCUMENTOS', text: 'Outros documentos' },
    ];
  },

  getTipoArquivoInexigibilidade() {
    return [
      { value: 'JUSTIFICATIVA', text: 'Justificativa da necessidade do objeto' },
      {
        value: 'SITUACAO_EMERGENCIAL',
        text: 'Justificativa da situação de inexigibilidade com os elementos necessários à sua caracterização',
      },
      { value: 'JUSTIFICATIVA_FORNECEDOR', text: 'Razões da escolha do fornecedor ou executante' },
      { value: 'COMPROVANTE', text: 'Documento comprovante da inexigibilidade' },
      {
        value: 'JUSTIFICATIVA_PRECO',
        text: 'Justificativa detalhada de preços',
      },
      { value: 'PROPOSTA_PRECOS', text: 'Proposta formal oferecida pelo contratado' },
      { value: 'PROVA_DOCUMENTOS_EXAMINADOS', text: 'Parecer da assessoria jurídica' },
      { value: 'MINUTA_CONTRATO', text: 'Minuta do contrato' },
      { value: 'TERMO_RATIFICACAO', text: 'Publicação do Termo ou Ato de Ratificação da Inexigibilidade de Licitação' },
      { value: 'HABILITACAO_FORNECEDOR', text: 'Documentos de Habilitação e Qualificação do Fornecedor' },
      { value: 'OUTROS_DOCUMENTOS', text: 'Outros documentos' },
    ];
  },

  getTipoLicitacaoLegislacao() {
    return [
      { value: 'LEI_N_14133', text: 'Lei Nº 14.133' },
      { value: 'LEI_N_8666', text: 'Lei Nº 8666' },
      { value: 'OUTRA', text: 'Outra' },
    ];
  },

  getTipoLicitacaoLei14133() {
    return [
      { value: 'LEI_N_14133', text: 'Lei Nº 14.133' },
      { value: 'LEI_N_8666', text: 'Lei Nº 8.666' },
      { value: 'OUTRA', text: 'Outra' },
    ];
  },

  getSituacaoParecer() {
    return [
      { value: 'SIM', text: 'Sim' },
      { value: 'NAO', text: 'Não' },
      { value: 'PARCIALMENTE', text: 'Parcialmente' },
      { value: 'NAO_APLICA', text: 'N/A' },
    ];
  },

  getTipoUF() {
    return [
      { value: 'AC', text: 'ACRE' },
      { value: 'AL', text: 'ALAGOAS' },
      { value: 'AP', text: 'AMAPA' },
      { value: 'AM', text: 'AMAZONAS' },
      { value: 'BA', text: 'BAHIA' },
      { value: 'CE', text: 'CEARA' },
      { value: 'DF', text: 'DISTRITO_FEDERAL' },
      { value: 'ES', text: 'ESPIRITO_SANTO' },
      { value: 'GO', text: 'GOIAS' },
      { value: 'MA', text: 'MARANHAO' },
      { value: 'MT', text: 'MATO_GROSSO' },
      { value: 'MS', text: 'MATO_GROSSO_DO_SUL' },
      { value: 'MG', text: 'MINAS_GERAIS' },
      { value: 'PA', text: 'PARA' },
      { value: 'PB', text: 'PARAIBA' },
      { value: 'PR', text: 'PARANA' },
      { value: 'PE', text: 'PERNAMBUCO' },
      { value: 'PI', text: 'PIAUI' },
      { value: 'RJ', text: 'RIO_DE_JANEIRO' },
      { value: 'RN', text: 'RIO_GRANDE_DO_NORTE' },
      { value: 'RS', text: 'RIO_GRANDE_DO_SUL' },
      { value: 'RO', text: 'RONDONIA' },
      { value: 'RR', text: 'RORAIMA' },
      { value: 'SC', text: 'SANTA_CATARINA' },
      { value: 'SP', text: 'SAO_PAULO' },
      { value: 'SE', text: 'SERGIPE' },
      { value: 'TO', text: 'TOCANTINS' },
    ];
  },

  getTipoArquivoCarona() {
    return [
      { value: 'JUSTIFICATIVA', text: 'Justificativa para contratação' },
      { value: 'OFICIO_GERENCIADOR', text: 'Ofício ao gerenciador da ata pedindo autorização' },
      { value: 'OFICIO_DETENTOR', text: 'Ofício ao detentor da ata pedindo autorização (fornecedor)' },
      { value: 'MAPA_COMPARATIVO', text: 'Pesquisa de mercado e mapa comparativo' },
      { value: 'OFICIO_RESPOSTAS_GERENCIADOR', text: 'Ofício com a resposta do gerenciador da ata com documentos' },
      { value: 'EDITAL', text: 'Edital e anexos' },
      { value: 'PARECER_ASSESSORIA_JURIDICA', text: 'Parecer da assessoria jurídica da administração' },
      { value: 'PROPOSTAS_VENCEDORAS', text: 'Propostas vencedoras' },
      { value: 'ATA_RP', text: 'Ata de Registro de preços' },
      { value: 'OFICIO_RESPOSTAS_DETENTOR', text: 'Ofício com a resposta do detentor da ata (fornecedor)' },
      { value: 'HOMOLOGACAO', text: 'Termo de Homologação' },
      { value: 'TERMO_ADESAO', text: 'Publicação do Termo de Adesão a Ata de Registro de Preços' },
      { value: 'PARECER_GERENCIADOR', text: 'Parecer da assessoria jurídica' },
      { value: 'OUTROS_DOCUMENTOS', text: 'Outros documentos' },
    ];
  },

  getTipoArquivoFinalizar() {
    return [
      {
        value: 'MAPA_LANCES',
        text: 'Mapa de Lances',
      },
      {
        value: 'ATA_SESSAO',
        text: 'Ata da Sessão',
      },
      {
        value: 'TERMO_REVOGACAO',
        text: 'Termo de Revogação',
      },
      {
        value: 'TERMO_ANULACAO',
        text: 'Termo de Anulação',
      },
      { value: 'OUTROS_DOCUMENTOS', text: 'Outros documentos' },
    ];
  },

  getFasesLicitacao() {
    return [
      {
        value: 'PREPARATORIA',
        text: 'Preparatória',
        phaseKey: 'preparatoria',
        dateField: 'dataCadastroPreparatoria',
        order: 0,
      },
      {
        value: 'DIVULGACAO_PUBLICACAO_LICITACAO',
        text: 'Divulgação e Publicação da Licitação',
        phaseKey: 'divulgacaoEditalLicitacao',
        dateField: 'dataCadastro',
        order: 1,
      },
      {
        value: 'APRESENTACAO_PROPOSTAS_LANCES',
        text: 'Apresentação de Propostas e Lances',
        phaseKey: 'apresentacao',
        dateField: 'dataCadastroVencedores',
        order: 2,
      },
      {
        value: 'FINALIZACAO',
        text: 'Finalizados',
        phaseKey: 'finalizacao',
        dateField: 'dataUltimaOcorrencia',
        order: 3,
      },
    ];
  },

  getLabelsAnaliseProcesso() {
    return [
      { value: 'CADASTRADO', text: 'Cadastrados', phaseKey: 'cadastrados' },
      {
        value: 'AUDITORIA',
        text: 'Selecionados para Auditoria',
        phaseKey: 'auditoria',
      },
      { value: 'EM_ANALISE', text: 'Em Análise', phaseKey: 'em_analise' },
      { value: 'ALERTA', text: 'Alertas', phaseKey: 'alertas' },
      { value: 'FINALIZADO', text: 'Concluídos', phaseKey: 'concluidos' },
    ];
  },

  getTipoProcesso() {
    return [
      { value: 'L', text: 'Licitação', urlLabel: 'licitacao', licitantes: 'vencedores', licitante: 'Contratado(a)' },
      {
        value: 'I',
        text: 'Inexigibilidade',
        urlLabel: 'inexigibilidade',
        licitantes: 'fornecedores',
        licitante: 'Fornecedor(a)',
      },
      { value: 'C', text: 'Adesão/Carona', urlLabel: 'carona', licitantes: 'detentores', licitante: 'Contratado(a)' },
      { value: 'D', text: 'Dispensa', urlLabel: 'dispensa', licitantes: 'fornecedores', licitante: 'Fornecedor(a)' },
    ];
  },

  getStatusContrato() {
    return [
      { value: 'NAO_PUBLICADA', text: 'Não Publicada' },
      { value: 'PUBLICADA', text: 'Publicada' },
      { value: 'REMOVIDA', text: 'Removida' },
    ];
  },

  getFormaContrato() {
    return [
      { value: 'CONTRATO', text: 'Contrato' },
      { value: 'EQUIVALENTE_EMPENHO', text: 'Equivalente de Contrato: Empenho' },
      { value: 'EQUIVALENTE_SERVICO', text: 'Equivalente de Contrato: Ordem de Serviço/Entrega' },
    ];
  },

  getFormaPreenchimentoSecaoTermoReferencia() {
    return [
      { value: 'PREENCHIMENTO_MANUAL', text: 'Preenchimento manual' },
      { value: 'IMPORTACAO_ARQUIVO', text: 'Preenchimento por importação de arquivo' },
    ];
  },

  getTipoArquivoContrato() {
    const CONTRATO_ANTIGO = 'CONTRATO_ANTIGO';
    const CONTRATO_NOVO = 'CONTRATO_NOVO';
    const CONTRATO_PROCESSO_EXTERNO = 'CONTRATO_PROCESSO_EXTERNO';

    return [
      {
        value: 'MANIFESTACAO',
        text: 'Manifestação de interesse',
        tiposContrato: ['CONTRATO', 'EQUIVALENTE_EMPENHO', 'EQUIVALENTE_SERVICO'],
        typeRender: [CONTRATO_PROCESSO_EXTERNO],
      },
      {
        value: 'FORMALIZACAO',
        text: 'Formalização da demanda',
        tiposContrato: ['CONTRATO', 'EQUIVALENTE_EMPENHO', 'EQUIVALENTE_SERVICO'],
        typeRender: [CONTRATO_PROCESSO_EXTERNO],
      },
      {
        value: 'ACEITE_PARTICIPACAO',
        text: 'Aceite de participação pelo órgão gerenciador',
        tiposContrato: ['CONTRATO', 'EQUIVALENTE_EMPENHO', 'EQUIVALENTE_SERVICO'],
        typeRender: [CONTRATO_PROCESSO_EXTERNO],
      },
      {
        value: 'JUSTIFICATIVA_CONTRATACAO',
        text: 'Justificativa da contratação',
        tiposContrato: ['CONTRATO', 'EQUIVALENTE_EMPENHO', 'EQUIVALENTE_SERVICO'],
        typeRender: [CONTRATO_PROCESSO_EXTERNO],
      },
      {
        value: 'EDITAL_ANEXOS',
        text: 'Edital e Anexos',
        tiposContrato: ['CONTRATO', 'EQUIVALENTE_EMPENHO', 'EQUIVALENTE_SERVICO'],
        typeRender: [CONTRATO_PROCESSO_EXTERNO],
      },
      {
        value: 'ATA',
        text: 'Ata de Registro de Preços',
        tiposContrato: ['CONTRATO', 'EQUIVALENTE_EMPENHO', 'EQUIVALENTE_SERVICO'],
        typeRender: [CONTRATO_PROCESSO_EXTERNO],
      },
      {
        value: 'PROPOSTA',
        text: 'Proposta do Vencedor',
        tiposContrato: ['CONTRATO', 'EQUIVALENTE_EMPENHO', 'EQUIVALENTE_SERVICO'],
        typeRender: [CONTRATO_PROCESSO_EXTERNO],
      },
      {
        value: 'HOMOLOGACAO',
        text: 'Homologação',
        tiposContrato: ['CONTRATO', 'EQUIVALENTE_EMPENHO', 'EQUIVALENTE_SERVICO'],
        typeRender: [CONTRATO_PROCESSO_EXTERNO],
      },
      {
        value: 'COPIA_CONTRATO',
        text: 'Contrato',
        tiposContrato: ['CONTRATO'],
        typeRender: [CONTRATO_ANTIGO, CONTRATO_NOVO, CONTRATO_PROCESSO_EXTERNO],
      },
      {
        value: 'OUTROS_DOCUMENTOS',
        text: 'Outros documentos',
        tiposContrato: ['CONTRATO', 'EQUIVALENTE_EMPENHO', 'EQUIVALENTE_SERVICO'],
        typeRender: [CONTRATO_ANTIGO, CONTRATO_NOVO, CONTRATO_PROCESSO_EXTERNO],
      },
      {
        value: 'GARANTIA',
        text: 'Garantia contratual',
        tiposContrato: ['CONTRATO'],
        typeRender: [CONTRATO_ANTIGO, CONTRATO_NOVO, CONTRATO_PROCESSO_EXTERNO],
      },
      {
        value: 'RESUMO',
        text: 'Publicação do resumo do contrato',
        tiposContrato: ['CONTRATO', 'EQUIVALENTE_EMPENHO', 'EQUIVALENTE_SERVICO'],
        typeRender: [CONTRATO_ANTIGO],
      },
      {
        value: 'ORDERM',
        text: 'Ordem de entrega ou de serviço',
        tiposContrato: ['CONTRATO', 'EQUIVALENTE_EMPENHO', 'EQUIVALENTE_SERVICO'],
        typeRender: [CONTRATO_ANTIGO],
      },
      {
        value: 'DESIGNACAO',
        text: 'Designação do gestor e fiscal',
        tiposContrato: ['CONTRATO'],
        typeRender: [CONTRATO_ANTIGO, CONTRATO_NOVO, CONTRATO_PROCESSO_EXTERNO],
      },
      {
        value: 'LICENCA',
        text: 'Licença ambiental',
        tiposContrato: ['CONTRATO', 'EQUIVALENTE_EMPENHO', 'EQUIVALENTE_SERVICO'],
        typeRender: [CONTRATO_ANTIGO],
      },
      {
        value: 'INIDONEIDADE',
        text: 'Certidão negativa de inidoneidade',
        tiposContrato: ['CONTRATO'],
        typeRender: [CONTRATO_NOVO, CONTRATO_ANTIGO, CONTRATO_PROCESSO_EXTERNO],
      },
      {
        value: 'IMPEDIMENTO',
        text: 'Certidão negativa de impedimento',
        tiposContrato: ['CONTRATO'],
        typeRender: [CONTRATO_NOVO, CONTRATO_ANTIGO, CONTRATO_PROCESSO_EXTERNO],
      },
      {
        value: 'DEBITOS_TRABALHISTAS',
        text: 'Certidão negativa de débitos trabalhistas',
        tiposContrato: ['CONTRATO'],
        typeRender: [CONTRATO_NOVO, CONTRATO_ANTIGO, CONTRATO_PROCESSO_EXTERNO],
      },
      {
        value: 'COPIA_ORDEM',
        text: 'Cópia da Ordem de Fornecimento',
        tiposContrato: ['EQUIVALENTE_SERVICO'],
        typeRender: [CONTRATO_ANTIGO, CONTRATO_NOVO, CONTRATO_PROCESSO_EXTERNO],
      },
      {
        value: 'COPIA_EMPENHO',
        text: 'Cópia do Empenho',
        tiposContrato: ['EQUIVALENTE_EMPENHO'],
        typeRender: [CONTRATO_NOVO, CONTRATO_ANTIGO, CONTRATO_PROCESSO_EXTERNO],
      },
    ];
  },

  getTipoArquivoRescisaoContrato() {
    return [
      {
        value: 'RESCISAO',
        text: 'Rescisão Contratual',
      },
    ];
  },
  getMotivosRescisaoContrato() {
    return [
      { value: 'RESCISAO', text: 'Rescisão' },
      { value: 'NAO_CUMPRIMENTO', text: 'Não cumprimento ou cumprimento irregular' },
      { value: 'DESATENDIMENTO', text: 'Desatendimento das determinações' },
      { value: 'ALTERACAO_SOCIAL', text: 'Alteração social ou modificação da finalidade' },
      { value: 'FALENCIA', text: 'Falência, insolvência civil, dissolução da sociedade ou falecimento' },
      { value: 'FORTUITO', text: 'Caso fortuito ou de força maior' },
      {
        value: 'LICENCA_AMBIENTAL',
        text: 'Atraso ou impossibilidade de licença ambiental/alteração significativa do anteprojeto em decorrência da licença',
      },
      { value: 'ATRASO_LIBERACAO', text: 'Atraso na liberação das áreas (desapropriação, servidão, desocupação)' },
      { value: 'INTERESSE_PUBLICO', text: 'Razões de interesse público' },
      {
        value: 'RESERVA_CARGOS',
        text: 'Não cumprimento de reserva de cargos (pessoa com deficiência, reabilitado da previdência ou aprendiz)',
      },
      { value: 'OUTROS', text: 'Outros' },
    ];
  },
  getFormasExtincaoContrato() {
    return [
      { value: 'UNILATERAL_POR_ESCRITO', text: 'Ato unilateral da administração: por escrito' },
      {
        value: 'UNILATERAL_CONDUTA_ADMINISTRACAO',
        text: 'Ato unilateral da administração: não pode decorrer de conduta da administração',
      },
      { value: 'CONSENSUAL_CONCILIACAO', text: 'Consensual: conciliação' },
      { value: 'CONSENSUAL_MEDIACAO', text: 'Consensual: mediação' },
      { value: 'CONSENSUAL_COMITE', text: 'Consensual: comitê de resolução de disputas' },
      { value: 'DETERMINACAO_DECISAO_ARBITRAL', text: 'Determinação: por decisão arbitral' },
      { value: 'DETERMINACAO_DECISAO_JUDICIAL', text: 'Determinação: por decisão judicial' },
    ];
  },
  getFasesLicitacaoNum() {
    return [
      { value: 1, text: 'PREPARATORIA' },
      { value: 2, text: 'DIVULGACAO_PUBLICACAO_LICITACAO' },
      { value: 3, text: 'APRESENTACAO_PROPOSTAS_LANCES' },
      { value: 4, text: 'FINALIZACAO' },
    ];
  },

  getTipoProcessoReqModificacao() {
    return [
      { value: 'LICITACAO', text: 'Licitação' },
      { value: 'CARONA', text: 'Carona' },
      { value: 'DISPENSA', text: 'Dispensa' },
      { value: 'INEXIGIBILIDADE', text: 'Inexigibilidade' },
      { value: 'CONTRATO', text: 'Contrato' },
      { value: 'RESCISAO_CONTRATUAL', text: 'Rescisão Contratual' },
      { value: 'ADITIVO', text: 'Aditivo' },
      { value: 'EMPENHO', text: 'Empenho' },
      { value: 'EMPENHO_LICITACAO', text: 'Empenho / Ata de Registro de Preço' },
      { value: 'TERMO_REFERENCIA', text: 'Termo de Referência' },
      { value: 'OBRA_MEDICAO', text: 'Medição de Obra' },
    ];
  },

  getTipoProcessoReqModificacaoSemEmpenho() {
    return [
      { value: 'LICITACAO', text: 'Licitação' },
      { value: 'CARONA', text: 'Carona' },
      { value: 'DISPENSA', text: 'Dispensa' },
      { value: 'INEXIGIBILIDADE', text: 'Inexigibilidade' },
      { value: 'CONTRATO', text: 'Contrato' },
      { value: 'RESCISAO_CONTRATUAL', text: 'Rescisão Contratual' },
      { value: 'ADITIVO', text: 'Aditivo' },
      { value: 'MEDICAO', text: 'Medição' },
      { value: 'TERMO_REFERENCIA', text: 'Termo de Referência' },
      { value: 'OBRA_MEDICAO', text: 'Medição de Obra' },
    ];
  },

  getTipoRevisor() {
    return [
      { value: 'HUMANO', text: 'HUMANO' },
      { value: 'REV_HUMANO', text: 'REV_HUMANO' },
      { value: 'NER_SUBSISTENCIA', text: 'NER_SUBSISTENCIA' },
      { value: 'NER_TINTAS', text: 'NER_TINTAS' },
      { value: 'NER_MEDICAMENTOS', text: 'NER_MEDICAMENTOS' },
      { value: 'NER_GERAL', text: 'NER_GERAL' },
      { value: 'NER_VESTUARIO', text: 'NER_VESTUARIO' },
      { value: 'NER_VEICULOS', text: 'NER_VEICULOS' },
    ];
  },

  getTipoArquivoAditivo() {
    return [
      { value: 'JUSTIFIVATIVA_ADITIVO', text: 'Justificativa' },
      { value: 'PARECER_JURIDICO_ADM', text: 'Parecer Jurídico' },
      { value: 'PUBLICACAO_EXTRATO', text: 'Publicação do resumo do aditivo' },
      { value: 'OUTROS_DOCUMENTOS', text: 'Outros Documentos' },
      { value: 'CONCORDANCIA_FORNECEDOR', text: 'Concordância do Fornecedor' },
      { value: 'PESQUISA_PRECO', text: 'Pesquisa de Preço' },
    ];
  },

  getMotivoAdiamento() {
    return [
      { value: 'ALTERACAO_PRAZO', text: 'Alteração do Prazo' },
      { value: 'ALTERACAO_VALOR', text: 'Alteração de Valor' },
      { value: 'APOSTILAMENTO', text: 'Apostilamento' },
    ];
  },

  getMotivoAlteracao() {
    return [
      { value: 'ORDEM_JUDICIAL', text: 'Ordem Judicial' },
      { value: 'OUTROS', text: 'Outros' },
      { value: 'DESISTENCIA_DO_VENCEDOR', text: 'Desistência do Vencedor' },
    ];
  },

  getTiposProcesso() {
    return [
      { key: 'L', value: 'LICITACAO', text: 'Licitação', lowerText: 'licitacao', textCamelCase: 'Licitacao' },
      { key: 'C', value: 'CARONA', text: 'Adesão (Carona)', lowerText: 'carona', textCamelCase: 'Carona' },
      { key: 'D', value: 'DISPENSA', text: 'Dispensa', lowerText: 'dispensa', textCamelCase: 'Dispensa' },
      {
        key: 'I',
        value: 'INEXIGIBILIDADE',
        text: 'Inexigibilidade',
        lowerText: 'inexigibilidade',
        textCamelCase: 'Inexigibilidade',
      },
    ];
  },

  getTiposAnaliseAutomatica() {
    return [
      { value: 'OBJETO', text: 'Por objeto' },
      { value: 'VALOR', text: 'Por valor' },
    ];
  },

  getCategoriasNaturezaObjeto() {
    return [
      { value: 'OBRAS', text: 'Obras e Serviços de Engenharia' },
      { value: 'COMPRAS', text: 'Compras' },
      { value: 'SERVICOS', text: 'Serviços' },
    ];
  },

  getTiposEmpenho() {
    return [
      { value: 'ORDINARIO', text: 'Ordinário' },
      { value: 'ESTIMATIVO', text: 'Estimativo' },
      { value: 'GLOBAL', text: 'Global' },
    ];
  },

  getTiposLayout() {
    return [
      { value: 'compacto', text: 'Compacto' },
      { value: 'default', text: 'Confortável' },
      { value: 'extenso', text: 'Largo' },
    ];
  },

  getAtributosTipoProcesso(processo) {
    const processos = {
      licitacao: [
        {
          label: 'Tipo do Processo',
          field: '',
          valueFunc: () => getValueByKey(processo.toUpperCase(), this.getTipoProcessoReqModificacao()),
        },
        { label: 'Tipo da Licitação', field: 'tipo', valueFunc: (value) => value?.nome ?? value },
        {
          label: 'Número do Processo Administrativo',
          field: 'numeroProcessoAdm',
          valueFunc: (value) => value,
        },
        { label: 'Usuário', field: 'usuario', valueFunc: (value) => value?.nome },
        {
          label: 'Fontes de Recurso',
          field: 'fontesDeRecurso',
          valueFunc: (value) => value?.map((fonte) => fonte.nome) ?? value,
        },
        { label: 'Entidade', field: 'entidade', valueFunc: (value) => value?.nome ?? value },
        { label: 'Número', field: 'numero', valueFunc: (value) => value },
        { label: 'Ano', field: 'ano', valueFunc: (value) => value },
        { label: 'Objeto', field: 'objeto', valueFunc: (value) => value },
        {
          label: 'Naturezas do Objeto',
          field: 'naturezasDoObjeto',
          valueFunc: (value) => {
            const values = Array.isArray(value) ? value : value.split('; ').filter((e) => e !== '');
            const naturezasObjeto = values.map((v) => {
              const result = getValueByKey(v, this.getNaturezaObjetoLicitacao());
              return result === '-' ? v : result;
            });
            return naturezasObjeto?.join(', ') ?? '-';
          },
        },
        {
          label: 'Termo de Referência',
          field: 'termoReferencia',
          valueFunc: (value) => value?.identificadorProcesso ?? value,
        },
        { label: 'Regência Legal', field: 'regenciaLegal', valueFunc: (value) => value },
        { label: 'Parecerista', field: 'parecerista', valueFunc: (value) => value?.nome ?? value },
        {
          label: 'Valor Estimado',
          field: 'valorEstimado',
          valueFunc: (value) => getValueMoneyIfNotFormatted(value),
        },
        { label: 'Data', field: 'dataAbertura', valueFunc: (value) => getValueDate(value) },
        {
          label: 'Comissão',
          field: 'comissao',
          valueFunc: (value) =>
            typeof value === 'object'
              ? `${value.numero} - ${value.entidade ? value.entidade.nome + ' -' : ''} ${getValueByKey(
                  value.tipo,
                  this.getTipoComissao()
                )}`
              : value,
        },
      ],
      carona: [
        {
          label: 'Tipo do Processo',
          field: '',
          valueFunc: () => getValueByKey(processo.toUpperCase(), this.getTipoProcessoReqModificacao()),
        },
        { label: 'Usuário', field: 'usuario', valueFunc: (value) => value?.nome },
        { label: 'Entidade', field: 'entidade', valueFunc: (value) => value?.nome ?? value },
        {
          label: 'Termo de Referência',
          field: 'termoReferencia',
          valueFunc: (value) => value?.identificadorProcesso ?? value,
        },
        {
          label: 'Número',
          field: 'numeroProcessoAdministrativo',
          valueFunc: (value) => value,
        },
        { label: 'Objeto', field: 'objeto', valueFunc: (value) => value },
        {
          label: 'Valor Estimado',
          field: 'valor',
          valueFunc: (value) => getValueMoneyIfNotFormatted(value),
        },
        { label: 'Data', field: 'dataCadastro', valueFunc: (value) => getValueDate(value) },
        {
          label: 'Licitação',
          field: 'licitacao',
          valueFunc: (value) =>
            typeof value === 'object'
              ? `${value.entidade ? value.entidade.nome : ''} - ${value.modalidadeLicitacao ?? ''} ${value.numero}/${
                  value.ano
                } - Data de abertura: ${getValueDate(value.dataAbertura)}`
              : value,
        },
        {
          label: 'Natureza do Objeto',
          field: 'naturezaDoObjeto',
          valueFunc: (value) => {
            const values = Array.isArray(value) ? value : value.split('; ').filter((e) => e !== '');
            const naturezasObjeto = values.map((v) => {
              const result = getValueByKey(v, this.getNaturezaObjetoLicitacao());
              return result === '-' ? v : result;
            });
            return naturezasObjeto?.join(', ') ?? '-';
          },
        },
      ],
      dispensa: [
        {
          label: 'Tipo do Processo',
          field: '',
          valueFunc: () => getValueByKey(processo.toUpperCase(), this.getTipoProcessoReqModificacao()),
        },
        { label: 'Usuário', field: 'usuario', valueFunc: (value) => value?.nome },
        { label: 'Entidade', field: 'entidade', valueFunc: (value) => value?.nome ?? value },
        { label: 'Número Processo', field: 'numeroProcesso', valueFunc: (value) => value },
        {
          label: 'Termo de Referência',
          field: 'termoReferencia',
          valueFunc: (value) => value?.identificadorProcesso ?? value,
        },
        { label: 'Objeto', field: 'objeto', valueFunc: (value) => value },
        {
          label: 'Valor Estimado',
          field: 'valor',
          valueFunc: (value) => getValueMoneyIfNotFormatted(value),
        },
        { label: 'Data', field: 'dataCadastro', valueFunc: (value) => getValueDate(value) },
        {
          label: 'Naturezas do Objeto',
          field: 'naturezasDoObjeto',
          valueFunc: (value) => {
            const values = Array.isArray(value) ? value : value.split('; ').filter((e) => e !== '');
            const naturezasObjeto = values.map((v) => {
              const result = getValueByKey(v, this.getNaturezaObjetoLicitacao());
              return result === '-' ? v : result;
            });
            return naturezasObjeto?.join(', ') ?? '-';
          },
        },
      ],
      inexigibilidade: [
        {
          label: 'Tipo do Processo',
          field: '',
          valueFunc: () => getValueByKey(processo.toUpperCase(), this.getTipoProcessoReqModificacao()),
        },
        { label: 'Usuário', field: 'usuario', valueFunc: (value) => value?.nome },
        { label: 'Entidade', field: 'entidade', valueFunc: (value) => value?.nome ?? value },
        {
          label: 'Termo de Referência',
          field: 'termoReferencia',
          valueFunc: (value) => value?.identificadorProcesso ?? value,
        },
        {
          label: 'Número do Processo',
          field: 'numeroProcesso',
          valueFunc: (value) => value,
        },
        { label: 'Objeto', field: 'objeto', valueFunc: (value) => value },
        {
          label: 'Valor Estimado',
          field: 'valor',
          valueFunc: (value) => getValueMoneyIfNotFormatted(value),
        },
        {
          label: 'Data',
          field: 'dataPedido',
          valueFunc: (value) => getValueDate(value),
        },
        {
          label: 'Naturezas do Objeto',
          field: 'naturezasDoObjeto',
          valueFunc: (value) => {
            const values = Array.isArray(value) ? value : value.split('; ').filter((e) => e !== '');
            const naturezasObjeto = values.map((v) => {
              const result = getValueByKey(v, this.getNaturezaObjetoLicitacao());
              return result === '-' ? v : result;
            });
            return naturezasObjeto?.join(', ') ?? '-';
          },
        },
      ],
      contrato: [
        {
          label: 'Tipo do Processo',
          field: '',
          valueFunc: () => getValueByKey(processo.toUpperCase(), this.getTipoProcessoReqModificacao()),
        },
        { label: 'Usuário', field: 'usuario', valueFunc: (value) => value?.nome },
        {
          label: 'Modalidade',
          field: 'modalidadeLicitacao',
          valueFunc: (value) => getValueByKey(value, this.getModalidadeLicitacao()),
        },
        { label: 'Entidade', field: 'entidade', valueFunc: (value) => value?.nome ?? value },
        { label: 'Número da Licitação', field: 'numeroLicitacao', valueFunc: (value) => value },
        { label: 'Ano da Licitação', field: 'anoLicitacao', valueFunc: (value) => value },
        { label: 'Objeto', field: 'objeto', valueFunc: (value) => value },
        {
          label: 'Valor Estimado',
          field: 'valorGlobal',
          valueFunc: (value) => getValueMoneyIfNotFormatted(value),
        },
        { label: 'Data', field: 'dataPublicacao', valueFunc: (value) => getValueDate(value) },
        {
          label: 'Permite Aditivo',
          field: 'permiteAditivo',
          valueFunc: (value) => getValueByKey(typeof value === 'boolean' ? value : value === 'true', this.getSimNao()),
        },
      ],
      aditivo: [
        {
          label: 'Tipo do Processo',
          field: '',
          valueFunc: () => getValueByKey(processo.toUpperCase(), this.getTipoProcessoReqModificacao()),
        },
        { label: 'Usuário', field: 'contrato', valueFunc: (contrato) => contrato?.usuario?.nome },
        {
          label: 'Modalidade',
          field: 'contrato',
          valueFunc: (contrato) => getValueByKey(contrato?.modalidadeLicitacao, this.getModalidadeLicitacao()),
        },
        { label: 'Entidade', field: 'contrato', valueFunc: (contrato) => contrato?.entidade?.nome },
        { label: 'Número', field: 'numero', valueFunc: (value) => value },
        { label: 'Ano', field: 'contrato', valueFunc: (contrato) => contrato?.anoLicitacao },
        { label: 'Objeto', field: 'contrato', valueFunc: (contrato) => contrato?.objeto },
        {
          label: 'Valor Estimado',
          field: 'valor',
          valueFunc: (value) => getValueMoneyIfNotFormatted(value),
        },
        { label: 'Data', field: 'dataPublicacao', valueFunc: (value) => getValueDate(value) },
      ],
      rescisao_contratual: [
        {
          label: 'Tipo do Processo',
          field: '',
          valueFunc: () => getValueByKey(processo.toUpperCase(), this.getTipoProcessoReqModificacao()),
        },
        { label: 'Usuário', field: 'usuario', valueFunc: (value) => value?.nome },
        { label: 'Entidade', field: 'entidade', valueFunc: (value) => value?.nome ?? value },
        { label: 'Objeto', field: 'objeto', valueFunc: (value) => value },
        { label: 'Valor Estimado', field: 'valorGlobal', valueFunc: (value) => getValueMoney(value) },
        {
          label: 'Motivo da Rescisão',
          field: 'motivoRescisao',
          valueFunc: (value) => {
            let result = getValueByKey(value, this.getMotivosRescisaoContrato());
            if (result === '-' && value) result = value;
            return result;
          },
        },
        {
          label: 'Forma de Extinção',
          field: 'formaExtincao',
          valueFunc: (value) => {
            let result = getValueByKey(value, this.getFormasExtincaoContrato());
            if (result === '-' && value) result = value;
            return result;
          },
        },
        {
          label: 'Descrição da Rescisão',
          field: 'descricaoRescisao',
          valueFunc: (value) => value,
        },
        {
          label: 'Data da Rescisão',
          field: 'dataAvisoRescisao',
          valueFunc: (value) => getValueDate(value),
        },
      ],
      termo_referencia: [
        {
          label: 'Tipo do Processo',
          field: '',
          valueFunc: () => getValueByKey(processo.toUpperCase(), this.getTipoProcessoReqModificacao()),
        },
        { label: 'Usuário', field: 'usuario', valueFunc: (value) => value?.nome },
        { label: 'Entidade', field: 'entidade', valueFunc: (value) => value?.nome ?? value },
        { label: 'Data de Cadastro', field: 'dataCadastro', valueFunc: (value) => getValueDate(value) },
        { label: 'Identificador do Processo', field: 'identificadorProcesso', valueFunc: (value) => value },
        {
          label: 'É SRP?',
          field: 'srp',
          valueFunc: (value) => getValueByKey(typeof value === 'boolean' ? value : value === 'true', this.getSimNao()),
        },
        {
          label: 'Itens com 3 casas decimais',
          field: 'tresCasasDecimais',
          valueFunc: (value) => getValueByKey(typeof value === 'boolean' ? value : value === 'true', this.getSimNao()),
        },
        {
          label: 'Forma de Preenchimento das Seções',
          field: 'formaPreenchimentoSecao',
          valueFunc: (value) => {
            let result = getValueByKey(value, this.getFormaPreenchimentoSecaoTermoReferencia());
            if (result === '-' && value) result = value;
            return result;
          },
        },
        {
          label: 'É Obra de Engenharia / Serviço Especial de Engenharia',
          field: 'obraEngenharia',
          valueFunc: (value) => getValueByKey(typeof value === 'boolean' ? value : value === 'true', this.getSimNao()),
        },
      ],
      obra_medicao: [
        {
          label: 'Tipo do Processo',
          field: '',
          valueFunc: () => getValueByKey(processo.toUpperCase(), this.getTipoProcessoReqModificacao()),
        },
        { label: 'Usuário', field: 'usuario', valueFunc: (value) => value?.nome },
        {
          label: 'Obra',
          field: 'obra',
          valueFunc: (value) =>
            'Obra ' +
              getValueByKey(value?.status, this.getStatusObra()) +
              ', Categoria: ' +
              value?.categoria?.nome +
              ', Tipo: ' +
              value?.tipo?.nome ?? value,
        },
        { label: 'Data de Medição', field: 'dataMedicao', valueFunc: (value) => getValueDate(value) },
        { label: 'Valor Pago', field: 'valorEmpenhado', valueFunc: (value) => getValueMoneyIfNotFormatted(value) },
        { label: 'Número do Empenho', field: 'numeroEmpenho', valueFunc: (value) => value },
      ],
    };
    return processos[processo];
  },

  getTipoSelecaoMapa() {
    return [
      { value: 'PONTO', text: 'Ponto' },
      { value: 'LINHA', text: 'Linha' },
      { value: 'POLIGONO', text: 'Polígono' },
    ];
  },

  getSituacaoItemChecklist() {
    return [
      { value: 'SIM', text: 'Sim' },
      { value: 'NAO', text: 'Não' },
      { value: 'JUSTIFICADO', text: 'Justificado' },
      { value: 'NAO_APLICA', text: 'Não se aplica' },
    ];
  },

  getColumnDataAberturaByTipoProcesso(tipoProcesso) {
    return { licitacao: 'dataAbertura', carona: 'dataAdesao', inexigibilidade: 'dataPedido', dispensa: 'dataPedido' }[
      tipoProcesso
    ];
  },

  getColumnPregoeiroResponsavelByTipoProcesso(tipoProcesso) {
    return {
      licitacao: 'pregoeiro',
      carona: 'responsavelAdesao',
      inexigibilidade: {
        responsavelHomologacao: 'responsavelHomologacao',
        responsavelRatificacao: 'responsavelRatificacao',
      },
      dispensa: 'gestor',
    }[tipoProcesso];
  },

  getColumnValorEstimadoByTipoProcesso(tipoProcesso) {
    return { licitacao: 'valorEstimado', carona: 'valor', inexigibilidade: 'valor', dispensa: 'valor' }[tipoProcesso];
  },

  getColumnNumeroProcessoByTipoProcesso(tipoProcesso) {
    return {
      licitacao: 'numeroProcessoAdm',
      carona: 'numeroProcessoAdministrativo',
      inexigibilidade: 'numeroProcesso',
      dispensa: 'numeroProcesso',
    }[tipoProcesso];
  },

  getColumnItemLicitanteByTipoProcesso(tipoProcesso) {
    return {
      L: 'vencedor',
      C: 'detentor',
      I: 'fornecedorInexigibilidade',
      D: 'fornecedorDispensa',
    }[tipoProcesso];
  },

  getMaterialAttributes() {
    return ['descricaoDetalhamento', 'descricao', 'codigo', 'capacidadeEmbalagem'];
  },

  getMaterialAttributesEntidades() {
    return ['unidadeMedida', 'materialEmbalagem', 'tipoEmbalagem'];
  },

  getLabelRequisicaoModificacao() {
    return {
      ADICAO: { label: 'Adicionado', color: 'green', labelInf: 'Adição' },
      REMOCAO: { label: 'Removido', color: 'red', labelInf: 'Remoção' },
      EDICAO: { label: 'Editado', color: '#2196F3', labelInf: 'Edição' },
    };
  },

  getLabelByAttribute(atributo) {
    const atributos = {
      fiscal: 'Fiscal',
      fundamentacaoLegalEntidade: 'Fundamentação Legal',
      gestor: 'Gestor',
      licitantes: 'Licitante',
      numeroProcessoSEI: 'Número do Processo Administrativo',
      observacoes: 'Observações',
      responsavelRatificacao: 'Responsável pela Ratificação',
      status: 'Status',
      tipo: 'Tipo',
      fontesDeRecurso: 'Fontes de Recurso',
      numero: 'Número',
      naturezaDoObjeto: 'Natureza do Objeto',
      naturezasDoObjeto: 'Naturezas do Objeto',
      dataPedido: 'Data do Pedido',
      responsavelAdesao: 'Responsável pela Adesão',
      numeroProcessoGerenciadorAta: 'Número do Processo Gerenciador da Ata',
      dataAdesao: 'Data da Adesão',
      entidadeOrigem: 'Entidade de Origem',
      tipoObra: 'Tipo da Obra',
      modalidadeLicitacaoNova: 'Modalidade da Licitação',
      categoriaObra: 'Categoria da Obra',
      coordenadas: 'Coordenadas',
      pregoeiro: 'Pregoeiro',
      orgaosParticipantes: 'Orgãos Participantes',
      acatadoJustificado: 'Acatado/Justificado',
      gestorSubstituto: 'Gestor Substituto',
      dataVigenciaInicial: 'Data de Início da Vigência',
      numeroContratoSei: 'Número do Contrato SEI',
      numeroDoe: 'Número DOE',
      fiscalSubstituto: 'Fiscal Substituto',
      dataVigenciaFinal: 'Data de Fim da Vigência',
      gestorTitular: 'Gestor Titular',
      gestorSuplente: 'Gestor Suplente',
      justificativa: 'Justificativa',
      fiscalSuplente: 'Fiscal Suplente',
      fiscalAditivo: 'Fiscal do Aditivo',
      outroMotivoRescisao: 'Outro Motivo da Rescisão',
      garantias: 'Garantias',
      valorEstimado: 'Valor Estimado',
      objeto: 'Objeto',
      ano: 'Ano',
      regenciaLegal: 'Regência Legal',
      dataAbertura: 'Data de Abertura',
      comissao: 'Comissão',
      modalidade: 'Modalidade',
      parecerista: 'Parecerista',
      obra: 'Obra',
      valor: 'Valor',
      dataValidadeAta: 'Data de Validade da Ata',
      numeroProcessoAdministrativo: 'Número do Processo Administrativo',
      numeroProcessoAdm: 'Número do Processo Administrativo',
      fundamentacao: 'Fundamentação',
      numeroProcesso: 'Número do Processo',
      origem: 'Origem',
      permiteAditivo: 'Permite Aditivo',
      dataPublicacao: 'Data da Publicação',
      motivoRescisao: 'Motivo da Rescisão',
      dataAvisoRescisao: 'Data de Aviso da Rescisão',
      formaExtincao: 'Forma da Extinção',
      descricaoRescisao: 'Descrição da Rescisão',
      identificadorProcesso: 'Identificador do Processo',
      srp: 'Srp',
      tresCasasDecimais: 'Termo com Três Casas Decimais',
      entidade: 'Entidade',
      descricao: 'Descrição',
      dataMedicao: 'Data de Medição',
      valorEmpenhado: 'Valor Pago',
      numEmpenho: 'Número do Empenho',
      percConclusao: 'Percentual de Conclusão',
      obraEngenharia: 'Obra de Engenharia / Serviço Especial de Engenharia',
    };

    return atributos[atributo];
  },

  getGarantiasContrato() {
    return [
      { name: 'Caução em dinheiro ou em títulos da dívida pública', code: 'CAUCAO_DINHEIRO' },
      { name: 'Seguro garantia', code: 'SEGURO_GARANTIA' },
      { name: 'Fiança bancária', code: 'FIANCA_BANCARIA' },
    ];
  },

  getTiposConsulta() {
    return [
      { value: false, text: 'Materiais', name: 'materiais', singularText: 'Material' },
      { value: true, text: 'Serviços', name: 'servicos', singularText: 'Serviço' },
    ];
  },

  getColumnsMatrizRisco(tiposProcessos) {
    const columns = [
      { value: 'VALOR_ESTIMADO', text: 'Valor estimado', type: 'numeric', relations: ['C', 'L'] },
      { value: 'MODALIDADE_LICITACAO', text: 'Modalidade licitação', type: 'varchar', relations: ['L'] },
      { value: 'TIPOS_LICITACAO', text: 'Critério de Julgamento', type: 'list', relations: ['L'] },
      { value: 'NATUREZAS_OBJETO', text: 'Naturezas de objeto', type: 'list', relations: ['L'] },
      { value: 'PERMITE_CONSORCIO', text: 'Permite Consórcio', type: 'boolean', relations: ['L'] },
    ];

    const result = columns?.filter((column) => {
      let exist = true;
      tiposProcessos?.forEach((tipo) => {
        if (!column.relations.includes(tipo.tipoProcesso)) {
          exist = false;
          return;
        }
      });
      return exist;
    });
    return result;
  },

  getTipoComparacao() {
    return [
      { value: 'IGUAL_A', text: 'Igual a', compatible: ['numeric', 'varchar', 'boolean'] },
      { value: 'MAIOR_QUE', text: 'Maior que', compatible: ['numeric'] },
      { value: 'MENOR_QUE', text: 'Menor que', compatible: ['numeric'] },
      { value: 'DIFERENTE_DE', text: 'Diferente de', compatible: ['numeric', 'varchar'] },
      { value: 'MAIOR_OU_IGUAL_A', text: 'Maior ou igual a', compatible: ['numeric'] },
      { value: 'MENOR_OU_IGUAL_A', text: 'Menor ou igual a', compatible: ['numeric'] },
      { value: 'INTERVALO', text: 'Intervalo', compatible: ['numeric'] },
      { value: 'CONTEM', text: 'Contém', compatible: ['list'] },
    ];
  },

  getStatusAlertaAnalise() {
    return [
      { value: 'ENCAMINHADO', text: 'Encaminhado' },
      { value: 'DEVOLVIDO', text: 'Devolvido' },
      { value: 'JURISDICIONADO', text: 'Com Jurisdicionados' },
      { value: 'ESCLARECIDO', text: 'Esclarecimentos Iniciais' },
      { value: 'RESPONDIDO', text: 'Respondido' },
      { value: 'ARQUIVADO', text: 'Arquivado' },
      { value: 'AUDITOR_ATRIBUIDOR', text: 'Com Auditor Atribuidor' },
      { value: 'REJEITADO_AUDITOR_ATRIBUIDOR', text: 'Rejeitado pelo Auditor Atribuidor' },
    ];
  },

  getStatusMonitoramentoAtosDiarioOficial() {
    return [
      { value: 'EM_EXTRACAO', text: 'Diário sem atos' },
      { value: 'EM_CLASSIFICACAO', text: 'Diário em processamento' },
      { value: 'EXTRAINDO_INFORMACOES', text: 'Extraindo informações' },
      { value: 'PROCESSADO', text: 'Processado' },
    ];
  },

  getStatusProcessamentoAtosLicDiarioOficial() {
    return [
      { value: 'CLASSIFICADO', text: 'Classificado' },
      { value: 'NER_APLICADO', text: 'NER Aplicado' },
    ];
  },

  getStatusProcessamentoEditaisLicitacao() {
    return [
      { value: 'EM_EXTRACAO', text: 'Em Extração' },
      { value: 'EM_CLASSIFICACAO', text: 'Em Classificação' },
      { value: 'PROCESSADO', text: 'Processado' },
    ];
  },

  getClassificacaoSentencaEdital() {
    return [
      { value: 'OBJETO', text: 'Objeto', color: '#f6eddc' },
      { value: 'QUALIFICACAO_TECNICA', text: 'Qualificação Técnica', color: '#e3e5d7' },
      { value: 'PRAZO_DE_PAGAMENTO', text: 'Prazo de Pagamento', color: '#bdd6d2' },
      { value: 'CLAUSULA_DE_ATRASO', text: 'Cláusula de Atraso', color: '#a5c8ca' },
      { value: 'PRAZO_DE_ENTREGA', text: 'Prazo de Entrega', color: '#a1c1be' },
      { value: 'LOCAL_ENTREGA_OU_EXECUCAO', text: 'Local de Entrega ou Execução', color: '#facf7d' },
      { value: 'OUTRO', text: 'Outro', color: '#f0f0d8' },
    ];
  },

  getStatusObra() {
    return [
      { value: 'NAO_INICIADA', text: 'Não iniciada' },
      { value: 'EM_ANDAMENTO', text: 'Em andamento' },
      { value: 'FINALIZADA', text: 'Finalizada' },
      { value: 'INTERROMPIDA', text: 'Interrompida' },
      { value: 'PARALISADA', text: 'Paralisada' },
      { value: 'DESCONHECIDO', text: 'Desconhecido' },
    ];
  },

  getPercentualConclusaoObra() {
    return [
      { value: 0, text: '0%' },
      { value: 25, text: '25%' },
      { value: 50, text: '50%' },
      { value: 75, text: '75%' },
      { value: 100, text: '100%' },
    ];
  },

  getLabelByStatusAlerta() {
    return [
      {
        value: 'ALERTA_RESPONDIDO',
        text: 'Respondido',
        backgroundColor: '#f4fcf7',
        color: '#22c55e',
        border: '1px solid #22c55e',
        tooltip: 'Alerta Respondido pelo Jurisdicionado',
      },
      {
        value: 'ALERTA_ENVIADO',
        text: 'Diretor DAFO',
        backgroundColor: '#fff8f3',
        color: '#f97316',
        border: '1px solid #f97316',
        tooltip: 'Alerta Enviado ao Diretor da DAFO',
      },
      {
        value: 'ALERTA_RECEBIDO',
        text: 'Com Jurisdicionado',
        backgroundColor: '#fefbf3',
        color: '#eab308',
        border: '1px solid #eab308',
        tooltip: 'Alerta Enviado ao Jurisdicionado',
      },
      {
        value: 'ALERTA_AUDITOR_ATRIBUIDOR',
        text: 'Inspetor',
        backgroundColor: '#fefbf3',
        color: '#422343',
        border: '1px solid #422343',
        tooltip: 'Alerta Enviado ao Inspetor',
      },
      {
        value: 'ALERTA_REJEITADO_AUDITOR_ATRIBUIDOR',
        text: 'Rejeitado',
        backgroundColor: '#fefbf3',
        color: '#ff3d32',
        border: '1px solid #ff3d32',
        tooltip: 'Alerta Rejeitado pelo Inspetor',
      },
    ];
  },

  getStatusArquivamento() {
    return [
      { value: 'CONSISTENTE', label: 'Consistente', color: '#008100' },
      { value: 'INCONSISTENTE', label: 'Inconsistente', color: '#fec90d' },
      { value: 'INCONSISTENCIA_NAO_RESOLVIDA', label: 'Inconsistência não resolvida', color: '#de0d18' },
      { value: 'REJEITADO', label: 'Rejeitado', color: '#de0d18' },
      { value: 'ARQUIVADO_AUTOMATICAMENTE', label: 'Arquivado automaticamente', color: '#460184' },
    ];
  },

  getTipoArquivoObraMedicao() {
    return [
      { value: 'PLANILHA_MEDICOES', text: 'Planilha de medições' },
      { value: 'IMAGEM_MEDICAO', text: 'Imagem de medição' },
      { value: 'OUTROS_DOCUMENTOS', text: 'Outros documentos' },
    ];
  },

  getStatusMatchMapeamentoAtoLicitacao() {
    return [
      { value: 'CONFIRMADO', text: 'Mapeado' },
      { value: 'NAO_CONFIRMADO', text: 'Mapeado Automático' },
      { value: 'NAO_MAPEADO', text: 'Não Mapeado' },
    ];
  },

  getTipoTermoReferencia() {
    return [
      { value: 'ITENS', text: 'Itens' },
      { value: 'LOTES', text: 'Lotes' },
    ];
  },

  getTipoArquivoRelatorioObra() {
    return [{ value: 'PLANILHA_ORCAMENTARIA', text: 'Planilha Orcamentaria' }];
  },
};

export default DadosEstaticosService;
