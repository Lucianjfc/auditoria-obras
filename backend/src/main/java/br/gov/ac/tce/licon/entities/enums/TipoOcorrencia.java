package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum TipoOcorrencia implements EnumValor {

    CANCELAR("Cancelada"),
    FINALIZAR("Finalizada"),
    SUSPENDER("Suspensa"),
    PRORROGAR("Prorrogada"),
    REABRIR("Reaberta");

    private String	valor;

    TipoOcorrencia(String valor) {
        this.valor = valor;
    }

}
