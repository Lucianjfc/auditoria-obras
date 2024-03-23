package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum TipoGrupoCJUR implements EnumValor {

    ADMINISTRADOR("ADMINISTRADOR", "Administrador"),
    AUDITOR("AUDITOR", "Auditor"),
    JURISDICIONADO("JURISDICIONADO", "Jurisdicionado");

    private String codigo;
    private String label;

    TipoGrupoCJUR(String codigo, String label) {
        this.codigo = codigo;
        this.label = label;
    }

    @Override
    public String getValor() {
        return codigo + " - " + label;
    }
}
