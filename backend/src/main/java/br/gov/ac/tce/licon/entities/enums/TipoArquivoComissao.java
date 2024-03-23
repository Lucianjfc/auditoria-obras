package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum TipoArquivoComissao implements TipoArquivo, EnumValor {

    ARQUIVO_COMISSAO("Arquivo da Comissão");

    private final String valor;

    TipoArquivoComissao(String valor) {
        this.valor = valor;
    }

    @Override
    public String getTipo() {
        return this.name();
    }
}
