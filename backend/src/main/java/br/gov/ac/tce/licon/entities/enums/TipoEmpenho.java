package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum TipoEmpenho implements EnumValor {

    GLOBAL("Global"),
    ESTIMATIVO("Estimativo"),
    ORDINARIO("Ordinário");

    private String valor;

    TipoEmpenho(String valor) {
        this.valor = valor;
    }
}
