package br.gov.ac.tce.licon.entities.enums;

public enum StatusProcessamentoAtosDiarioOficial {

    EM_EXTRACAO("Diário sem atos"),
    EM_CLASSIFICACAO("Diário em processamento"),
    EXTRAINDO_INFORMACOES("Extraindo informacoes"),
    PROCESSADO("Processado");
    private String valor;

    StatusProcessamentoAtosDiarioOficial(String valor) {
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
