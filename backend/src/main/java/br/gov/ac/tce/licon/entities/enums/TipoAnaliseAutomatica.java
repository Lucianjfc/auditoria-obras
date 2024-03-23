package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum TipoAnaliseAutomatica implements TipoArquivo, EnumValor {

    VALOR("Por valor"),
    OBJETO("Por objeto");

    private String valor;

    TipoAnaliseAutomatica(String valor) {
        this.valor = valor;
    }

    @Override
    public String getTipo() {
        return this.name();
    }

}
