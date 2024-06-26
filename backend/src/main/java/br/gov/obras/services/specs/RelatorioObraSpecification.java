package br.gov.obras.services.specs;

import br.gov.obras.dtos.requests.RelatorioObraFiltroRequest;
import br.gov.obras.entities.RelatorioObra;
import br.gov.obras.entities.RelatorioObra_;
import lombok.AllArgsConstructor;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
public class RelatorioObraSpecification implements ISpecification<RelatorioObra> {

    private static final long serialVersionUID = 4773106106434275129L;

    private final RelatorioObraFiltroRequest filtro;

    @Override
    public Predicate toPredicate(Root<RelatorioObra> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
        List<Predicate> predicados = new ArrayList<>();

        addIfExists(getPredicate(root.get(RelatorioObra_.titulo), filtro.getTitulo(), builder, filtro.getFilterType()), predicados);

        return builder.and(predicados.toArray(new Predicate[0]));
    }

}
