package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum StatusProcessamentoEditalLicitacao implements EnumValor {

    EM_EXTRACAO("Em Extração"),
    EM_CLASSIFICACAO("Em Classificação"),
    PROCESSADO("Processado");

    private String valor;

    StatusProcessamentoEditalLicitacao(String valor) {
        this.valor = valor;
    }
}
