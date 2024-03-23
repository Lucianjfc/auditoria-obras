package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum StatusOcorrenciaLicitacao implements EnumValor {

    CANCELADA("Cancelada"),
    PRORROGADA("Prorrogada"),
    SUSPENSA("Suspensa"),
    REVOGADA("Revogada"),
    ANULADA("Anulada"),
    SUSPENSA_DETERMINACAO_JUDICIAL("Suspensa por determinacao judicial"),
    EDITAL_IMPUGNADO_ANALISE("Edital impugnado em análise"),
    SUSTADA_MEDIDA_CAUTELAR("Sustada por medida cautelar"),
    ADJUDICADA("Adjudicada"),
    HOMOLOGADA("Homologada"),
    DESERTA("Deserta"),
    FRACASSADA("Fracassada"),
    RETIFICACAO_EDITAL("Retificação do Edital"),
    REABRIR("Reabertura"),
    ATA_REGISTRO_PRECOS("Ata de registro de preço"),
    REEDICAO("Reedição (Em casos de deserta ou fracassada)"),
    OUTRA("Outra"),
    OUTROS_PRORROGAR("Outros");

    private String	valor;

    StatusOcorrenciaLicitacao(String valor) {
        this.valor = valor;
    }

}
