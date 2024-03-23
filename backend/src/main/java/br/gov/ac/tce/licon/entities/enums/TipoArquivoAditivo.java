package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum TipoArquivoAditivo implements TipoArquivo, EnumValor {

    PUBLICACAO_EXTRATO("Publicação do resumo do aditivo"),
    JUSTIFIVATIVA_ADITIVO("Justificativa"),
    PARECER_JURIDICO_ADM("Parecer Jurídico"),
    CONCORDANCIA_FORNECEDOR("Concordância do Fornecedor"),
    PESQUISA_PRECO("Pesquisa de Preço"),
    OUTROS_DOCUMENTOS("Outros Documentos");

    private final String valor;

    TipoArquivoAditivo(String valor) {
        this.valor = valor;
    }

    @Override
    public String getTipo() {
        return this.name();
    }

}
