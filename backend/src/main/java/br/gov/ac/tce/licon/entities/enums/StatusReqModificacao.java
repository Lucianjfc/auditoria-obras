package br.gov.ac.tce.licon.entities.enums;

public enum StatusReqModificacao implements EnumValor {

    ENVIADA("Aguardando Julgamento"),
    ACEITA("DEFERIDA"),
    NEGADA("INDEFERIDA");

    private String valor;

    StatusReqModificacao(String valor) {
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
