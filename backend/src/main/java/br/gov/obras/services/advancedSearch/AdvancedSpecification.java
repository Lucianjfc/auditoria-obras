package br.gov.obras.services.advancedSearch;

import br.gov.obras.dtos.requests.advancedSearch.AdvancedSearchParameter;
import br.gov.obras.dtos.requests.advancedSearch.AdvancedSearchRequest;
import lombok.AllArgsConstructor;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
public class AdvancedSpecification<E> implements IAdvancedSpecification<E> {

    private final AdvancedSearchRequest filtro;

    @Override
    public Predicate toPredicate(Root<E> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
        List<Predicate> predicadosAnd = new ArrayList<>();
        List<Predicate> predicadosOr = new ArrayList<>();
        List<Predicate> predicados = new ArrayList<>();

        for (AdvancedSearchParameter parameter : filtro.getAndParameters()) {
            Predicate predicate = getPredicate(builder, root, query, parameter);

            if (predicate != null) {
                predicadosAnd.add(predicate);
            }
        }

        for (AdvancedSearchParameter parameter : filtro.getOrParameters()) {
            Predicate predicate = getPredicate(builder, root, query, parameter);

            if (predicate != null) {
                predicadosOr.add(predicate);
            }
        }

        if (!predicadosAnd.isEmpty()) {
            predicados.add(builder.and(predicadosAnd.toArray(new Predicate[0])));
        }
        if (!predicadosOr.isEmpty()) {
            predicados.add(builder.or(predicadosOr.toArray(new Predicate[0])));
        }

        return builder.and(predicados.toArray(new Predicate[0]));
    }

}
