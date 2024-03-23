package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum SituacaoParecer implements EnumValor {

    SIM("Sim"),
    NAO("Não"),
    PARCIALMENTE("Parcialmente"),
    NAO_APLICA("N/A");

    private String	valor;

    SituacaoParecer(String valor) {
        this.valor = valor;
    }

}
