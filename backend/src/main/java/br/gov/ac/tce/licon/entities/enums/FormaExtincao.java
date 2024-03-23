package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum FormaExtincao implements EnumValor {

    UNILATERAL_POR_ESCRITO("Ato unilateral da administração: por escrito"),
    UNILATERAL_CONDUTA_ADMINISTRACAO("Ato unilateral da administração: não pode decorrer de conduta da administração"),
    CONSENSUAL_CONCILIACAO("Consensual: Conciliação"),
    CONSENSUAL_MEDIACAO("Consensual: Mediação"),
    CONSENSUAL_COMITE("Consensual: Comitê de resolução de disputas"),
    DETERMINACAO_DECISAO_ARBITRAL("Determinação: por decisão arbitral"),
    DETERMINACAO_DECISAO_JUDICIAL("Determinação: por decisão judicial");

    private String valor;

    FormaExtincao(String valor) {
        this.valor = valor;
    }

}
