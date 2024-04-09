package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum TipoEntidade implements EnumValor {

    RELATORIO_OBRA("RelatorioObra");
    private final String valor;

    TipoEntidade(String valor) {
        this.valor = valor;
    }
}
