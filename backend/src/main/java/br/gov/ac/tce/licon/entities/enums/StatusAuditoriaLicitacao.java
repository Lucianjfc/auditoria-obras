package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum StatusAuditoriaLicitacao implements EnumValor {

    ANALISE("Em análise"),
    CONSISTENTE("Consistente"),
    INCONSISTENTE("Inconsistente"),
    INCONSISTENCIA_RESOLVIDA("Inconsistência resolvida"),
    INCONSISTENCIA_NAO_RESOLVIDA("Inconsistência não resolvida"),
    ARQUIVADO_AUTOMATICAMENTE("Arquivado automaticamente"),
    REJEITADO("Rejeitado");

    private String valor;

    StatusAuditoriaLicitacao(String valor) {
        this.valor = valor;
    }

}
