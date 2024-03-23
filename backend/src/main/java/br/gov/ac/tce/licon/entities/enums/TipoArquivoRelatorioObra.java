package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum TipoArquivoRelatorioObra implements TipoArquivo, EnumValor {
    PLANILHA_ORCAMENTARIA("Planilha Orcamentaria");

    private String valor;

    TipoArquivoRelatorioObra(String valor) {
        this.valor = valor;
    }

    @Override
    public String toString() {
        return this.valor;
    }

    @Override
    public String getTipo() {
        return this.name();
    }

}
