package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum StatusLicitacao implements EnumValor {

    NAO_PUBLICADA("Não publicada"),
    PUBLICADA("Publicada"),
    REMOVIDA("Removida");

    private String	valor;

    StatusLicitacao(String valor) {
        this.valor = valor;
    }

}
