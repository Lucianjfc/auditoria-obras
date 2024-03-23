package br.gov.ac.tce.licon.entities.enums;

import lombok.Getter;

@Getter
public enum MotivoAdiamento implements EnumValor {
	
	ALTERACAO_PRAZO("Alteração do prazo"),
	ALTERACAO_VALOR("Alteração de valor"),
	APOSTILAMENTO("Apostilamento");

	private String	valor;

	MotivoAdiamento(String valor) {
		this.valor = valor;
	}

}
