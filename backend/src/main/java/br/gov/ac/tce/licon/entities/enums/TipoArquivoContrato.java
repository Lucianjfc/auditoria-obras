package br.gov.ac.tce.licon.entities.enums;

import br.gov.ac.tce.licon.utils.Constantes;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum TipoArquivoContrato implements TipoArquivo, EnumValor {
    MANIFESTACAO("Manifestação de interesse",
            new FormaContrato[]{
                    FormaContrato.CONTRATO, FormaContrato.EQUIVALENTE_SERVICO, FormaContrato.EQUIVALENTE_EMPENHO
            }, new String[]{Constantes.CONTRATO_PROCESSO_EXTERNO}),
    FORMALIZACAO("Formalização da demanda",
            new FormaContrato[]{
                    FormaContrato.CONTRATO, FormaContrato.EQUIVALENTE_SERVICO, FormaContrato.EQUIVALENTE_EMPENHO
            }, new String[]{Constantes.CONTRATO_PROCESSO_EXTERNO}),
    ACEITE_PARTICIPACAO("Aceite de participação pelo órgão gerenciador",
            new FormaContrato[]{
                    FormaContrato.CONTRATO, FormaContrato.EQUIVALENTE_SERVICO, FormaContrato.EQUIVALENTE_EMPENHO
            }, new String[]{Constantes.CONTRATO_PROCESSO_EXTERNO}),
    JUSTIFICATIVA_CONTRATACAO("Justificativa da contratação",
            new FormaContrato[]{
                    FormaContrato.CONTRATO, FormaContrato.EQUIVALENTE_SERVICO, FormaContrato.EQUIVALENTE_EMPENHO
            }, new String[]{Constantes.CONTRATO_PROCESSO_EXTERNO}),
    EDITAL_ANEXOS("Edital e Anexos",
            new FormaContrato[]{
                    FormaContrato.CONTRATO, FormaContrato.EQUIVALENTE_SERVICO, FormaContrato.EQUIVALENTE_EMPENHO
            }, new String[]{Constantes.CONTRATO_PROCESSO_EXTERNO}),
    ATA("Ata de Registro de Preços",
            new FormaContrato[]{
                    FormaContrato.CONTRATO, FormaContrato.EQUIVALENTE_SERVICO, FormaContrato.EQUIVALENTE_EMPENHO
            }, new String[]{Constantes.CONTRATO_PROCESSO_EXTERNO}),
    PROPOSTA("Proposta do Vencedor",
            new FormaContrato[]{
                    FormaContrato.CONTRATO, FormaContrato.EQUIVALENTE_SERVICO, FormaContrato.EQUIVALENTE_EMPENHO
            }, new String[]{Constantes.CONTRATO_PROCESSO_EXTERNO}),
    HOMOLOGACAO("Homologação",
            new FormaContrato[]{
                    FormaContrato.CONTRATO, FormaContrato.EQUIVALENTE_SERVICO, FormaContrato.EQUIVALENTE_EMPENHO
            }, new String[]{Constantes.CONTRATO_PROCESSO_EXTERNO}),
    COPIA_CONTRATO("Contrato",
            new FormaContrato[]{
                    FormaContrato.CONTRATO
            }, new String[]{Constantes.CONTRATO_ANTIGO, Constantes.CONTRATO_NOVO, Constantes.CONTRATO_PROCESSO_EXTERNO}),
    COPIA_EMPENHO("Cópia do Empenho",
            new FormaContrato[]{
                    FormaContrato.EQUIVALENTE_EMPENHO
            }, new String[]{Constantes.CONTRATO_ANTIGO, Constantes.CONTRATO_NOVO, Constantes.CONTRATO_PROCESSO_EXTERNO}),
    GARANTIA("Garantia contratual",
            new FormaContrato[]{
                    FormaContrato.CONTRATO
            }, new String[]{Constantes.CONTRATO_ANTIGO, Constantes.CONTRATO_NOVO, Constantes.CONTRATO_PROCESSO_EXTERNO}),
    RESUMO("Publicação do resumo do contrato", new FormaContrato[]{}, new String[]{Constantes.CONTRATO_ANTIGO, Constantes.CONTRATO_NOVO, Constantes.CONTRATO_PROCESSO_EXTERNO}),
    ORDERM("Ordem de entrega ou de serviço", new FormaContrato[]{}, new String[]{Constantes.CONTRATO_ANTIGO}),
    DESIGNACAO("Designação do gestor e fiscal",
            new FormaContrato[]{
                    FormaContrato.CONTRATO
            }, new String[]{Constantes.CONTRATO_ANTIGO, Constantes.CONTRATO_NOVO, Constantes.CONTRATO_PROCESSO_EXTERNO}),
    LICENCA("Licença ambiental", new FormaContrato[]{}, new String[]{Constantes.CONTRATO_ANTIGO}),
    OUTROS_DOCUMENTOS("Outros documentos", new FormaContrato[]{}, new String[]{Constantes.CONTRATO_ANTIGO, Constantes.CONTRATO_NOVO, Constantes.CONTRATO_PROCESSO_EXTERNO}),
    RESCISAO("Rescisão Contratual", new FormaContrato[]{}),
    EMPENHO("Empenho", new FormaContrato[]{}),
    INIDONEIDADE("Certidão negativa de inidoneidade",
            new FormaContrato[]{
                    FormaContrato.CONTRATO
            }, new String[]{Constantes.CONTRATO_ANTIGO, Constantes.CONTRATO_NOVO, Constantes.CONTRATO_PROCESSO_EXTERNO}),
    IMPEDIMENTO("Certidão negativa de impedimento",
            new FormaContrato[]{
                    FormaContrato.CONTRATO
            }, new String[]{Constantes.CONTRATO_ANTIGO, Constantes.CONTRATO_NOVO, Constantes.CONTRATO_PROCESSO_EXTERNO}),
    DEBITOS_TRABALHISTAS("Certidão negativa de débitos trabalhistas",
            new FormaContrato[]{
                    FormaContrato.CONTRATO
            }, new String[]{Constantes.CONTRATO_ANTIGO, Constantes.CONTRATO_NOVO, Constantes.CONTRATO_PROCESSO_EXTERNO}),
    COPIA_ORDEM("Cópia da Ordem de Fornecimento",
            new FormaContrato[]{
                    FormaContrato.EQUIVALENTE_SERVICO
            }, new String[]{Constantes.CONTRATO_ANTIGO, Constantes.CONTRATO_NOVO, Constantes.CONTRATO_PROCESSO_EXTERNO});

    private final String valor;

    private final FormaContrato[] formas;

    private String[] tiposContrato;

    TipoArquivoContrato(String valor, FormaContrato[] formas, String[] tiposContrato) {
        this.valor = valor;
        this.formas = formas;
        this.tiposContrato = tiposContrato;
    }

    TipoArquivoContrato(String valor, FormaContrato[] formas) {
        this.valor = valor;
        this.formas = formas;
    }

    @Override
    public String getTipo() {
        return this.name();
    }
}
