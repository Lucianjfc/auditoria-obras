package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum TipoArquivoInexigibilidade implements TipoArquivo, EnumValor {

    JUSTIFICATIVA("Justificativa da necessidade do objeto"),
    SITUACAO_EMERGENCIAL("Justificativa da situação de inexigibilidade com os elementos necessários à sua caracterização"),
    JUSTIFICATIVA_FORNECEDOR("Razões da escolha do fornecedor ou executante"),
    COMPROVANTE("Documento comprovante da inexigibilidade"),
    JUSTIFICATIVA_PRECO("Justificativa detalhada de preços"),
    PROPOSTA_PRECOS("Proposta formal oferecida pelo contratado"),
    PROVA_DOCUMENTOS_EXAMINADOS("Parecer da assessoria jurídica"),
    MINUTA_CONTRATO("Minuta do contrato"),
    TERMO_RATIFICACAO("Publicação do Termo ou Ato de Ratificação da Inexigibilidade de Licitação"),
    HABILITACAO_FORNECEDOR("Documentos de Habilitação e Qualificação do Fornecedor"),
    OUTROS_DOCUMENTOS("Outros documentos");

    private String valor;

    TipoArquivoInexigibilidade(String valor) {
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
