package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum ModalidadeLicitacao implements EnumValor {

    CARTA_CONVITE("Convite"),
    CONCORRENCIA("Concorrência"),
    PREGAO_PRESENCIAL("Pregão Presencial"),
    PREGAO_ELETRONICO("Pregão Eletrônico"),
    TOMADA_DE_PRECO("Tomada de Preços"),
    LEILAO("Leilão"),
    RDC("RDC - Regime Diferenciado de Contratação"),
    LPN("LPN - Licitação Pública Nacional"),
    LPNI("LPNI - Licitação Pública Nacional e Internacional"),
    SHOPPING("Shopping"),
    SELECAO("Seleção de Consultores"),
    CHAMAMENTO("Chamamento Público");

    private String	valor;

    ModalidadeLicitacao(String valor) {
        this.valor = valor;
    }

}
