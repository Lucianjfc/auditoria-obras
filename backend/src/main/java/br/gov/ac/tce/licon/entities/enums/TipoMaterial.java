package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum TipoMaterial implements EnumValor {

    M("Material"),
    S("Serviço");

    private final String valor;

    TipoMaterial(String valor) {
        this.valor = valor;
    }
}
