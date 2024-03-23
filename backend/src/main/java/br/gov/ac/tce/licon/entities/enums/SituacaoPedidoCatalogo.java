package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum SituacaoPedidoCatalogo implements EnumValor {

    PENDENTE("Pendente"),
    DEFERIDO("Deferido"),
    INDEFERIDO("Indeferido");

    private String	valor;

    SituacaoPedidoCatalogo(String valor) {
        this.valor = valor;
    }

}
