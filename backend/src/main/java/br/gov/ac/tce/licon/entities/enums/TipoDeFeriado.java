package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString

public enum TipoDeFeriado implements EnumValor {

    MUNICIPAL("Municipal"),
    ESTADUAL("Estadual"),
    FEDERAL("Federal");

    private String valor;

    TipoDeFeriado(String valor) {
        this.valor = valor;
    }

}
