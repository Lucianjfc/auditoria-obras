package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum TipoArquivoOcorrenciaLicitacao implements TipoArquivo, EnumValor {

    MAPA_LANCES("Mapa de Lances"),
    ATA_SESSAO("Ata da Sessão"),
    TERMO_REVOGACAO("Termo de Revogação"),
    TERMO_ANULACAO("Termo de Anulação"),
    OUTROS_DOCUMENTOS("Outros documentos");

    private String valor;

    TipoArquivoOcorrenciaLicitacao(String valor) {
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
