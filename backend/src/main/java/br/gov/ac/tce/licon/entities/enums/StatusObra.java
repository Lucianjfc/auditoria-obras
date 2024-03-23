package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum StatusObra implements EnumValor {

    NAO_INICIADA("Não iniciada"),
    EM_ANDAMENTO("Em andamento"),
    FINALIZADA("Finalizada"),
    INTERROMPIDA("Interrompida"),
    PARALISADA("Paralisada"),
    DESCONHECIDO("Desconhecido");

    private String	valor;

    StatusObra(String valor) {
        this.valor = valor;
    }

}
