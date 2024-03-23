package br.gov.ac.tce.licon.entities.enums;

import br.gov.ac.tce.licon.dtos.requests.*;
import br.gov.ac.tce.licon.entities.*;
import lombok.Getter;

@Getter
public enum Objeto implements EnumValor {
    RELATORIO_OBRA("Relatório Obra", RelatorioObra.class, ArquivoRelatorioObraDTO.class);

    private String valor;

    private Class tipo;

    private Class tipoArquivoDTO;

    Objeto(String valor) {
        this.valor = valor;
    }

    Objeto(String valor, Class tipo) {
        this.valor = valor;
        this.tipo = tipo;
    }

    Objeto(String valor, Class tipo, Class tipoArquivoDTO) {
        this.valor = valor;
        this.tipo = tipo;
        this.tipoArquivoDTO = tipoArquivoDTO;
    }

    @Override
    public String toString() {
        return this.valor;
    }

}
