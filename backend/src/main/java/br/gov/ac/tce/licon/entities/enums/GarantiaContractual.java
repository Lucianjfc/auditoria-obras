package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum GarantiaContractual implements EnumValor {

    CAUCAO_DINHEIRO("Caução em dinheiro ou em títulos da dívida pública"),
    SEGURO_GARANTIA("Seguro-Garantia"),
    FIANCA_BANCARIA("Fiança Bancária");

    private String valor;

    GarantiaContractual(String valor) {
        this.valor = valor;
    }

}
