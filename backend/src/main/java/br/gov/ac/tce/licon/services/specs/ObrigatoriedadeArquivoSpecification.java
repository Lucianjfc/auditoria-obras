package br.gov.ac.tce.licon.services.specs;

import br.gov.ac.tce.licon.dtos.requests.ObrigatoriedadeArquivoFiltroRequest;
import br.gov.ac.tce.licon.entities.ObrigatoriedadeArquivo;
import br.gov.ac.tce.licon.entities.ObrigatoriedadeArquivo_;
import lombok.AllArgsConstructor;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
public class ObrigatoriedadeArquivoSpecification implements ISpecification<ObrigatoriedadeArquivo> {

	private static final long serialVersionUID = 1L;
	
	private final ObrigatoriedadeArquivoFiltroRequest filtro;

	@Override
	public Predicate toPredicate(Root<ObrigatoriedadeArquivo> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
		List<Predicate> predicados = new ArrayList<>();

		addIfExists(getPredicate(root.get(ObrigatoriedadeArquivo_.ARQUIVO), filtro.getArquivo(), builder, filtro.getFilterType()), predicados);
		addIfExists(getPredicate(root.get(ObrigatoriedadeArquivo_.OBJETO), filtro.getObjeto(), builder, filtro.getFilterType()), predicados);
		addIfExists(getPredicate(root.get(ObrigatoriedadeArquivo_.OBRIGATORIO), filtro.getObrigatorio(), builder, filtro.getFilterType()), predicados);
		addIfExists(getPredicate(root.get(ObrigatoriedadeArquivo_.EXIBIR_PORTAL), filtro.getExibirPortal(), builder, filtro.getFilterType()), predicados);
		addIfExists(getPredicate(root.get(ObrigatoriedadeArquivo_.EXIBIR_PRIMEIRA_FASE), filtro.getExibirPrimeiraFase(), builder, filtro.getFilterType()), predicados);
		return builder.and(predicados.toArray(new Predicate[0]));
	}
	
}
