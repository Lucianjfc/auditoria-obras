package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public enum MotivoRescisao implements EnumValor {

    RESCISAO("Rescisão do contrato"),
    NAO_CUMPRIMENTO("Não cumprimento ou cumprimento irregular"),
    DESATENDIMENTO("Desatendimento das determinações"),
    ALTERACAO_SOCIAL("Alteração social ou modificação da finalidade"),
    FALENCIA("Falência, insolvência civil, dissolução da sociedade ou falecimento"),
    FORTUITO("Caso fortuito ou de força maior"),
    LICENCA_AMBIENTAL("Atraso ou impossibilidade de licença ambiental / alteração significativa do anteprojeto em decorrência da licença"),
    ATRASO_LIBERACAO("Atraso na liberação das áreas (desapropriação, servidão, desocupação"),
    INTERESSE_PUBLICO("Razões de interesse público"),
    RESERVA_CARGOS("Não cumprimento de reserva de cargos (pessoa com deficiência, reabilitado da previdência ou aprendiz)"),
    OUTROS("Outros");

    private String valor;

    MotivoRescisao(String valor) {
        this.valor = valor;
    }

}
