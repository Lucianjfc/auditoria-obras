package br.gov.ac.tce.licon.entities.enums;

public enum StatusAlertaAnalise {

    ENCAMINHADO("Encaminhado"),
    DEVOLVIDO("Devolvido"),
    JURISDICIONADO("Com jurisdicionados"),
    AUDITOR_ATRIBUIDOR("Com Auditor Atribuidor"),
    REJEITADO_AUDITOR_ATRIBUIDOR("Rejeitado Auditor Atribuidor"),
    RESPONDIDO("Respondido"),
    ARQUIVADO("Arquivado"),
    ESCLARECIDO("Esclarecimentos Iniciais");

    private String valor;

    StatusAlertaAnalise(String valor) {
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
