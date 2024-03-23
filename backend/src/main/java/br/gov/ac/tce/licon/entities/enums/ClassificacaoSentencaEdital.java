package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum ClassificacaoSentencaEdital implements EnumValor {

    OBJETO("Objeto"),
    QUALIFICACAO_TECNICA("Qualificação Técnica"),
    PRAZO_DE_PAGAMENTO("Prazo de Pagamento"),
    CLAUSULA_DE_ATRASO("Cláusula de Atraso"),
    PRAZO_DE_ENTREGA("Prazo de Entrega"),
    LOCAL_ENTREGA_OU_EXECUCAO("Local de Entrega ou Execução"),
    OUTRO("Outro");

    private String valor;

    ClassificacaoSentencaEdital(String valor) {
        this.valor = valor;
    }

}
