package br.gov.obras.services.advancedSearch;

import br.gov.obras.dtos.requests.advancedSearch.AdvancedSearchParameter;
import br.gov.obras.dtos.requests.advancedSearch.SearchOperator;
import br.gov.obras.entities.AbstractIdentificavel;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.metamodel.internal.EntityTypeImpl;
import org.hibernate.query.criteria.internal.path.RootImpl;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import javax.persistence.metamodel.Attribute;
import javax.persistence.metamodel.PluralAttribute;
import javax.persistence.metamodel.SingularAttribute;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public interface IAdvancedSpecification<E> extends Specification<E> {

    default boolean isNull(Object value) {
        return value == null;
    }

    default boolean isNull(String value) {
        return value == null || value.trim().isEmpty();
    }

    default Predicate getPredicateAttributesJoin(Set<Attribute> atts, CriteriaBuilder builder, Join joinObject, AdvancedSearchParameter parameter) {
        List<Predicate> predicates = new ArrayList<>();

        atts.forEach(relationshipAttribute -> {
            if ("id".equals(relationshipAttribute.getName()) && parameter.getValue().toString().matches("^[0-9]+$")) {
                Long convertedId = Long.parseLong(parameter.getValue().toString());
                parameter.setValue(convertedId);
            }
            if (!AbstractIdentificavel.class.isAssignableFrom(relationshipAttribute.getJavaType()) && (parameter.getValue()).getClass().isAssignableFrom(relationshipAttribute.getJavaType())) {
                if (parameter.getOperator().equals(SearchOperator.CONTAINS) && String.class.isAssignableFrom(relationshipAttribute.getJavaType())) {
                    predicates.add(builder.like(joinObject.get(relationshipAttribute.getName()), "%" + parameter.getValue().toString() + "%"));
                    predicates.add(builder.like(builder.function("DBO.REMOVE_ACENTUACAO", String.class, builder.upper(joinObject.get(relationshipAttribute.getName()))), "%" + StringUtils.stripAccents(parameter.getValue().toString()).toUpperCase() + "%"));
                } else if (parameter.getOperator().equals(SearchOperator.EQUAL_TO)) {
                    predicates.add(builder.equal(joinObject.get(relationshipAttribute.getName()), parameter.getValue().toString()));
                } else if (parameter.getOperator().equals(SearchOperator.NOT_EQUAL_TO)) {
                    predicates.add(builder.notEqual(joinObject.get(relationshipAttribute.getName()), parameter.getValue().toString()));
                } else if (parameter.getOperator().equals(SearchOperator.GREATER_THAN)) {
                    predicates.add(builder.greaterThan(joinObject.get(relationshipAttribute.getName()), parameter.getValue().toString()));
                } else if (parameter.getOperator().equals(SearchOperator.GREATER_THAN_EQUAL)) {
                    predicates.add(builder.greaterThanOrEqualTo(joinObject.get(relationshipAttribute.getName()), parameter.getValue().toString()));
                } else if (parameter.getOperator().equals(SearchOperator.LESSER_THAN)) {
                    predicates.add(builder.lessThan(joinObject.get(relationshipAttribute.getName()), parameter.getValue().toString()));
                } else if (parameter.getOperator().equals(SearchOperator.LESSER_THAN_EQUAL)) {
                    predicates.add(builder.lessThanOrEqualTo(joinObject.get(relationshipAttribute.getName()), parameter.getValue().toString()));
                }
            }
        });

        return !predicates.isEmpty() ? builder.or(predicates.toArray(new Predicate[0])) : null;
    }

    default Predicate getPredicateAttributesComparable(Root<E> root, CriteriaBuilder builder, SingularAttribute singularAttribute, AdvancedSearchParameter parameter) {
        Predicate predicate = null;
        Comparable value = getParameterValue(parameter.getValue(), singularAttribute.getJavaType());
        if (LocalDateTime.class.isAssignableFrom(singularAttribute.getJavaType())) {
            LocalDateTime inicio = LocalDateTime.of(LocalDate.parse(value.toString()), LocalTime.MIN);
            LocalDateTime fim = LocalDateTime.of(LocalDate.parse(value.toString()), LocalTime.MAX);
            predicate = getPredicateLocalDateTime(builder, root, parameter, inicio, fim);
        } else {
            if (parameter.getOperator().equals(SearchOperator.CONTAINS) && String.class.isAssignableFrom(singularAttribute.getJavaType())) {
                predicate = builder.like(builder.function("DBO.REMOVE_ACENTUACAO", String.class, builder.upper(root.get(parameter.getField()))), "%" + StringUtils.stripAccents(value.toString()).toUpperCase() + "%");
            } else if (parameter.getOperator().equals(SearchOperator.EQUAL_TO)) {
                predicate = builder.equal(root.get(parameter.getField()), value);
            } else if (parameter.getOperator().equals(SearchOperator.NOT_EQUAL_TO)) {
                predicate = builder.notEqual(root.get(parameter.getField()), value);
            } else if (parameter.getOperator().equals(SearchOperator.GREATER_THAN)) {
                predicate = builder.greaterThan(root.get(parameter.getField()), value);
            } else if (parameter.getOperator().equals(SearchOperator.GREATER_THAN_EQUAL)) {
                predicate = builder.greaterThanOrEqualTo(root.get(parameter.getField()), value);
            } else if (parameter.getOperator().equals(SearchOperator.LESSER_THAN)) {
                predicate = builder.lessThan(root.get(parameter.getField()), value);
            } else if (parameter.getOperator().equals(SearchOperator.LESSER_THAN_EQUAL)) {
                predicate = builder.lessThanOrEqualTo(root.get(parameter.getField()), value);
            }
        }
        return predicate;
    }

    default Predicate getPredicateSingularAttribute(Root<E> root, CriteriaBuilder builder, AdvancedSearchParameter parameter, SingularAttribute singularAttribute) {
        Predicate predicate = null;
        if (AbstractIdentificavel.class.isAssignableFrom(singularAttribute.getJavaType()) && !SearchOperator.HORIZONTAL_ENTITY_FILTER.equals(parameter.getOperator())) {
            Join<Object, Object> joinObject = root.join(singularAttribute);
            Set<Attribute> atts = ((EntityTypeImpl) joinObject.getModel()).getAttributes();
            predicate = getPredicateAttributesJoin(atts, builder, joinObject, parameter);
        } else {
            predicate = getPredicateAttributesComparable(root, builder, singularAttribute, parameter);
        }
        return predicate;
    }

    default Predicate getPredicatePluralAttribute(Root<E> root, CriteriaBuilder builder, CriteriaQuery query, AdvancedSearchParameter parameter, PluralAttribute pluralAttribute) {
        Predicate predicate = null;
        if (AbstractIdentificavel.class.isAssignableFrom(pluralAttribute.getElementType().getJavaType())) {
            if (List.class.isAssignableFrom(parameter.getValue().getClass())) {
                List<Predicate> auxList = (List<Predicate>) ((List) parameter.getValue()).stream().map((value) -> {
                    AdvancedSearchParameter param = new AdvancedSearchParameter(parameter.getField(), SearchOperator.EQUAL_TO, value);
                    return this.getPredicatePluralAttribute(root, builder, query, param, pluralAttribute);
                }).collect(Collectors.toList());
                predicate = builder.and(auxList.toArray(new Predicate[0]));
            } else {
                Subquery sub = query.subquery(((RootImpl<Object>) root).getEntityType().getJavaType());
                Root<Object> subRoot = sub.from(((RootImpl<Object>) root).getEntityType().getJavaType());
                Join join = subRoot.join(parameter.getField());
                Set<Attribute> atts = ((EntityTypeImpl) pluralAttribute.getElementType()).getAttributes();
                sub.select(subRoot.get("id")).where(getPredicateAttributesJoin(atts, builder, join, parameter));
                predicate = builder.in(root.get("id")).value(sub);
            }
        }
        return predicate;
    }

    default Predicate getPredicate(CriteriaBuilder builder, Root<E> root, CriteriaQuery query, AdvancedSearchParameter parameter) {
        Predicate predicate = null;
        if (!isNull(parameter) || (isNull(parameter) && (parameter.getOperator().equals(SearchOperator.IS_NOT_NULL) || parameter.getOperator().equals(SearchOperator.IS_NULL)))) {
            if (parameter.getOperator().equals(SearchOperator.IS_NULL)) {
                predicate = builder.isNull(root.get(parameter.getField()));
            } else if (parameter.getOperator().equals(SearchOperator.IS_NOT_NULL)) {
                predicate = builder.isNotNull(root.get(parameter.getField()));
            } else if (parameter.getOperator().equals(SearchOperator.NOT_IN)) {
                if (!parameter.getValues().isEmpty()) {
                    List<Object> values = parameter.getValues();
                    Path<?> idPath = root.get(parameter.getField());
                    predicate = builder.not(idPath.in(values));
                }
            } else if (parameter.getOperator().equals(SearchOperator.IN)) {
                if (List.class.isAssignableFrom(parameter.getValue().getClass()) && !((List) parameter.getValue()).isEmpty()) {
                    List values = (List) parameter.getValue();
                    Path<?> idPath = root.get(parameter.getField());
                    Class fieldType = idPath.getJavaType();
                    if (Enum.class.isAssignableFrom(fieldType)) {
                        values = (List) values.stream().map(value -> Enum.valueOf(fieldType, value.toString())).collect(Collectors.toList());
                    }
                    predicate = idPath.in(values);
                }
            } else {
                Attribute attribute = root.getModel().getAttribute(parameter.getField());
                if (attribute instanceof SingularAttribute) {
                    predicate = this.getPredicateSingularAttribute(root, builder, parameter, (SingularAttribute) attribute);
                } else if (attribute instanceof PluralAttribute) {
                    predicate = this.getPredicatePluralAttribute(root, builder, query, parameter, (PluralAttribute) attribute);
                }
            }
        }
        return predicate;
    }

    default Predicate getPredicateLocalDateTime(CriteriaBuilder builder, Root<E> root, AdvancedSearchParameter parameter, LocalDateTime dateInitial, LocalDateTime dateFinal) {
        if (parameter.getOperator().equals(SearchOperator.EQUAL_TO)) {
            return builder.between(root.get(parameter.getField()), dateInitial, dateFinal);
        } else if (parameter.getOperator().equals(SearchOperator.NOT_EQUAL_TO)) {
            return builder.not(builder.between(root.get(parameter.getField()), dateInitial, dateFinal));
        } else if (parameter.getOperator().equals(SearchOperator.GREATER_THAN)) {
            return builder.greaterThan(root.get(parameter.getField()), dateFinal);
        } else if (parameter.getOperator().equals(SearchOperator.GREATER_THAN_EQUAL)) {
            return builder.greaterThanOrEqualTo(root.get(parameter.getField()), dateInitial);
        } else if (parameter.getOperator().equals(SearchOperator.LESSER_THAN)) {
            return builder.lessThan(root.get(parameter.getField()), dateInitial);
        } else if (parameter.getOperator().equals(SearchOperator.LESSER_THAN_EQUAL)) {
            return builder.lessThanOrEqualTo(root.get(parameter.getField()), dateFinal);
        }
        return null;
    }

    default Comparable getParameterValue(Object value, Class javaType) {
        if (LocalDate.class.isAssignableFrom(javaType) || LocalDateTime.class.isAssignableFrom(javaType)) {
            return LocalDate.parse(value.toString());
        } else if (Boolean.class.isAssignableFrom(javaType)) {
            return Boolean.parseBoolean(value.toString());
        } else if (Enum.class.isAssignableFrom(javaType)) {
            return Enum.valueOf(javaType, value.toString());
        }
        return value.toString();
    }

}
