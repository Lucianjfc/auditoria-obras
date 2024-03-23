package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum Legislacao implements EnumValor {

    LEI_N_14133("Lei Nº 14.133"),
    LEI_N_8666("Lei Nº 8666"),
    OUTRA("Outra");

    private String	valor;

    Legislacao(String valor) {
        this.valor = valor;
    }

}
