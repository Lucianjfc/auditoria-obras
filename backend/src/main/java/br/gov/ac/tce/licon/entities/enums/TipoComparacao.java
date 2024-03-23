package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum TipoComparacao implements EnumValor {

    IGUAL_A("IGUAL_A"),
    MAIOR_QUE("MAIOR_QUE"),
    MENOR_QUE("MENOR_QUE"),
    DIFERENTE_DE("DIFERENTE_DE"),
    MAIOR_OU_IGUAL_A("MAIOR_OU_IGUAL_A"),
    MENOR_OU_IGUAL_A("MENOR_OU_IGUAL_A"),
    CONTEM("CONTEM"),
    INTERVALO("INTERVALO");

    private String valor;

    TipoComparacao(String valor) {
        this.valor = valor;
    }

}
