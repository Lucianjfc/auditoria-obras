package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum TipoSituacao implements EnumValor {
    REMOVIDO("Removido"),
    ATIVO("Ativo");

    private String valor;

    TipoSituacao(String valor) {
        this.valor = valor;
    }
}
