package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum FormaPreenchimentoSecao implements EnumValor {

    IMPORTACAO_ARQUIVO("Preenchimento por importação de arquivo"),
    PREENCHIMENTO_MANUAL("Preenchimento manual");

    private String valor;

    FormaPreenchimentoSecao(String valor) {
        this.valor = valor;
    }
}
