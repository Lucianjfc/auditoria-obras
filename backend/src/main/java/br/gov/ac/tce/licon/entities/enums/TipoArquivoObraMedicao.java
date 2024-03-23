package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum TipoArquivoObraMedicao implements TipoArquivo, EnumValor {

    PLANILHA_MEDICOES("Planilha de medições"),
    IMAGEM_MEDICAO("Imagem de medição"),
    OUTROS_DOCUMENTOS("Outros documentos");

    private final String valor;

    TipoArquivoObraMedicao(String valor) {
        this.valor = valor;
    }

    @Override
    public String getTipo() {
        return this.name();
    }
}
