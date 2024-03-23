package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString

public enum TipoDeItem implements EnumValor {

    TEXTUAL("Textual"),
    BOOLEAN("Boolean"),
    TEMPORAL("Temporal"),
    NUMERO("Numérico"),
    MONETARIO("Monetário");

    private String valor;

    TipoDeItem(String valor) {
        this.valor = valor;
    }
}
