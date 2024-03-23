package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum TipoEntidade implements EnumValor {

    ADITIVO("AditivoContrato"),
    CARONA("Carona"),
    CONTRATO("Contrato"),
    DISPENSA("Dispensa"),
    INEXIGIBILIDADE("Inexigibilidade"),
    LICITACAO("Licitação"),
    COMISSAO("Comissão"),
    TDA_LICITACAO("TdaLicitacao"),
    TDA_DISPENSA("TdaDispensa"),
    TDA_INEXIGIBILIDADE("TdaInexigibilidade"),
    TDA_CARONA("TdaCarona"),
    TERMO_REFERENCIA("TermoReferencia"),
    ALERTA_ANALISE("AlertaAnalise"),
    ALERTA_MENSAGEM("AlertaMensagem"),
    REQUISICAO_MODIFICACAO("RequisicaoModificacao"),
    EDITAL("Edital"),
    OBRA_MEDICAO("ObraMedicao"),
    EMPENHO_CONTRATO("EmpenhoContrato"),
    RELATORIO_OBRA("RelatorioObra");

    private final String valor;

    TipoEntidade(String valor) {
        this.valor = valor;
    }
}
