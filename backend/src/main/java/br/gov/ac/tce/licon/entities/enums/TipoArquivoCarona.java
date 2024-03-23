package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum TipoArquivoCarona implements TipoArquivo, EnumValor {

    JUSTIFICATIVA("Justificativa para contratação"),
    OFICIO_GERENCIADOR("Ofício ao gerenciador da ata pedindo autorização"),
    OFICIO_DETENTOR("Ofício ao detentor da ata pedindo autorização (fornecedor)"),
    PARECER_ASSESSORIA_JURIDICA("Parecer da assessoria jurídica da administração"),
    MAPA_COMPARATIVO("Pesquisa de mercado e mapa comparativo"),
    TERMO_ADESAO("Publicação do Termo de Adesão a Ata de Registro de Preços"),
    OFICIO_RESPOSTAS_GERENCIADOR("Ofício com a resposta do gerenciador da ata com documentos"),
    EDITAL("Edital e anexos"),
    PARECER_GERENCIADOR("Parecer da assessoria jurídica"),
    PROPOSTAS_VENCEDORAS("Propostas vencedoras"),
    ATA_RP("Ata de Registro de preços"),
    HOMOLOGACAO("Termo de Homologação"),
    OFICIO_RESPOSTAS_DETENTOR("Ofício com a resposta do detentor da ata (fornecedor)"),
    OUTROS_DOCUMENTOS("Outros documentos");

    private final String valor;

    TipoArquivoCarona(String valor) {
        this.valor = valor;
    }

    @Override
    public String getTipo() {
        return this.name();
    }
}
