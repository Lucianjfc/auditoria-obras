package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum TipoArquivoDispensa implements TipoArquivo, EnumValor {

    JUSTIFICATIVA("Justificativa da necessidade do objeto"),
    SITUACAO_EMERGENCIAL("Justificativa da situação de dispensa com os elementos necessários à sua caracterização"),
    JUSTIFICATIVA_FORNECEDOR("Razões da escolha do fornecedor"),
    JUSTIFICATIVA_PRECO("Justificativa de preço, incluindo pesquisa de mercado e mapa comparativo"),
    PROPOSTA_PRECOS("Proposta formal oferecida pelo contratado"),
    PROJETO_BASICO_ORCAMENTO("Termo de Referência ou Projeto básico (se aplicável)"),
    PROVA_DOCUMENTOS_EXAMINADOS("Parecer jurídico sobre a possibilidade de dispensa"),
    MINUTA_CONTRATO("Minuta do contrato"),
    TERMO_RATIFICACAO("Publicação do Termo ou Ato de Ratificação da Dispensa da Licitação"),
    DOCUMENTOS_FORNECEDOR("Documentos de Habilitação e Qualificação do Fornecedor"),
    OUTROS_DOCUMENTOS("Outros documentos");

    private final String valor;

    TipoArquivoDispensa(String valor) {
        this.valor = valor;
    }

    @Override
    public String getTipo() {
        return this.name();
    }
}
