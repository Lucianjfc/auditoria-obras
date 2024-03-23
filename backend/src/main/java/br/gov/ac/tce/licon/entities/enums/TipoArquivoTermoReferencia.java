package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum TipoArquivoTermoReferencia implements TipoArquivo, EnumValor {

    ARQUIVO_TERMO_REFERENCIA("Arquivo do Termo de Referência"),
    PROJETO_BASICO("Projeto Básico"),
    OUTROS_DOCUMENTOS("Outros documentos");

    private final String valor;

    TipoArquivoTermoReferencia(String valor) {
        this.valor = valor;
    }

    @Override
    public String getTipo() {
        return this.name();
    }
}
