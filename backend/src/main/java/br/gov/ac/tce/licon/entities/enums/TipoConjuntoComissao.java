package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;

@Getter
public enum TipoConjuntoComissao implements EnumValor {

    CONTRATACAO("Contratação", "CCT", "Comissão de Contratação"),
    APOIO("Equipe de Apoio", "ACP", "Agente de Contratação/Pregoeiro(a) com equipe de apoio");

    private String valor;
    private String codigo;
    private String descricao;

    TipoConjuntoComissao(String valor, String codigo, String descricao) {
        this.valor = valor;
        this.codigo = codigo;
        this.descricao = descricao;
    }

    @Override
    public String toString() {
        return descricao + " - " + codigo;
    }
}
