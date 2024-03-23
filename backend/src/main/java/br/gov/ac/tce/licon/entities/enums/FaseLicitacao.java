package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum FaseLicitacao implements EnumValor {

    PREPARATORIA("Preparatória"),
    DIVULGACAO_PUBLICACAO_LICITACAO("Divulgação e publicação da licitação"),
    APRESENTACAO_PROPOSTAS_LANCES("Apresentação de propostas e lances"),
    FINALIZACAO("Finalização");

    private String	valor;

    FaseLicitacao(String valor) {
        this.valor = valor;
    }

    public boolean ehAnteriorOuIgual(FaseLicitacao outraFase) {
    	return this.ordinal() <= outraFase.ordinal();
    }
}
