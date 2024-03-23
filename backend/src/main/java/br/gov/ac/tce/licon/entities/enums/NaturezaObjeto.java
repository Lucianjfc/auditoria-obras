package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum NaturezaObjeto implements EnumValor {

    ALIENACAO_DE_BENS("Alienação de Bens", CategoriaNaturezaObjeto.SERVICOS),
    CONCESSAO("Concessão", CategoriaNaturezaObjeto.SERVICOS),
    LOCACAO_DE_BENS("Locação de Bens", CategoriaNaturezaObjeto.SERVICOS),
    BENS_SERVICOS_ESPECIAIS("Bens/Serviços especiais", CategoriaNaturezaObjeto.SERVICOS),
    SERVICOS_DE_ENGENHARIA("Serviços de Engenharia", CategoriaNaturezaObjeto.OBRAS),
    PERMISSAO("Permissão", CategoriaNaturezaObjeto.SERVICOS),
    CONSULTORIA("Consultoria", CategoriaNaturezaObjeto.SERVICOS),
    COMPRAS("Compras", CategoriaNaturezaObjeto.COMPRAS),
    PRESTACAO_DE_SERVICO("Prestação de Serviços", CategoriaNaturezaObjeto.SERVICOS),
    PRESTACAO_DE_SERVICO_FORNECIMENTO_MATERIAL("Prestação de Serviços com Fornecimento de Material", CategoriaNaturezaObjeto.SERVICOS),
    OBRAS("Obras", CategoriaNaturezaObjeto.OBRAS),
    OUTROS_SERVICOS("Outros Serviços", CategoriaNaturezaObjeto.SERVICOS);

    private String	valor;

    private CategoriaNaturezaObjeto categoria;

    NaturezaObjeto(String valor, CategoriaNaturezaObjeto categoria) {
        this.valor = valor;
        this.categoria = categoria;
    }

}
