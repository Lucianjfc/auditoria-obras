package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum TipoTemporal implements EnumValor {

    HORAS("Horas"),
    DIAS("Dias"),
    DIAS_UTEIS("Dias Úteis"),
    SEMANAS("Semanas"),
    MESES("Meses"),
    ANOS("Anos");

    private String valor;

    TipoTemporal(String valor) {
        this.valor = valor;
    }

}
