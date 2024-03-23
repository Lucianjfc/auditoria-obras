package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;

@Getter
public enum TipoComissao implements EnumValor {

    PERMANENTE("Permanente", "CPL", "Comissão Permanente de Licitação"),
    ESPECIAL("Especial", "CEL", "Comissão Especial de Licitação");

    private String valor;
    private String codigo;
    private String descricao;

    TipoComissao(String valor, String codigo, String descricao) {
        this.valor = valor;
        this.codigo = codigo;
        this.descricao = descricao;
    }

    @Override
    public String toString() {
        return descricao + " - " + codigo;
    }

}
