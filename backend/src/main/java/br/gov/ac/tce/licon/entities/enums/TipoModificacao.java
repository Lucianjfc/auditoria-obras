package br.gov.ac.tce.licon.entities.enums;

public enum TipoModificacao implements EnumValor {

    REMOCAO("Remoção"),
    EDICAO("Edição"),
    ADICAO("Adição");

    private String valor;

    TipoModificacao(String valor) {
        this.valor = valor;
    }

    @Override
    public String toString() {
        return this.valor;
    }

    public String getValor() {
        return valor;
    }

}
