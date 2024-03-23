package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum StatusNotificacao implements EnumValor {

    EMITIDA("Emitida"),
    VIZUALIZADA("Vizualizada"),
    REMOVIDA("Removida"),
    CLICADA("Clicada");

    private String valor;

    StatusNotificacao(String valor) {
        this.valor = valor;
    }

}
