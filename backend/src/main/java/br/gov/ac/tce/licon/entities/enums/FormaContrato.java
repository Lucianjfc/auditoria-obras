package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum FormaContrato implements EnumValor {

    CONTRATO("Contrato Formal"),
    EQUIVALENTE_SERVICO("Equivalente de Contrato: Ordem de Serviço"),
    EQUIVALENTE_EMPENHO("Equivalente de Contrato: Empenho");

    private String valor;

    FormaContrato(String valor) {
        this.valor = valor;
    }
}
