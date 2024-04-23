package br.gov.obras.services.specs;

import br.gov.obras.dtos.requests.FilterType;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Path;
import javax.persistence.criteria.Predicate;
import java.util.List;

public interface ISpecification<E> extends Specification<E> {

    default boolean isNull(Object value) {
        return value == null;
    }

    default boolean isNull(String value) {
        return value == null || value.trim().isEmpty();
    }

    default Predicate getPredicate(Path<String> metadata, String value, CriteriaBuilder builder, FilterType filterType) {
        if (!isNull(value)) {
            if (filterType == null || filterType.equals(FilterType.FILTER)) {
                return builder.equal(metadata, value);
            } else {
                return builder.like(metadata, "%" + value + "%");
            }
        }
        return null;
    }

    default Predicate getPredicate(Path<?> metadata, Object value, CriteriaBuilder builder, FilterType filterType) {
        if (!isNull(value) && (filterType == null || filterType.equals(FilterType.FILTER))) {
            return builder.equal(metadata, value);
        }

        return null;
    }

    default Predicate getPredicate(Expression<?> metadata, Object value, CriteriaBuilder builder, FilterType filterType) {
        if (!isNull(value) && (filterType == null || filterType.equals(FilterType.FILTER))) {
            CriteriaBuilder.In<Object> in = builder.in(metadata);
            return in.value(value);
        }

        return null;
    }

    default void addIfExists(Predicate predicate, List<Predicate> predicateList) {
        if (!isNull(predicate)) {
            predicateList.add(predicate);
        }
    }

}
