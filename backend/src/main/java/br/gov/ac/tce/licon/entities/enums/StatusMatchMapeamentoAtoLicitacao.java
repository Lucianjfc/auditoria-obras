package br.gov.ac.tce.licon.entities.enums;

public enum StatusMatchMapeamentoAtoLicitacao {

    CONFIRMADO("Mapeado"),
    NAO_CONFIRMADO("Mapeado Automático"),
    NAO_MAPEADO("Não Mapeado");

    private String valor;

    StatusMatchMapeamentoAtoLicitacao(String valor) {
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
