package br.gov.ac.tce.licon.entities;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;

@Data
@MappedSuperclass
@ToString
@EqualsAndHashCode
public abstract class AbstractRequisicaoModificacaoIdentificavel extends AbstractIdentificavel {

	@Column(name = "ID_REQUISICAO_MODIFICACAO")
	protected Long idRequisicaoModificacao;

	public abstract String titulo();

}
