package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum TipoAquisicao implements EnumValor {

    LICITACAO("Licitação"),
    CARONA("Adesão (Carona)"),
    DISPENSA("Dispensa"),
    INEXIGIBILIDADE("Inexigibilidade");

    private String valor;

    TipoAquisicao(String valor) {
        this.valor = valor;
    }

}
