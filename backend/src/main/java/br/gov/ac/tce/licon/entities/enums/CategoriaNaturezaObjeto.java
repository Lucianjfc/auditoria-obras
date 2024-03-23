package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum CategoriaNaturezaObjeto implements EnumValor {

    OBRAS("Obras e Serviços de Engenharia"),
    COMPRAS("Compras"),
    SERVICOS("Serviços");

    private String valor;

    CategoriaNaturezaObjeto(String valor) {
        this.valor = valor;
    }

}
