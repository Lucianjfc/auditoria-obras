package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum SimNao implements EnumValor {

    S("Sim"),
    N("Não");

    private final String valor;

    SimNao(String valor) {
        this.valor = valor;
    }
}
