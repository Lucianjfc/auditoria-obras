package br.gov.ac.tce.licon.entities.enums;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum TipoArquivoLicitacao implements TipoArquivo, EnumValor {

    AUTORIZACAO_ABERTURA_LICITACAO_ORDENADOR_DESPESA("Justificativa para contratação",
            new FaseLicitacao[]{FaseLicitacao.PREPARATORIA}),
    PROJETO_BASICO("Termo de Referência ou Projeto básico",
            new FaseLicitacao[]{FaseLicitacao.PREPARATORIA}),
    PESQUISA_PRECO_PUBLICO("Pesquisa de preço praticado por Órgãos e Entidades da Administração Pública", new FaseLicitacao[]{
            FaseLicitacao.PREPARATORIA
    }),
    PESQUISA_PRECO_MERCADO("Pesquisa de preço de mercado", new FaseLicitacao[]{
            FaseLicitacao.PREPARATORIA
    }),
    MAPA_COMPARATIVO_PRECOS("Mapa Comparativo de Preços", new FaseLicitacao[]{
            FaseLicitacao.PREPARATORIA
    }),
    DESCRICAO_NECESSIDADE_CONTRATACAO("Descrição da necessidade da contratação", new FaseLicitacao[]{
            FaseLicitacao.PREPARATORIA
    }),
    DOCUMENTO_FORMALIZACAO_DEMANDA("Documento de Formalização de Demanda, com a descrição da necessidade da contratação", new FaseLicitacao[]{
            FaseLicitacao.PREPARATORIA
    }),
    ESTUDO_TECNICO_PRELIMINAR("Estudo Técnico Preliminar", new FaseLicitacao[]{
            FaseLicitacao.PREPARATORIA
    }),
    PARECER_JURIDICO_APROVACAO_MINUTAS("Parecer jurídico aprovando as minutas do edital e do contrato", new FaseLicitacao[]{
            FaseLicitacao.PREPARATORIA
    }),
    ESTIMATIVA_PRECO("Estimativa de preço detalhada, incluindo pesquisa de mercado e mapa comparativo",
            new FaseLicitacao[]{
                    FaseLicitacao.PREPARATORIA
            }),
    ORCAMENTO_ESTIMATIVO("Orçamento Estimativo - 1ª Etapa - (Planilha Excel)",
            new FaseLicitacao[]{
                    FaseLicitacao.PREPARATORIA
            }),
    OUTROS_DOCUMENTOS("Outros documentos", new FaseLicitacao[]{
            FaseLicitacao.PREPARATORIA
    }),
    EDITAL_PROJETO_BASICO("Edital e Anexos",
            new FaseLicitacao[]{
                    FaseLicitacao.PREPARATORIA
            }),

    PARECER_ASSESSORIA_JURIDICA("Parecer Jurídico",
            new FaseLicitacao[]{
                    FaseLicitacao.DIVULGACAO_PUBLICACAO_LICITACAO
            }),
    COMPROVANTE_PUBLICACOES("Comprovante das publicações do aviso de licitação",
            new FaseLicitacao[]{
                    FaseLicitacao.DIVULGACAO_PUBLICACAO_LICITACAO
            }),
    COMPROVANTE_DIVULGACAO_PNCP("Comprovante de divulgação e manutenção do inteiro teor do ato convocatório e de seus anexos no Portal Nacional de Contratações Públicas (PNCP)", new FaseLicitacao[]{
            FaseLicitacao.DIVULGACAO_PUBLICACAO_LICITACAO
    }),

    OUTROS_DOCUMENTOS_INTERNO("Outros documentos",
            new FaseLicitacao[]{
                    FaseLicitacao.DIVULGACAO_PUBLICACAO_LICITACAO
            }),

    MAPA_LANCES("Mapa de Lances",
            new FaseLicitacao[]{
                    FaseLicitacao.APRESENTACAO_PROPOSTAS_LANCES
            }),

    ATA_SESSAO("Ata da sessão da licitação",
            new FaseLicitacao[]{
                    FaseLicitacao.APRESENTACAO_PROPOSTAS_LANCES
            }),

    PROPOSTAS_VENCEDORAS("Propostas vencedoras",
            new FaseLicitacao[]{
                    FaseLicitacao.APRESENTACAO_PROPOSTAS_LANCES
            }),
    OUTROS_DOCUMENTOS_EXTERNO("Outros documentos",
            new FaseLicitacao[]{
                    FaseLicitacao.APRESENTACAO_PROPOSTAS_LANCES,
                    FaseLicitacao.FINALIZACAO
            }),
    RECURSOS("Recursos",
            new FaseLicitacao[]{
                    FaseLicitacao.FINALIZACAO
            }),

    TERMO_ADJUDICACAO("Termo de Adjudicação",
            new FaseLicitacao[]{
                    FaseLicitacao.FINALIZACAO
            }),

    TERMO_HOMOLOGACAO("Termo de Homologação",
            new FaseLicitacao[]{
                    FaseLicitacao.FINALIZACAO
            }),
    ATA_REGISTRO_PRECOS("Ata de Registro de Preços",
            new FaseLicitacao[]{
                    FaseLicitacao.FINALIZACAO
            }),
    PROPOSTA_ADJUDICADA("Proposta Adjudicada - 2ª Etapa - (Planilha Excel)",
            new FaseLicitacao[]{
                    FaseLicitacao.FINALIZACAO
            });

    private final String valor;
    private final FaseLicitacao[] fases;

    TipoArquivoLicitacao(String valor, FaseLicitacao[] fases) {
        this.valor = valor;
        this.fases = fases;
    }

    public static List<TipoArquivoLicitacao> getTipoArquivoLicitacaoPorFase(FaseLicitacao faseLicitacao) {
        List<TipoArquivoLicitacao> resultado = new ArrayList<>();

        for (TipoArquivoLicitacao tipoArquivoLicitacao : values()) {
            if (contains(faseLicitacao, tipoArquivoLicitacao.getFases())) {
                resultado.add(tipoArquivoLicitacao);
            }
        }

        return resultado;
    }

    private static boolean contains(FaseLicitacao faseLicitacaoEsperada, FaseLicitacao[] fases) {
        for (FaseLicitacao faseLicitacao : fases) {
            if (faseLicitacaoEsperada == faseLicitacao) {
                return true;
            }
        }
        return false;
    }

    @Override
    public String getTipo() {
        return this.name();
    }
}
