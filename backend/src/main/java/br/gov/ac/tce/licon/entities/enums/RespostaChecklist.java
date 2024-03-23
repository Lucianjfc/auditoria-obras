package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum RespostaChecklist implements EnumValor {

    SELECIONE("Selecione"),
    SIM("Sim"),
    NAO("Não"),
    JUSTIFICADO("Justificado"),
    NAO_APLICA("Não se aplica");

    private String valor;
    RespostaChecklist(String valor) {
        this.valor = valor;
    }

}
