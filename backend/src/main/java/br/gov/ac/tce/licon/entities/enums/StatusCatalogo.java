package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum StatusCatalogo implements EnumValor {

    A("Ativo"),
    I("Inativo");

    private final String valor;

    StatusCatalogo(String valor) {
        this.valor = valor;
    }
}
